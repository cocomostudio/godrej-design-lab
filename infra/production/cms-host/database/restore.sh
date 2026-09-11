#!/usr/bin/env bash
#
# Put a dump back into the CMS's database.
#
#     ./infra/production/cms-host/database/restore.sh <dump-file>
#
# This is destructive and it is meant to be. It drops and recreates everything
# the archive contains, in the database named below, on the host named below.
# It therefore does three things before it touches anything: it states its
# target, it refuses to run without a human typing the database name, and it
# stops the application so that Strapi is not writing into a database being
# replaced underneath it.
#
# It leaves the application stopped. That is deliberate. A database restored to
# its pre-upgrade state must not come up underneath a post-upgrade checkout —
# the checkout is reverted first, and then the operator starts the application.
# docs/db-rollback.md is the document that sequences it.
#
# The restore runs in a single transaction: if any statement fails, the whole
# thing rolls back and the database is left exactly as it was found. What it
# does not do is empty the database first — objects that exist in the database
# but not in the archive survive. When the target has to be *exactly* the
# archive and nothing else, the snapshot path in docs/db-rollback.md is the
# right tool.
#

set -euo pipefail

. "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/connection.sh"

PM2_APP="${PM2_APP_NAME:-cms__godrej-design-lab}"

usage () {
	printf '\n  Put a dump back into the CMS database. Destructive, and deliberately so.\n\n'
	printf '    ./infra/production/cms-host/database/restore.sh <dump-file>\n\n'
	printf '  It states its target, refuses to run without a human typing the database\n'
	printf '  name, stops the application, and leaves it stopped.\n\n'
	printf '  Documented at docs/db-backup.md; the rollback it is usually part of\n'
	printf '  is sequenced in docs/db-rollback.md.\n\n'
	exit 0
}

case "${1:-}" in
	-h|--help|'' ) usage ;;
esac

dump_file="$1"
[ -f "$dump_file" ] || fail "No such file: $dump_file"
[ -r "$dump_file" ] || fail "Cannot read $dump_file"

load_connection

pg_restore_binary="$( resolve_pg_binary pg_restore )"

# --- What is in the file ----------------------------------------------------

archive_header="$( "$pg_restore_binary" --list "$dump_file" 2>/dev/null || true )"
[ -n "$archive_header" ] || fail "$dump_file is not a custom-format archive pg_restore can read. A dump taken by dump.sh is; a plain SQL file is not — restore that one with psql instead."

header_field () {
	printf '%s' "$archive_header" | grep -m 1 "^; *$1:" | sed "s/^; *$1:[[:space:]]*//" || true
}

archive_database="$( header_field 'dbname' )"
archive_created="$( printf '%s' "$archive_header" | grep -m 1 '^; Archive created at' | sed 's/^; Archive created at[[:space:]]*//' || true )"
archive_server="$( header_field 'Dumped from database version' )"
archive_entries="$( printf '%s' "$archive_header" | grep -c '^[0-9]' || true )"

#
# The checksum sidecar is written by dump.sh. Its absence is not an error — a
# dump copied here from somewhere else will not have one — but a mismatch is.
#
if [ -f "$dump_file.sha256" ]; then
	recorded_checksum="$( awk '{ print $1 }' "$dump_file.sha256" )"
	actual_checksum="$( sha256_of "$dump_file" )"

	if [ -z "$actual_checksum" ]; then
		checksum_state="NOT checked — nothing on this host computes a sha256"
	elif [ "$actual_checksum" != "$recorded_checksum" ]; then
		fail "$dump_file does not match the checksum recorded beside it:

       recorded  $recorded_checksum
       actual    $actual_checksum

     The file has been altered or truncated since it was taken. Do not restore it."
	else
		checksum_state="verified against $( basename "$dump_file" ).sha256"
	fi
else
	checksum_state="no checksum file beside it"
fi

# --- What it is about to do -------------------------------------------------

heading "Restoring from"
note "file      $dump_file"
note "size      $( du -h "$dump_file" | awk '{ print $1 }' )"
note "taken     ${archive_created:-unknown}"
note "of        ${archive_database:-unknown} on PostgreSQL ${archive_server:-unknown}"
note "entries   $archive_entries"
note "checksum  $checksum_state"

describe_target
assert_client_is_new_enough "$pg_restore_binary"

if [ -n "$archive_database" ] && [ "$archive_database" != "$DB_NAME" ]; then
	warn "This archive was taken from '$archive_database' and you are restoring it into '$DB_NAME'. That is legitimate after a snapshot restore renamed things around, and it is also what a mistake looks like. Be sure."
