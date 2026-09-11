#!/usr/bin/env bash
#
# The connection to the CMS's database, resolved from the application's own
# environment file.
#
# Sourced by `dump.sh` and `restore.sh`; it does nothing when run on its own.
# It exists so that there is exactly one place where these scripts decide which
# database they are talking to — and that place is the file Strapi itself
# reads, so the two cannot drift.
#
# What it promises its callers:
#
#   - Connection details come from `apps/cms/.env`, in either of the two forms
#     `apps/cms/config/database.ts` accepts: a `DATABASE_URL` connection
#     string, or the discrete `DATABASE_*` variables. When both are present the
#     connection string wins, because that is what node-postgres does with the
#     configuration Strapi hands it — `ConnectionParameters` parses
#     `connectionString` last and its values overwrite the discrete ones.
#
#   - Nothing secret reaches a command line. Host, port, database and user
#     travel in `PG*` environment variables; the password travels in a 0600
#     password file that is deleted when the script exits. `ps` on a shared
#     box, the shell history, and PM2's logs therefore never see it.
#
#   - TLS is verified — `verify-full`, against a certificate bundle already
#     trusted on this host — whenever the environment file enables TLS, which
#     production's does. Nothing falls back quietly: a verifying mode that can
#     find no bundle stops the script, and an environment file that does not
#     enable TLS at all produces a warning naming what production looks like.
#
# Everything here is bash 3.2 compatible, so that it can be exercised on a
# developer's macOS as well as on the Amazon Linux host.
#

# --- Output -----------------------------------------------------------------

fail () {
	printf '\n  %s\n\n' "$*" >&2
	exit 1
}

warn () {
	printf '  !  %s\n' "$*" >&2
}

note () {
	printf '     %s\n' "$*"
}

heading () {
	printf '\n  %s\n' "$*"
}

# --- Where things are -------------------------------------------------------

#
# This file lives at infra/production/cms-host/database/, four levels below the
# checkout root.
#
DATABASE_SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPOSITORY_ROOT="$( cd "$DATABASE_SCRIPT_DIRECTORY/../../../.." && pwd )"

#
# The application's own environment file. `CMS_ENV_FILE` overrides it, which is
# what a rehearsal against a throwaway database uses.
#
ENV_FILE="${CMS_ENV_FILE:-$REPOSITORY_ROOT/apps/cms/.env}"

# --- Reading the environment file -------------------------------------------

#
# Read one key out of the environment file, applying dotenv's rules rather than
# sourcing the file — sourcing would execute whatever is in it, and would pull
# every other secret in there into this process for no reason.
#
# The rules mirrored here are dotenv's, deliberately, including the awkward one:
# in an *unquoted* value a `#` starts a comment. A password containing `#` has
# to be quoted in the `.env` — and if it is not, Strapi is reading the same
# truncated value this does, so the application is already misconfigured and
# the two agree about it.
#
# The last occurrence of a key wins, which is what both dotenv and Node's own
# `--env-file` do within a single file.
#
# Two things this cannot see, both of which make the application read something
# different from what is read here:
#
#   - `ENV_PATH`. Strapi passes it to dotenv, so a host that sets it is reading
#     another file entirely. Point `CMS_ENV_FILE` at that same file.
#
#   - A `DATABASE_*` already present in the application's environment — from
#     PM2's `env_production` block, say. dotenv does not overwrite a variable
#     that is already set, so that one wins for the application and this file
#     never learns about it. Today PM2 declares only `NODE_ENV`; if that changes,
#     this stops being true.
#
env_value () {
	local key="$1"
	local line value

	line="$( grep -E "^[[:space:]]*(export[[:space:]]+)?${key}[[:space:]]*=" "$ENV_FILE" 2>/dev/null | tail -n 1 || true )"

	if [ -z "$line" ]; then
		printf '%s' ""
		return 0
	fi

	value="${line#*=}"
	value="${value%$'\r'}"
	value="$( printf '%s' "$value" | sed 's/^[[:space:]]*//' )"

	case "$value" in
		'"'*'"' )
			value="${value#\"}"
			value="${value%\"}"
			#
			# dotenv expands \n and \r inside double quotes and nowhere else.
			# Mirrored because Strapi reads this file through dotenv: a value
			# the two disagree about is a password that authenticates for the
			# application and not for these scripts.
			#
			value="${value//\\n/$'\n'}"
			value="${value//\\r/$'\r'}"
			;;
		"'"*"'" )
			value="${value#\'}"
			value="${value%\'}"
			;;
		'`'*'`' )
			value="${value#\`}"
			value="${value%\`}"
			;;
		* )
			value="${value%%#*}"
			value="$( printf '%s' "$value" | sed 's/[[:space:]]*$//' )"
			;;
	esac

	printf '%s' "$value"
}

