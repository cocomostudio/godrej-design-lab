# 00001 — The website serves its own responses

**Status:** accepted — 11/09/2026

**Context:** VAPT remediation, Release 1
(`__this-project/build-plans/2026-09-11__vapt-remediation/`, ticket 01).

## Context

Godrej's IT team returned a finding that the website's responses carry none of
the security headers their standard requires. Closing it means adding headers.
The question this record answers is *where*.

The website ran under `react-router-serve`, the stock server that ships with
React Router. That server takes a build path and nothing else. It accepts no
header configuration, and it mounts three static handlers of its own —
fingerprinted assets, the rest of the client build, and `public/` — before the
request ever reaches the application.

So headers added at the only layer the application owns, the document render,
would appear on rendered pages and on nothing else. Every JavaScript file, every
stylesheet, every image would answer without them. `X-Content-Type-Options` in
particular would be missing from exactly the responses it exists to protect: a
scanner asking for an asset is the first thing a retest does.

Three ways out were available.

1. **Set the headers at the reverse proxy.** nginx sits in front of the website
   and could add them to everything. But the proxy's configuration is not
   tracked in this repository — it is applied by hand on the host and recorded
   in a prose document. A control that lives only in an untracked file on a
   machine is a control that a rebuild silently drops.

2. **Set them at the load balancer.** Same objection, one layer further away,
   and on infrastructure Godrej owns rather than us.

3. **Own the server.** `react-router-serve` is a thin wrapper around Express —
   roughly forty lines of middleware. Reproducing it in this repository costs
   little and makes every response, asset included, ours to shape.

The same change had to answer a second question. The website had no environment
mechanism at all: the CMS's address was a constant in a committed `env.ts`,
switched by commenting lines in and out, and committed pointing at localhost.
The Operation Manual told the operator to hand-edit that file on each frontend
box — an edit a deploy overwrites.

## Decision

**The website runs under an Express server in this repository**,
`apps/frontend-website/server/web/index.ts`, entered through
`apps/frontend-website/entry-point.ts`. `react-router-serve` is removed.

The server reproduces the stock server's observable behaviour exactly: the same
middleware in the same order, the same cache lifetimes on the same directories,
the same default port, the same signal handling. It was verified by running both
servers against the same build and the same CMS and comparing the rendered
markup byte for byte.

**Configuration comes from `.env` files, read by Node, and the application
reads `process.env` in exactly one module.** This follows the sibling project
(Godrej Conscious Collective) rather than inventing a second convention:

- `apps/frontend-website/.env.example` is tracked, and is both the template and
  the documentation of every key. `scripts/ensure-local-env.js` copies it to
  `.env` on a fresh clone and never overwrites.
- **Which file is read is decided by the `package.json` script, not by a
  variable**: `dev` passes `--env-file-if-exists .env`, `start` passes
  `--env-file-if-exists .env.production`. There is no dotenv dependency.
- `server/environment/index.ts` reads `process.env` once at module evaluation
  and exposes `Environment.get( key )`. Nothing else in the application touches
  `process.env`.

**A value the browser needs travels in loader data, not in the bundle.** The
media origin is read server-side by `fetch-route-from-cms.server.ts`, returned
from the CMS route's loader, and distributed through a React context. There is
deliberately no `VITE_`-prefixed variable: a Vite-inlined key is a string
literal compiled into every page, so it cannot be changed without a rebuild, it
cannot be validated at runtime, and absent it compiles to an empty string that
nothing notices. After this change no environment-specific value appears in the
client bundle at all — which was not true before it, where `http://localhost:1337`
was compiled into every page.

Two further things follow that the stock server could not give us:

- Headers apply to every response, because the static handlers are ours (ticket
  06).
- There is a place to keep the secret that signing preview requests needs
  (ticket 07).

The server also fixes a latent defect in the stock one. `react-router-serve`
defaults `NODE_ENV` to `production` *after* its own imports have been evaluated,
by which time React has already chosen its development build; a website started
without `NODE_ENV` set therefore loads React's development build alongside React
DOM's production one and fails on every render. Here the mode is set by the
`package.json` script, before Node starts.

## Consequences

**The server is ours to maintain.** A React Router upgrade that changes what
`react-router-serve` does no longer reaches us automatically. The file is short
and its comments say what each mount reproduces, but it is a thing that can
drift.

**It is run by Node directly, not bundled.** The scripts invoke
`node --experimental-strip-types entry-point.ts`. That flag has existed since
Node 22.6 and stopped being required in 22.18; the host runs 22.17, so it is
passed explicitly. `engines.node` is raised to `>=22.9.0`, which is also what
`--env-file-if-exists` needs. Relative imports under `server/` carry explicit
`.ts` extensions, and `tsconfig.json` gains `allowImportingTsExtensions`.

**The process manager's configuration is untouched.** The `start` script keeps
its name, and the port defaults to 3000, so nothing on the host has to change.
The script sets `NODE_ENV=production` itself, which also means a `pm2 start`
that forgets `--env production` still starts a production server rather than a
development one — the host's PM2 base environment declares
`NODE_ENV: "development"`.

**Development runs through the same server.** `SERVE_MODE` chooses between Vite
in middleware mode and the built output; the environment supplies only its
default. Hot reloading is intact, and the headers and preview verification that
later tickets add behave the same way in development as in production.
`react-router dev` is no longer the dev entry point.

**Binding fails rather than drifts.** The stock server quietly picked another
free port when 3000 was taken. nginx proxies to a fixed port, so a website that
moves is a website that is down without saying so. This one refuses to bind.

**A second file has to be placed on each frontend box by hand.**
`apps/frontend-website/.env.production` is gitignored and therefore never
arrives with a deploy, exactly as `apps/cms/.env` already does not. Both the
Operation Manual and `infra/README.md` say so.
