# Rolling back the CMS

The document to follow when an upgrade has gone wrong. It exists so that
recovery is a procedure somebody reads rather than a sequence somebody invents
while the site is down.

The mechanics of taking and restoring a dump are in
[`db-backup.md`](db-backup.md). This page is about when to use them, what else
has to move at the same time, and in what order.

**The one rule: the code and the database move together.** A database restored
to its pre-upgrade state must never come up underneath a post-upgrade
application, and the reverse is worse. Strapi runs its schema migrations on
boot; an application that is newer than the database it finds will migrate it
forward again, on the spot, and the rollback will have undone nothing.

There are two recovery paths and they are not equals:

| | Path A — snapshot | Path B — dump file |
|---|---|---|
| Restores | the whole instance, byte for byte | the contents of one database |
| Granularity | all or nothing | whole database, or single tables |
| Typical time | 15–40 minutes, mostly waiting on AWS | minutes |
| Needs | nothing installed on the host | a `pg_restore` at least as new as the server |
| Use it when | the upgrade damaged the data and you want the instance you had | a table is wrong, the snapshot is unavailable, or you need a copy elsewhere |

Path A is the primary. Path B exists because a recovery plan with one path is a
recovery plan with none.

---

## Before the upgrade

Four things have to exist before an upgrade starts. The first can invalidate the
rest, so it is done first and days early, not in the window.