#
# `%xx` back into bytes, for the parts of a connection string. Backslashes are
# doubled first so that a password containing one is not mangled by `%b`.
#
percent_decode () {
	local value="$1"
	value="${value//\\/\\\\}"
	printf '%b' "${value//%/\\x}"
}

#
# postgres://user:password@host:port/database?sslmode=...
#
# Split from the right: the userinfo can contain an `@` only percent-encoded,
# so the last `@` separates it from the host. An IPv6 literal in brackets is
# refused rather than silently mis-parsed — RDS does not hand out one, and a
# wrong host is the last thing a restore needs.
#
parse_database_url () {
	local url="$1"
	local rest userinfo hostinfo hostport

	case "$url" in
		postgres://*    ) rest="${url#postgres://}" ;;
		postgresql://*  ) rest="${url#postgresql://}" ;;
		* ) fail "DATABASE_URL does not start with postgres:// or postgresql:// — these scripts only speak PostgreSQL." ;;
	esac

	DATABASE_URL_QUERY=""
	case "$rest" in
		*\?* )
			DATABASE_URL_QUERY="${rest#*\?}"
			rest="${rest%%\?*}"
			;;
	esac

	if [ "${rest#*@}" != "$rest" ]; then
		userinfo="${rest%@*}"
		hostinfo="${rest##*@}"
	else
		userinfo=""
		hostinfo="$rest"
	fi

	case "$hostinfo" in
		\[* ) fail "DATABASE_URL carries an IPv6 literal host. Set the discrete DATABASE_HOST / DATABASE_PORT variables instead — this parser will not guess at it." ;;
	esac

	if [ -n "$userinfo" ]; then
		if [ "${userinfo#*:}" != "$userinfo" ]; then
			DB_USER="$( percent_decode "${userinfo%%:*}" )"
			DB_PASSWORD="$( percent_decode "${userinfo#*:}" )"
		else
			DB_USER="$( percent_decode "$userinfo" )"
			DB_PASSWORD=""
		fi
	fi

	hostport="${hostinfo%%/*}"

	if [ "${hostinfo#*/}" != "$hostinfo" ]; then
		DB_NAME="$( percent_decode "${hostinfo#*/}" )"
	fi

	if [ "${hostport#*:}" != "$hostport" ]; then
		DB_HOST="${hostport%%:*}"
		DB_PORT="${hostport##*:}"
	elif [ -n "$hostport" ]; then
		DB_HOST="$hostport"
	fi
}

# --- The password file ------------------------------------------------------

#
# libpq refuses a password file that anyone else can read, which is the point
# of using one. `mktemp` creates it 0600 already; the explicit chmod is there
# so that the guarantee is stated in the script rather than assumed of mktemp.
#
PGPASS_TEMPORARY_FILE=""

remove_password_file () {
	if [ -n "$PGPASS_TEMPORARY_FILE" ] && [ -e "$PGPASS_TEMPORARY_FILE" ]; then
		rm -f "$PGPASS_TEMPORARY_FILE"
	fi
}

#
# INT and TERM get their own handler because bash *resumes* the script after
# running a signal trap. Cleaning up and carrying on would leave PGPASSFILE
# pointing at a file that no longer exists, and the next connection would fail
# for a reason that has nothing to do with why the operator pressed Ctrl-C.
#
trap remove_password_file EXIT
trap 'remove_password_file; exit 130' INT
trap 'remove_password_file; exit 143' TERM

pgpass_escape () {
	printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/:/\\:/g'
}

write_password_file () {
	PGPASS_TEMPORARY_FILE="$( mktemp "${TMPDIR:-/tmp}/gdl-pgpass.XXXXXXXX" )"
	chmod 600 "$PGPASS_TEMPORARY_FILE"

	printf '%s:%s:%s:%s:%s\n' \
		"$( pgpass_escape "$DB_HOST" )" \
		"$( pgpass_escape "$DB_PORT" )" \
		"$( pgpass_escape "$DB_NAME" )" \
		"$( pgpass_escape "$DB_USER" )" \
		"$( pgpass_escape "$DB_PASSWORD" )" \
		> "$PGPASS_TEMPORARY_FILE"

	export PGPASSFILE="$PGPASS_TEMPORARY_FILE"
}

# --- TLS --------------------------------------------------------------------

#
# The bundle to verify the server against, in the order we would rather have
# them. The first two are the merged system stores, which is the right answer
# when the host is in the state it should be in.
#
# It may not be. `docs/Operation Manual.md` step 3.2 downloads the RDS roots to
# `/etc/pki/ca-trust/source/anchors/rds-global.pem` and does **not** run
# `update-ca-trust`, which is what merges an anchor into those bundles — so the
# anchor file is third in this list rather than absent. Current RDS certificates
# chain to Amazon Root CA 1, which every stock bundle already carries, so the
# merge may never have been missed; that is a reason to keep the fall back, not
# to assume it is unnecessary.
#
#
# Note for anyone extending this file: `fail` exits, and an exit inside a
# command substitution only leaves the subshell. So every function called as
# `x="$( f )"` — this one, and find_pg_binary below — answers with an empty
# string and lets its caller, which is running in the real shell, do the
# failing.
#
certificate_bundle () {
	local candidate

	if [ -n "${DB_SSL_ROOT_CERT:-}" ]; then
		[ -r "$DB_SSL_ROOT_CERT" ] || { printf '%s' ""; return 0; }
		printf '%s' "$DB_SSL_ROOT_CERT"
		return 0
	fi

	#
	# config/database.ts hands DATABASE_SSL_CA to node-postgres as `ssl.ca`,
	# which takes the certificate's *contents*, not a path. So a value that
	# happens to name a readable file is used as one, and anything else — PEM
	# text, most likely — falls through to the host's own bundles below rather
	# than being mistaken for a filename.
	#
	local from_env
	from_env="$( env_value DATABASE_SSL_CA )"
	if [ -n "$from_env" ] && [ -f "$from_env" ] && [ -r "$from_env" ]; then
		printf '%s' "$from_env"
		return 0
	fi

	for candidate in \
		/etc/pki/tls/certs/ca-bundle.crt \
		/etc/ssl/certs/ca-certificates.crt \
		/etc/pki/ca-trust/source/anchors/rds-global.pem \
		/etc/ssl/cert.pem
	do
		if [ -r "$candidate" ]; then
			printf '%s' "$candidate"
			return 0
		fi
	done

	printf '%s' ""
}

# --- Resolving the connection ----------------------------------------------

DB_HOST=""
DB_PORT=""
DB_NAME=""
DB_USER=""
DB_PASSWORD=""
DATABASE_URL_QUERY=""
CONNECTION_SOURCE=""
TLS_DESCRIPTION=""

load_connection () {
	[ -r "$ENV_FILE" ] || fail "No readable environment file at $ENV_FILE. On the CMS host that file is the application's own .env; set CMS_ENV_FILE to point elsewhere."

	local client
	client="$( env_value DATABASE_CLIENT )"
	[ -n "$client" ] || client="sqlite"

	case "$client" in
		postgres|postgresql|pg ) : ;;
		* ) fail "DATABASE_CLIENT in $ENV_FILE is '$client'. These scripts only speak PostgreSQL — there is nothing here for a $client database." ;;
	esac

	#
	# The same defaults config/database.ts applies to these five, so that a
	# value missing from the file resolves here exactly as it resolves in the
	# application.
	#
	# DATABASE_SCHEMA is deliberately not among them: pg_dump takes the whole
	# database, every schema in it, so a non-default search path changes nothing
	# about what is captured or restored.
	#
	DB_HOST="$( env_value DATABASE_HOST )"; [ -n "$DB_HOST" ] || DB_HOST="localhost"
	DB_PORT="$( env_value DATABASE_PORT )"; [ -n "$DB_PORT" ] || DB_PORT="5432"
	DB_NAME="$( env_value DATABASE_NAME )"; [ -n "$DB_NAME" ] || DB_NAME="strapi"
	DB_USER="$( env_value DATABASE_USERNAME )"; [ -n "$DB_USER" ] || DB_USER="strapi"
	DB_PASSWORD="$( env_value DATABASE_PASSWORD )"; [ -n "$DB_PASSWORD" ] || DB_PASSWORD="strapi"

	local url
	url="$( env_value DATABASE_URL )"

	if [ -n "$url" ]; then
		parse_database_url "$url"
		CONNECTION_SOURCE="DATABASE_URL in $ENV_FILE"
	else
		CONNECTION_SOURCE="the DATABASE_* variables in $ENV_FILE"
	fi

	export PGHOST="$DB_HOST"
	export PGPORT="$DB_PORT"
	export PGDATABASE="$DB_NAME"
	export PGUSER="$DB_USER"
	export PGCONNECT_TIMEOUT="${PGCONNECT_TIMEOUT:-15}"

	#
	# A PGPASSWORD inherited from the operator's shell would take precedence
	# over the password file and quietly reintroduce the second source of truth
	# this whole file exists to prevent.
	#
	unset PGPASSWORD || true

	if [ -n "$DB_PASSWORD" ]; then
		write_password_file
	fi

	configure_tls
}

