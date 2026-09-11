#!/usr/bin/env bash
#
# Take the CMS's database to a file on this host.
#
#     ./infra/production/cms-host/database/dump.sh [label]
#
# The label is optional and ends up in the filename — `before-5.52.2` reads
# better at two in the morning than a timestamp alone does.
#
# The document this script belongs to is docs/db-backup.md. When it is being
# run because something has gone wrong, docs/db-rollback.md is the one to read
# first — a dump is the *secondary* recovery path there, behind an RDS snapshot
# taken immediately before the upgrade.
#
# Strapi's own `strapi export` is deliberately not what this is. That command
# excludes admin users and API tokens, and its import deletes the target's data
# and uploads before writing and requires the schemas to match — which is
# exactly what a version upgrade changes. This is a database-level dump: every
# row, including the admin accounts you will need in order to log in and check
# that the rollback worked.
#
# The dump is written in PostgreSQL's custom format, which `pg_restore` can
# restore selectively — one table out of the archive, when the whole database
# is not what went wrong.
#
# It contains every row in the database, password hashes included. It is
# therefore written outside the checkout, 0600, into a 0700 directory; the
# script refuses to write inside the checkout at all. That is not squeamishness:
# `pnpm package` tars the working tree, and .tarignore excludes only .git,
# node_modules, macOS litter and the tarball itself — so a dump left in the
# checkout would be packaged and shipped with the next deploy.
#

set -euo pipefail

. "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/connection.sh"

DUMP_DIRECTORY="${DUMP_DIR:-/var/backups/gdl/database}"

usage () {
	printf '\n  Take the CMS database to a file on this host.\n\n'
	printf '    ./infra/production/cms-host/database/dump.sh [label]\n\n'
	printf '  The label is optional and lands in the filename. DUMP_DIR overrides where\n'
	printf '  the file goes; it may not be inside the checkout.\n\n'
	printf '  Documented at docs/db-backup.md. If something is broken right now,\n'
	printf '  read docs/db-rollback.md first.\n\n'
	exit 0
}

case "${1:-}" in
	-h|--help ) usage ;;
esac

#
# Filenames go into shell commands during a rollback, so the label is held to
# characters that cannot become anything else.
#
label="$( printf '%s' "${1:-}" | tr -c 'A-Za-z0-9._-' '-' | sed -e 's/^-*//' -e 's/-*$//' )"

load_connection
describe_target

#
# Both binaries are resolved before anything is written. pg_restore is not used
# until after the dump, but a `fail` inside a command substitution exits only
# the subshell — so resolving it inline down there would swallow its own error
# and report a good dump as unreadable.
#
pg_dump_binary="$( resolve_pg_binary pg_dump )"
pg_restore_binary="$( resolve_pg_binary pg_restore )"
assert_client_is_new_enough "$pg_dump_binary"

# --- Where it goes ----------------------------------------------------------

