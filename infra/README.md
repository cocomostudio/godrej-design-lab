# Infrastructure

The environments the apps run in: the process manager underneath them, and —
soon — the reverse proxy in front of the CMS. The apps themselves are in
`apps/`.

Only **production** is described here.

## Topology

Production is two Amazon Linux 2023 EC2 machines, each running as user `cacao`
with the checkout at `/home/cacao/repo`. Vercel carries the website's staging
deployment only; it has no part in production.

| | `cms-host` | `website-host` |
|---|---|---|
| Runs | Strapi, via `pnpm -F cms run start` | the website, via `pnpm -F few run start` |
| Under | PM2 | PM2 |
| Proxy | none yet — nginx is planned | none yet |
| App reads | `apps/cms/.env` | — |
| Host facts | `production/cms-host/.env` | — |

## Layout

```
infra/
└── production/
    ├── cms-host/
    │   ├── .env.example          the record of which keys the host needs
    │   └── pm2/ecosystem.config.cjs
    └── website-host/
        └── pm2/ecosystem.config.cjs
```

## Installing

On `cms-host`, from the checkout:

```bash
cp infra/production/cms-host/.env.example infra/production/cms-host/.env
```

Fill it in, create the log directory, then start:

```bash
sudo mkdir -p /var/log/gdl && sudo chown "$USER" /var/log/gdl
```

```bash
pm2 start infra/production/cms-host/pm2/ecosystem.config.cjs --env production && pm2 save
```

On `website-host` there is no host `.env` to fill in:

```bash
pm2 start infra/production/website-host/pm2/ecosystem.config.cjs --env production && pm2 save
```

`pm2 save` matters. An ecosystem file reads the host's `.env` when `pm2 start`
evaluates it, and `pm2 save` freezes the resolved values into PM2's dump.
`pm2 resurrect` after a reboot replays that dump — it never re-reads `.env`. To
pick up an edit, run `pm2 start ... --env production` and `pm2 save` again;
`pm2 restart --update-env` does **not** do this, as it re-reads the calling
shell's environment rather than this file.

## Per-machine checklist

`production/cms-host/.env` does not configure Strapi. That machine also needs
`apps/cms/.env`, which is gitignored and therefore never arrives with a deploy:
the database block, `APP_KEYS` and the other secrets, and `PORT` if the default
of 1337 is not wanted. When nginx arrives, its `CMS_PORT` in the host's `.env`
must equal that `PORT` — nothing reconciles the two.