configure_tls () {
	local ssl_enabled ssl_mode reject_unauthorized bundle query_mode

	ssl_enabled="$( env_value DATABASE_SSL | tr '[:upper:]' '[:lower:]' )"

	query_mode=""
	case "${DATABASE_URL_QUERY:-}" in
		*sslmode=* )
			query_mode="${DATABASE_URL_QUERY#*sslmode=}"
			query_mode="${query_mode%%&*}"
			;;
	esac

	#
	# DB_SSLMODE exists for a rehearsal against a database that speaks no TLS.
	# It is refused when the environment file enables TLS, because an override
	# that can quietly weaken production is the second source of truth these
	# scripts exist to avoid.
	#
	if [ -n "${DB_SSLMODE:-}" ] && { [ "$ssl_enabled" = "true" ] || [ "$ssl_enabled" = "1" ]; }; then
		fail "DB_SSLMODE is set to $DB_SSLMODE, but $ENV_FILE has DATABASE_SSL=true. This connection is not going to be weaker than the application's. Unset DB_SSLMODE."
	fi

	if [ -n "${DB_SSLMODE:-}" ]; then
		ssl_mode="$DB_SSLMODE"
	elif [ -n "$query_mode" ]; then
		ssl_mode="$query_mode"
	elif [ "$ssl_enabled" = "true" ] || [ "$ssl_enabled" = "1" ]; then
		ssl_mode="verify-full"
	else
		ssl_mode="prefer"
	fi

	export PGSSLMODE="$ssl_mode"

	case "$ssl_mode" in
		verify-full|verify-ca )
			if [ -n "${DB_SSL_ROOT_CERT:-}" ] && [ ! -r "$DB_SSL_ROOT_CERT" ]; then
				fail "DB_SSL_ROOT_CERT is set to $DB_SSL_ROOT_CERT, which cannot be read."
			fi

			bundle="$( certificate_bundle )"
			[ -n "$bundle" ] || fail "TLS is set to $ssl_mode but no certificate bundle was found on this host. Expected /etc/pki/tls/certs/ca-bundle.crt. Point DB_SSL_ROOT_CERT at a bundle, or run 'sudo update-ca-trust' if the RDS roots were installed under /etc/pki/ca-trust/source/anchors/ and never merged."
			export PGSSLROOTCERT="$bundle"
			TLS_DESCRIPTION="$ssl_mode against $bundle"
			;;
		* )
			TLS_DESCRIPTION="$ssl_mode — NOT verified"
			warn "This connection is $ssl_mode, not verify-full. On the production host apps/cms/.env sets DATABASE_SSL=true and this line must not appear."
			;;
	esac

	reject_unauthorized="$( env_value DATABASE_SSL_REJECT_UNAUTHORIZED | tr '[:upper:]' '[:lower:]' )"
	if [ "$reject_unauthorized" = "false" ]; then
		warn "apps/cms/.env sets DATABASE_SSL_REJECT_UNAUTHORIZED=false, so the application does not verify the server's certificate. These scripts still do. If the connection below fails on the certificate, that disagreement is the reason, and the certificate is the thing to fix."
	fi
}

