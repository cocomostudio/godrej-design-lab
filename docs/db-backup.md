# Backing up the CMS database

Taking the CMS's database to a file on the host, and putting one back. Two
scripts under `infra/production/cms-host/database/`, run by hand.

This is the tool. [`db-rollback.md`](db-rollback.md) is the procedure that uses
it when an upgrade has gone wrong, and it is the document to read first if
something is currently broken.

**Strapi's own `strapi export` is deliberately not used.** It excludes admin
users and API tokens; its import deletes the target's data and uploads before
writing; and it requires the source and target schemas to match — which is
precisely what a version upgrade changes. These are database-level dumps: every
row, including the admin accounts you need in order to log in and check that a
restore worked.

---

## The scripts

```
dump.sh        take the database to a file on this host
restore.sh     put one of those files back
connection.sh  sourced by both; not run on its own
```

Both read the connection out of `apps/cms/.env` — the file Strapi itself
reads — in either of the forms `apps/cms/config/database.ts` accepts:
`DATABASE_URL`, or the discrete `DATABASE_*` variables. There is deliberately
no second place to configure them, because a second place is a place to drift.

What they guarantee, so that nobody has to re-derive it under pressure:

- **No credential reaches a command line.** The password is written to a 0600
  file that libpq reads and the script deletes on exit. `ps`, the shell history
  and PM2's logs never see it.
- **TLS is verified** whenever `apps/cms/.env` enables it, which production's
  does: `verify-full`, against a certificate bundle already on the host.
  Nothing falls back quietly — a verifying mode that can find no bundle stops
  the script, and an environment file that does not enable TLS at all produces
  a warning naming what production looks like. `DB_SSLMODE` can weaken the mode
  for a rehearsal against a database that speaks no TLS, and is refused outright
  when the environment file says `DATABASE_SSL=true`.
- **Dumps are written outside the checkout.** `dump.sh` refuses a `DUMP_DIR`
  inside it, relative or absolute. This is not fastidiousness: `pnpm package`
  tars the working tree, and `.tarignore` excludes only `.git`, `node_modules`,
  macOS litter and the tarball itself — so a dump left in the checkout would be
  packaged and shipped with the next deploy, password hashes and all.
- **The format supports a selective restore.** PostgreSQL's custom format, so
  `pg_restore -t <table>` can take one table out of the archive when the whole
  database is not what went wrong.

Neither script is scheduled. They are run by hand, by a person who has read
this page.

---

## Confirming a compatible client

**Do this days before an upgrade, not in the window.** `pg_dump` refuses to dump
a server newer than itself, and `pg_restore` refuses to restore into one. There
is no flag that overrides it and no partial success: either the host has a new
enough client, or dumps are not available on this host at all.

**The server's major version.** `Operation Manual.md` says PostgreSQL 17.
Confirm it rather than trusting the document:

```bash
aws rds describe-db-instances --query 'DBInstances[].[DBInstanceIdentifier,EngineVersion]' --output table
```

The instance identifier is also the first label of the endpoint in
`apps/cms/.env` —
`DATABASE_HOST=<identifier>.<suffix>.<region>.rds.amazonaws.com` — which is
worth knowing now, because the rollback procedure renames that identifier.

**What the host can install.** On Amazon Linux 2023:

```bash
dnf list --available 'postgresql1*'
```

If a package at or above the server's major version is there, install the
client only — not the `-server` package, which would put a second PostgreSQL
on a box that has no use for one:

```bash
sudo dnf install -y postgresql17
```

**If the distribution does not carry one.** Amazon Linux 2023 has historically
lagged; the PostgreSQL project's own repository builds for Enterprise Linux 9,
which this is close enough to:

```bash
sudo dnf install -y "https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-$( uname -m )/pgdg-redhat-repo-latest.noarch.rpm"
```

```bash
sudo dnf install -y postgresql17
```

`uname -m` is in that URL rather than an architecture typed out because the
repository path is `EL-9-aarch64` on Graviton and `EL-9-x86_64` on Intel, and
the wrong one is a 404 at the least convenient moment. Let the host answer.

Those binaries install to `/usr/pgsql-17/bin`, which is **not on `PATH`** — a
human typing `pg_dump` will still get the distribution's older one and be told
it is too old. The scripts look in that directory themselves and pick the newest
client they can find, so they need no change; `PG_BIN=/usr/pgsql-17/bin`
overrides the search if it ever picks wrong.

**If neither works, stop and escalate.** It means this host cannot take a dump,
and an upgrade's only recovery path is the RDS snapshot. That may be an
acceptable risk — it is not an acceptable surprise, and it is not a decision to
take at two in the morning. The alternatives, in the order they are worth
trying: run the dump from another machine in the VPC that does have a modern
client; or accept the snapshot as the only path and say so in writing.

**While you are on the host: merge the RDS roots.** `Operation Manual.md`
step 3.2 downloads them to `/etc/pki/ca-trust/source/anchors/rds-global.pem` and
stops there — but an anchor is not in `/etc/pki/tls/certs/ca-bundle.crt` until
something merges it:

```bash
sudo update-ca-trust
```

It is idempotent, and it costs nothing to run on a host where it was already
done. The scripts fall back to the anchor file itself if the merged bundle is
missing the roots, and current RDS certificates chain to Amazon Root CA 1 which
every stock bundle already carries — so this may never have mattered. "May never
have mattered" is not the same as verified.