1. A `pg_dump` and `pg_restore` on the CMS host at least as new as the RDS
   server — [`db-backup.md`, Confirming a compatible client](db-backup.md#confirming-a-compatible-client)
2. A rehearsal: a dump taken and put back —
   [`db-backup.md`, The rehearsal](db-backup.md#the-rehearsal)
3. An RDS snapshot, taken immediately before the upgrade begins
4. A way back to the code that is running right now —
   **[Putting the code back](#putting-the-code-back)**

Then, immediately before the upgrade:

```bash
./infra/production/cms-host/database/dump.sh before-<target-version>
```

Take it as late as possible. Everything an editor does between the dump and the
rollback is lost, so the gap is the exposure.

---

## Path A — the snapshot, restored and renamed

The primary path. Restoring an RDS snapshot always creates a **new instance**
with a **new endpoint** — AWS offers no way to restore in place. So the
procedure restores under a temporary name and then renames the instances so
that the original identifier, and therefore the original endpoint hostname,
ends up pointing at the restored data. Nothing in `apps/cms/.env` changes, and
nothing has to be remembered and undone later.

```
1. Stop the application.

       pm2 stop cms__godrej-design-lab

2. Restore the snapshot to a NEW instance, named distinctly:

       <identifier>-restore-<date>

   Match the original's instance class, subnet group, security groups and
   parameter group. A restored instance that cannot be reached from the CMS
   host is not a restored instance.

3. Wait for it to reach Available. This is most of the wall-clock time.

4. Rename the damaged instance out of the way:

       <identifier>  ->  <identifier>-broken-<date>

   Keep it. It is the evidence of what went wrong, and deleting it is a
   decision for daylight.

5. Rename the restored instance into the original identifier:

       <identifier>-restore-<date>  ->  <identifier>

   Wait for Available again. The endpoint hostname follows the identifier, so
   the name in apps/cms/.env now resolves to the restored instance.

6. Confirm, from the CMS host, that the endpoint resolves and answers:

       getent hosts <the DATABASE_HOST from apps/cms/.env>

7. Put the code back — the section below.

8. Start the application:

       pm2 start infra/production/cms-host/pm2/ecosystem.config.cjs --env production && pm2 save
```

**Why rename rather than repoint.** Editing `DATABASE_HOST` in `apps/cms/.env`
would also work — Strapi reads that file itself at every boot, so a plain
restart does pick it up. The rename is preferred for a different reason: it
leaves *no* configuration edited. There is no second hostname to remember, no
file that now disagrees with what the infrastructure documents say, and nothing
to undo when the instance is eventually renamed back. A rollback is not the
moment to introduce a configuration change that outlives it.

**A related trap, which is not this one.** PM2 freezes the values it resolved
from `infra/production/cms-host/.env` into its dump when you run `pm2 save`,
and `pm2 resurrect` replays them — it never re-reads that file, and
`pm2 restart --update-env` re-reads the calling shell instead. That is why
every start in this document is `pm2 start <ecosystem> --env production` with
a `pm2 save` after it. It applies to PM2's own variables — the log paths,
`NODE_ENV` — not to the database credentials, which live in `apps/cms/.env`
and are read by the application.

---

## Path B — the dump file

Use it when the snapshot is unavailable or slower than the outage can bear,
when only part of the database is wrong, or when the damage needs to be
inspected somewhere else before anything is overwritten.

```
1. Consider dumping the damaged state first, before overwriting it:

       ./infra/production/cms-host/database/dump.sh after-failed-upgrade

   It costs minutes and it is the only copy of the evidence.

2. Restore the pre-upgrade dump. This stops the application itself:

       ./infra/production/cms-host/database/restore.sh /var/backups/gdl/database/<file>.dump

3. Put the code back — the section below.

4. Start the application:

       pm2 start infra/production/cms-host/pm2/ecosystem.config.cjs --env production && pm2 save
```

A single table rather than the whole database is a `pg_restore` invocation
composed by hand; [`db-backup.md`](db-backup.md#putting-one-back) has it, and
the reasons the script does not wrap it.

---

## Putting the code back

The database is half of a rollback. This is the other half, and it has to happen
**before** the application is started again.

What it means depends on how this host is deployed, and the answer is not the
same everywhere. Establish it before the upgrade, not during it:

```bash
git -C ~/repo rev-parse --git-dir
```

### The way that works either way: keep the directory

Before the upgrade, take a copy of the tree that is currently working:

```bash
df -h ~
```

```bash
cp -a ~/repo ~/repo.pre-upgrade
```

`node_modules` makes this a large copy; check the disk has room for it first.
The reward is that rolling the code back needs no network, no registry and no
reinstall — the previously working tree, with its installed dependencies, is
already sitting there:

```bash
pm2 stop cms__godrej-design-lab
```

```bash
mv ~/repo ~/repo.failed-upgrade && mv ~/repo.pre-upgrade ~/repo
```

This is the one to take. It does not care how the code arrived on the host, it
does not depend on a dependency install succeeding twice, and it is two `mv`s
at the moment when nothing else is going right.

### If the host has git history

Then the commit recorded in the `.provenance` file beside the dump is enough to
get back to it:

```bash
git -C ~/repo checkout <the commit from the .provenance file>
```

```bash
cp /var/backups/gdl/database/<file>.dump.pnpm-lock.yaml ~/repo/pnpm-lock.yaml
```

```bash
cd ~/repo && pnpm install -r --frozen-lockfile
```

The lockfile has to be copied explicitly: it is gitignored, so a checkout does
not bring the old one back, and `--frozen-lockfile` against the wrong one will
either fail or install the versions you are trying to roll away from. Add
`--offline` if this host installs from a local pnpm store rather than the
registry.

### `apps/cms/.env`, which the two paths treat differently

It lives *inside* the checkout, at `apps/cms/.env`, and it is gitignored.

- On the **git** path a checkout does not touch it, so it stays exactly as it
  is, which is what you want.
- On the **directory swap** path it moves with the directory: `~/repo` going
  back to `~/repo.pre-upgrade` takes that copy's `.env` with it. Usually right —
  it is the configuration that matched the code — but if anything in it changed
  after the copy was taken, that change is now gone. Check before starting the
  application, particularly if the database endpoint moved under Path A:

```bash
diff ~/repo/apps/cms/.env ~/repo.failed-upgrade/apps/cms/.env
```

---

## Deciding which path

| What happened | Path |
|---|---|
| The upgrade's migrations damaged content and you want the instance back as it was | A |
| The instance is fine but one table is wrong | B, selective |
| The snapshot is missing, still being created, or restoring too slowly | B |
| Strapi will not boot at all and the data is untouched | Neither — put the code back and start it |
| You are not sure yet | Dump the current state first, then decide |

---

## What a rollback does not undo

**S3 and CloudFront.** Rolling the database back does not roll the media library
back. Two consequences, both real:

- A file uploaded *after* the dump is still in the bucket, but the row that
  described it is gone — an orphaned object nobody will ever reference.
- An entry created after the dump is gone, and so are any references to the
  images it used.

Neither corrupts anything. Both mean an editor's work between the dump and the
rollback is lost, which is the argument for taking the dump immediately before
the upgrade and for telling Henry not to publish during the window.

**The website host.** It holds no state. Rolling it back is a deploy, not a
restore.

**The upgrade's own footprints outside the database.** A rollback puts the code
and the data back. Anything the upgrade did to the host — packages installed,
files written outside the checkout — is still there, and is usually harmless.
Note it rather than assume it.