describe_target () {
	heading "Target"
	note "host      $DB_HOST:$DB_PORT"
	note "database  $DB_NAME"
	note "user      $DB_USER"
	note "tls       $TLS_DESCRIPTION"
	note "read from $CONNECTION_SOURCE"
}

# --- Checksums --------------------------------------------------------------

#
# GNU coreutils on the host, BSD on a developer's machine, and neither
# guaranteed. An empty answer means "could not", not "did not match", and both
# callers say which.
#
sha256_of () {
	if command -v sha256sum >/dev/null 2>&1; then
		sha256sum "$1" | awk '{ print $1 }'
	elif command -v shasum >/dev/null 2>&1; then
		shasum -a 256 "$1" | awk '{ print $1 }'
	else
		printf '%s' ""
	fi
}

# --- The client binaries ----------------------------------------------------

#
# `pg_dump` and `pg_restore` refuse to work against a server newer than they
# are. Amazon Linux 2023 packages a client older than the RDS server this talks
# to, and the PGDG packages install theirs outside the PATH, under
# /usr/pgsql-<major>/bin — so rather than making the operator remember that,
# every candidate is inspected and the newest one wins. PG_BIN overrides the
# search entirely.
#
binary_major_version () {
	local reported
	reported="$( "$1" --version 2>/dev/null | grep -oE '[0-9]+(\.[0-9]+)*' | head -n 1 || true )"
	[ -n "$reported" ] || { printf '%s' ""; return 0; }
	printf '%s' "${reported%%.*}"
}