#
# Make a path absolute and real without requiring it to exist yet: walk up to
# the deepest ancestor that does exist, resolve that with `cd`, and put the rest
# back on. A plain `cd "$dir" && pwd` cannot do this — it fails on a directory
# that has not been created, which is exactly the first run, and the guard below
# would then compare an unresolved relative path against an absolute one and
# wave it through.
#
resolve_path () {
	local target="$1"
	local head tail=""

	case "$target" in
		/* ) : ;;
		*  ) target="$PWD/$target" ;;
	esac

	head="$target"
	while [ ! -d "$head" ] && [ "$head" != "/" ]; do
		tail="$( basename "$head" )${tail:+/$tail}"
		head="$( dirname "$head" )"
	done

	head="$( cd "$head" && pwd )"
	printf '%s' "${head%/}${tail:+/$tail}"
}

#
# A dump inside the checkout is a dump that gets deployed. Both paths are
# resolved before they are compared, so a relative path, a symlink or a `..`
# cannot walk around the check.
#
resolved_dump_directory="$( resolve_path "$DUMP_DIRECTORY" )"
case "$resolved_dump_directory/" in
	"$REPOSITORY_ROOT"/ | \
	"$REPOSITORY_ROOT"/* )
		fail "The dump directory $DUMP_DIRECTORY is inside the checkout at $REPOSITORY_ROOT. A dump holds every row in the database, and anything inside the checkout is deployed with it. Set DUMP_DIR to a path outside."
		;;
esac

if [ ! -d "$DUMP_DIRECTORY" ]; then
	mkdir -p "$DUMP_DIRECTORY" 2>/dev/null || fail "Could not create $DUMP_DIRECTORY. Create it once, owned by this user:

     sudo mkdir -p $DUMP_DIRECTORY && sudo chown \"\$USER\" $DUMP_DIRECTORY && sudo chmod 700 $DUMP_DIRECTORY"
	chmod 700 "$DUMP_DIRECTORY"
fi

[ -w "$DUMP_DIRECTORY" ] || fail "$DUMP_DIRECTORY is not writable by $( id -un )."

#
# The chmod above only runs when this script creates the directory. A directory
# that was already there keeps whatever mode it was given, and these files are
# every row in the database.
#
directory_mode="$( ls -ld "$DUMP_DIRECTORY" | awk '{ print $1 }' )"
case "$directory_mode" in
	?rwx------* ) : ;;
	* ) warn "$DUMP_DIRECTORY is $directory_mode, not rwx------. The dumps themselves are 0600, but the directory lists them to anyone who can read it. Fix with: chmod 700 $DUMP_DIRECTORY" ;;
esac

#
# 077 covers the dump and the checksum beside it. pg_dump creates its output
# file itself, so this is the only thing standing between the file and the
# default umask.
#
umask 077

timestamp="$( date -u '+%Y%m%dT%H%M%SZ' )"
dump_name="cms-${DB_NAME}-${timestamp}"
[ -z "$label" ] || dump_name="${dump_name}-${label}"
dump_file="$DUMP_DIRECTORY/${dump_name}.dump"

# --- Taking it --------------------------------------------------------------

heading "Dumping"
note "to        $dump_file"

#
# --no-owner and --no-privileges keep the archive restorable by whichever role
# does the restoring. On a rollback that may be a different master user on a
# newly created instance, and an archive that insists on the old owner would
# fail at the worst possible moment.
#
if ! "$pg_dump_binary" \
	--format=custom \
	--compress=6 \
	--no-owner \
	--no-privileges \
	--file="$dump_file"
then
	rm -f "$dump_file"
	fail "pg_dump failed. The partial file has been removed so that nothing can be restored from it by mistake.

     If it failed on the certificate: this connection is $PGSSLMODE, and verify-full also checks that the hostname matches the certificate — an RDS endpoint does, a raw IP address does not.
     If it failed on authentication: the credentials came from $CONNECTION_SOURCE."
fi

# --- Checking it ------------------------------------------------------------

#
# A dump nobody has opened is a hope, not a backup. Listing the archive proves
# the file is a complete, readable custom-format archive rather than a
# truncated one.
#
entries="$( "$pg_restore_binary" --list "$dump_file" 2>/dev/null | grep -c '^[0-9]' || true )"
if [ "${entries:-0}" -le 0 ]; then
	rm -f "$dump_file"
	fail "The dump was written but pg_restore cannot read it back. The file has been removed."
fi

checksum="$( sha256_of "$dump_file" )"

if [ -n "$checksum" ]; then
	printf '%s  %s\n' "$checksum" "$( basename "$dump_file" )" > "$dump_file.sha256"
fi

# --- What the code was ------------------------------------------------------

#
# A dump is only half of a rollback. The other half is the code that matches it,
# and the thing most likely to be missing at two in the morning is the answer to
# "what was running when this was taken".
#
# There may well be no git metadata here to read: how the code reaches this
# host is not something this script gets to assume. When there is none, that is
# what gets recorded, rather than a blank.
#
# The lockfile is copied rather than pointed at: it is gitignored, so nothing
# else keeps an old one, and `pnpm install --frozen-lockfile` needs the one that
# matches the code being restored.
#
provenance_file="$dump_file.provenance"

if git -C "$REPOSITORY_ROOT" rev-parse --git-dir >/dev/null 2>&1; then
	code_commit="$( git -C "$REPOSITORY_ROOT" rev-parse HEAD )"
	code_branch="$( git -C "$REPOSITORY_ROOT" rev-parse --abbrev-ref HEAD )"
	if [ -n "$( git -C "$REPOSITORY_ROOT" status --porcelain )" ]; then
		code_state="$code_commit on $code_branch, with uncommitted changes in the working tree"
	else
		code_state="$code_commit on $code_branch, clean"
	fi
else
	code_state="unknown — $REPOSITORY_ROOT is not a git working tree, which is what a tarball deploy leaves behind"
fi

lockfile_state="none found at $REPOSITORY_ROOT/pnpm-lock.yaml"
if [ -f "$REPOSITORY_ROOT/pnpm-lock.yaml" ]; then
	cp "$REPOSITORY_ROOT/pnpm-lock.yaml" "$dump_file.pnpm-lock.yaml"
	lockfile_state="$( basename "$dump_file" ).pnpm-lock.yaml, beside this file"
fi

{
	printf 'dump        %s\n' "$( basename "$dump_file" )"
	printf 'taken       %s\n' "$( date -u '+%Y-%m-%d %H:%M:%S UTC' )"
	printf 'database    %s on %s:%s\n' "$DB_NAME" "$DB_HOST" "$DB_PORT"
	printf 'taken by    %s on %s\n' "$( id -un )" "$( hostname )"
	printf 'code        %s\n' "$code_state"
	printf 'lockfile    %s\n' "$lockfile_state"
	printf 'checkout    %s\n' "$REPOSITORY_ROOT"
	printf '\n'
	printf 'Restoring this dump puts the database back to this moment. The code has\n'
	printf 'to go back with it. See docs/db-rollback.md.\n'
} > "$provenance_file"

heading "Done"
note "file      $dump_file"
note "size      $( du -h "$dump_file" | awk '{ print $1 }' )"
note "entries   $entries"
note "mode      $( ls -l "$dump_file" | awk '{ print $1 }' )"
[ -z "$checksum" ] || note "sha256    $checksum"
note "code      $code_state"

printf '\n'
note "Restore it with:"
note "  $DATABASE_SCRIPT_DIRECTORY/restore.sh $dump_file"
printf '\n'
