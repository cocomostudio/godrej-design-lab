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
| App reads | `apps/cms/.env` | `apps/frontend-website/.env.production` |
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

On `website-host` there is no host `.env` to fill in — but the application has
one of its own, which the checklist below covers:

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

Neither `.env` under `infra/` configures an app. Each machine also needs the
app's own env file, which is gitignored and therefore never arrives with a
deploy.

**`cms-host` — `apps/cms/.env`**

The database block, `APP_KEYS` and the other secrets, and `PORT` if the default
of 1337 is not wanted. When nginx arrives, its `CMS_PORT` in the host's `.env`
must equal that `PORT` — nothing reconciles the two.

**`website-host` — `apps/frontend-website/.env.production`**

Note the filename. The `start` script passes
`--env-file-if-exists .env.production`, so a file named `.env` is ignored in
production. `.env.example` beside it documents every key; the ones a deployment
cannot leave alone are:

- `CMS_URL`. The code defaults to `http://localhost:1337`, which is wrong the
  moment the CMS is on another machine.
- `CMS_PUBLIC_URL`, the origin a *visitor's browser* fetches media from — the
  CDN. Unset it falls back to `CMS_URL`, which in production is a private VPC
  address no browser can resolve.
- `PREVIEW_LINK_SECRET`, which must equal `PREVIEW_SECRET` in `apps/cms/.env`
  on the other machine. Nothing reconciles the two.

`HTTP_SERVER_PORT` defaults to 3000, which is what nginx already proxies to. A
value set in PM2's `env_production` block would win over this file, because Node
lets an already-set variable stand — which is why the port lives here and not in
the ecosystem config.