**Confirming it worked** is the same command as [the rehearsal](#the-rehearsal)
— a client that is too old fails there loudly, by name and version, before it
touches anything.

---

## Taking a dump

The directory is created once, owned by the service account, and never again:

```bash
sudo mkdir -p /var/backups/gdl/database && sudo chown "$USER" /var/backups/gdl/database && sudo chmod 700 /var/backups/gdl/database
```

Then, from the checkout:

```bash
./infra/production/cms-host/database/dump.sh before-5.52.2
```

The label is optional and lands in the filename. Four files are written, all
0600:

```
cms-<database>-<timestamp>-<label>.dump                  the archive
cms-<database>-<timestamp>-<label>.dump.sha256           checked by restore.sh before it restores
cms-<database>-<timestamp>-<label>.dump.provenance       what the code was when this was taken
cms-<database>-<timestamp>-<label>.dump.pnpm-lock.yaml   the lockfile that matches that code
```

The last two are the half of a recovery that is not the database. A dump puts
the data back to a moment; the code has to go back to the same moment, and the
`.provenance` file is what records which moment that was. The lockfile is
copied rather than referenced because it is gitignored — nothing else keeps an
old one.

`DUMP_DIR` overrides where they go. Anywhere outside the checkout is fine;
`/var/backups/gdl/database` is the default so that everyone looks in the same
place.

---

## Putting one back

```bash
./infra/production/cms-host/database/restore.sh /var/backups/gdl/database/<file>.dump
```

It states the archive, the target host, the target database and the user; warns
if the archive came from a differently-named database; verifies the checksum;
refuses to run without a terminal; and will not proceed until a human types the
target database name. Then it stops the application via PM2, and restores in a
single transaction — so a failure part-way leaves the database exactly as it was
found.

It leaves the application stopped, on purpose. A database restored to an earlier
state must not come up underneath code that has moved on; starting it is a step
in [`db-rollback.md`](db-rollback.md), after the code has been put back.

Two things it does **not** do. It does not empty the database first: objects
that exist in the database but not in the archive survive the restore. And it
does not touch S3 — see [What this does not cover](#what-this-does-not-cover).

**One table rather than the whole database.** The archive is in the custom
format, so `pg_restore` can take a single table out of it. Read the contents
first:

```bash
pg_restore --list /var/backups/gdl/database/<file>.dump
```

This is a sharp tool and `restore.sh` deliberately does not wrap it: a partial
restore leaves the database in a state nobody has a name for, and whoever runs
it should be composing the command deliberately. The connection has to be made
by hand too — `restore.sh` is what reads `apps/cms/.env`.

---

## The overrides

Seven environment variables exist, and every one of them is for a situation that
is not the production host. None is needed in the sequences above.

| | |
|---|---|
| `DUMP_DIR` | where dumps go. Default `/var/backups/gdl/database`; anywhere outside the checkout is accepted |
| `CMS_ENV_FILE` | read the connection from another file — a rehearsal against a throwaway database, or a host whose Strapi is started with `ENV_PATH` set |
| `PG_BIN` | a directory of client binaries to use instead of searching. Only needed if the search picks wrong |
| `PM2_APP_NAME` | the process to stop. Default `cms__godrej-design-lab`, which is what `pm2/ecosystem.config.cjs` declares |
| `SKIP_APP_STOP=1` | an assertion by the operator that the application is already down. Without PM2 on the host there is no other way to restore, and `restore.sh` says in its confirmation that nothing will be stopped |
| `DB_SSLMODE` | weaken TLS for a rehearsal against a database that speaks none. **Refused** when the environment file sets `DATABASE_SSL=true` |
| `DB_SSL_ROOT_CERT` | the bundle to verify against, instead of searching the host's |

---

## The rehearsal

Take a dump and put it straight back into the same database. This is the
cheapest possible rehearsal — the data being written is the data that is already
there — and it exercises everything at once: the client version, the
credentials, the TLS bundle, the PM2 process name, the permissions on the dump
directory, and the operator's own hands.

```bash
./infra/production/cms-host/database/dump.sh rehearsal
```

```bash
./infra/production/cms-host/database/restore.sh /var/backups/gdl/database/cms-<database>-<timestamp>-rehearsal.dump
```

Then bring the application back and check it:

```bash
pm2 start infra/production/cms-host/pm2/ecosystem.config.cjs --env production && pm2 save
```

Log into the admin, open an entry, and view a page on the website. A rehearsal
that ends at "the command exited 0" has not rehearsed the thing that matters.

`pm2 start ... && pm2 save`, not `pm2 restart`: PM2 replays the values it froze
at the last save and does not re-read the host's `.env`. That applies to PM2's
own variables — the log paths, `NODE_ENV` — and not to the database credentials,
which live in `apps/cms/.env` and are read by the application at every boot.

Do this in a quiet window, with the site announced as down if that is warranted.
The restore is not read-only, and an editor saving a draft through it would lose
the draft.

**Do it before every upgrade**, not once. It is the only thing that proves the
recovery path still works on the host as it is today.

---

## What this does not cover

**Scheduling and retention.** Both scripts are run by hand. Nothing prunes old
dumps, and nothing takes one on a timer. That is a deliberate omission for now —
scheduled backups are worth setting up once there is content worth losing — and
it means somebody has to watch the disk on a host where dumps accumulate. A
dump is roughly the size of the database and they do not clean themselves up.

**S3 and CloudFront.** A dump is the database only. The media library lives in
the bucket, and restoring a dump does not restore, remove or reconcile anything
there. [`db-rollback.md`](db-rollback.md) spells out what that means in
practice.

**The website host.** It holds no state. There is nothing there to back up.

**Off-host copies.** Dumps sit on the same machine as the application. They
survive a bad upgrade, which is what they are for; they do not survive losing
the instance. The RDS automated snapshots are what cover that.