fi

#
# A session left open in somebody's psql window is enough to make the DROPs
# below wait forever on a lock, which at two in the morning reads as a hang.
#
# find_pg_binary rather than `command -v`, because the client this host has may
# be the PGDG one under /usr/pgsql-<major>/bin, which is not on PATH — and a
# check that silently never runs is worse than no check.
#
psql_binary="$( find_pg_binary psql )"
if [ -n "$psql_binary" ]; then
	other_sessions="$( "$psql_binary" -X -A -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid()" 2>/dev/null | tr -d '[:space:]' || true )"
	case "$other_sessions" in
		''|0|*[!0-9]* ) : ;;
		* ) warn "$other_sessions other session(s) are connected to $DB_NAME. Stopping the application closes Strapi's pool; anything else — a psql window, a GUI client — will block the restore on a lock until it disconnects." ;;
	esac
fi

# --- Confirmation, part one: is anyone there ---------------------------------

[ -t 0 ] || fail "This script will not run without a terminal to confirm at. Run it from an interactive shell — there is deliberately no flag that skips this."

# --- What stopping the application will mean --------------------------------

#
# Settled before the prompt rather than after it. A confirmation that promises
# the application will be stopped, followed by a discovery that it cannot be,
# is a confirmation given for something that did not happen.
#
pm2_binary=""

if [ "${SKIP_APP_STOP:-}" = "1" ]; then
	stop_plan="NOT stopping anything — SKIP_APP_STOP=1 asserts the application is already down"
else
	pm2_binary="$( command -v pm2 2>/dev/null || true )"
	[ -n "$pm2_binary" ] || fail "No pm2 on PATH, so this script cannot stop the application, and it will not restore into a database something may still be writing to. Stop the application yourself and re-run with SKIP_APP_STOP=1."

	if "$pm2_binary" describe "$PM2_APP" >/dev/null 2>&1; then
		stop_plan="stopping $PM2_APP, and leaving it stopped"
	else
		pm2_binary=""
		stop_plan="NOT stopping anything — PM2 knows no process named $PM2_APP here, so nothing is running under that name. If the CMS is up under another name, abort and set PM2_APP_NAME"
	fi
fi

# --- Confirmation, part two: the database's own name -------------------------

printf '\n'
printf '  This REPLACES the contents of %s on %s.\n' "$DB_NAME" "$DB_HOST"
printf '  It is %s.\n' "$stop_plan"
printf '\n'
printf '  Type the database name (%s) to proceed, anything else to abort: ' "$DB_NAME"
read -r typed_confirmation

if [ "$typed_confirmation" != "$DB_NAME" ]; then
	printf '\n  Aborted. Nothing was changed.\n\n'
	exit 1
fi

# --- Stopping the application -----------------------------------------------

if [ -n "$pm2_binary" ]; then
	heading "Stopping $PM2_APP"
	"$pm2_binary" stop "$PM2_APP" >/dev/null
	note "stopped"
fi

# --- The restore ------------------------------------------------------------

heading "Restoring"

if ! "$pg_restore_binary" \
	--dbname="$DB_NAME" \
	--clean \
	--if-exists \
	--no-owner \
	--no-privileges \
	--single-transaction \
	"$dump_file"
then
	fail "pg_restore failed. Because it ran in a single transaction, nothing was committed — $DB_NAME is as it was before this ran.

     The application is stopped. Do not start it until you know which state the database is in."
fi

# --- What happens next ------------------------------------------------------

heading "Restored"
note "$DB_NAME on $DB_HOST now holds the contents of $( basename "$dump_file" )."

printf '\n'
note "The application is still stopped, on purpose. Put the code back to the state"
note "that matches this database before starting it — a restored schema under a"
note "newer application is the failure this sequence exists to avoid."
printf '\n'

if [ -f "$dump_file.provenance" ]; then
	note "What the code was when this dump was taken:"
	printf '\n'
	sed 's/^/       /' "$dump_file.provenance"
else
	note "There is no .provenance file beside this dump, so nothing here records"
	note "which code it matches. You will have to establish that yourself."
fi

printf '\n'
note "docs/db-rollback.md, 'Putting the code back', has the two shapes that can"
note "take on this host. Then, and only then:"
printf '\n'
note "  pm2 start infra/production/cms-host/pm2/ecosystem.config.cjs --env production && pm2 save"
printf '\n'
note "'pm2 start ... && pm2 save', not 'pm2 restart': PM2 replays the values it"
note "froze at the last save, and a restart does not re-read the host's .env."
printf '\n'