find_pg_binary () {
	local name="$1"
	local candidate major best="" best_major=-1

	if [ -n "${PG_BIN:-}" ]; then
		[ -x "$PG_BIN/$name" ] || { printf '%s' ""; return 0; }
		printf '%s' "$PG_BIN/$name"
		return 0
	fi

	for candidate in \
		$( command -v "$name" 2>/dev/null || true ) \
		/usr/pgsql-*/bin/"$name" \
		/usr/lib/postgresql/*/bin/"$name" \
		/opt/homebrew/opt/postgresql@*/bin/"$name" \
		/usr/local/opt/postgresql@*/bin/"$name"
	do
		[ -x "$candidate" ] || continue
		major="$( binary_major_version "$candidate" )"
		[ -n "$major" ] || continue
		if [ "$major" -gt "$best_major" ]; then
			best="$candidate"
			best_major="$major"
		fi
	done

	printf '%s' "$best"
}

#
# The same search, for a caller that cannot continue without the binary.
#
resolve_pg_binary () {
	local found
	found="$( find_pg_binary "$1" )"

	if [ -z "$found" ]; then
		[ -z "${PG_BIN:-}" ] || fail "PG_BIN is set to $PG_BIN and there is no executable $1 in it. Unset PG_BIN to search this host's usual locations, or point it at a directory that has one."
		fail "No $1 on this host. See docs/db-backup.md, 'Confirming a compatible client', for how to install one."
	fi

	printf '%s' "$found"
}

#
# The server's major version, straight from the server. Needs psql, which ships
# in the same package as pg_dump; when it is genuinely absent we say so rather
# than guessing, because pg_dump does this check itself and refuses loudly.
#
server_major_version () {
	local psql reported
	psql="$( find_pg_binary psql )"

	[ -n "$psql" ] || { printf '%s' ""; return 0; }

	reported="$( "$psql" -X -A -t -c 'SHOW server_version_num' 2>/dev/null | tr -d '[:space:]' || true )"
	case "$reported" in
		''|*[!0-9]* ) printf '%s' "" ;;
		* ) printf '%s' "$(( reported / 10000 ))" ;;
	esac
}

assert_client_is_new_enough () {
	local binary="$1"
	local client_major server_major

	client_major="$( binary_major_version "$binary" )"
	server_major="$( server_major_version )"

	[ -n "$client_major" ] || fail "$binary did not report a version this script could read. Point PG_BIN at a client directory, or check that the binary is what it claims to be."

	if [ -z "$server_major" ]; then
		warn "Could not ask the server its version (no psql on this host), so the client-version check was skipped. $( basename "$binary" ) performs the same check itself and will refuse if it is too old."
		note "client    $binary (PostgreSQL $client_major)"
		return 0
	fi

	if [ "$client_major" -lt "$server_major" ]; then
		fail "$binary is PostgreSQL $client_major and the server is PostgreSQL $server_major. A client older than the server refuses to run. Install a client at least as new — docs/db-backup.md, 'Confirming a compatible client' — or point PG_BIN at one."
	fi

	note "client    $binary (PostgreSQL $client_major, server is $server_major)"
}
