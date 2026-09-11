---
id: topology-discrepancy
name: The Operation Manual and infra/README describe different production systems
status: for the project lead — not actioned
raised_by: ticket 03, VAPT remediation
date: 11/09/2026
---

# The Operation Manual and `infra/README.md` describe different production systems

**This is a flag, not a change.** Ticket 03 needed to say which hosts an
operator should apply the banner suppression to, and found that the two
documents describing production do not agree on how many hosts there are. The
ticket wrote the nginx change into both documents and left the topology in each
exactly as it found it.

The reason for leaving it is deliberate: `docs/Operation Manual.md` is a
client-facing handover document, delivered to Godrej and signed off. Quietly
rewriting what it says about their own infrastructure — a week before go-live,
inside a security remediation commit — is not a remediation decision. It is a
decision about a delivered document, and it is yours.

## What each document says

| | `docs/Operation Manual.md` | `infra/README.md` |
|---|---|---|
| Website hosts | two — `gdl-prod-frontend-1a` (172.19.137.11), `gdl-prod-frontend-1b` (172.19.137.51) | one — `website-host` |
| CMS host | `gdl-prod-strapi` (172.19.137.24) | `cms-host` |
| In front of the website | an ALB routing to 1a/1b | not mentioned at all |
| Reverse proxy | nginx, installed and configured on every box (Step 3.1) | "none yet — nginx is planned", on both |
| Service account | `cocomo`, repo in that user's home under `repo` | `cacao`, checkout at `/home/cacao/repo` |
| Starting the apps | `pm2 start "pnpm -F cms run start"` — a bare command | `pm2 start <ecosystem>.cjs --env production && pm2 save` |
| Vercel | not mentioned | staging only, no part in production |

Sources: Operation Manual lines 73–77 (instances and ALB), 172 (service
account), 219–305 (nginx), 409–423 (starting the apps); `infra/README.md`
"Topology", "Layout" and "Installing".

## Why it matters beyond tidiness

Three of these rows have teeth.

**The host count changes the remediation's scope.** If there really are two
website boxes behind an ALB, then "apply to both hosts" is wrong — the banner
drop-in has to go on three. Ticket 03 handled this by telling the operator to
apply it to *every* host running nginx and noting that re-running it costs
nothing, which is safe under either reading but is not the same as knowing.

**The ALB is a second place the banner and the headers can be undone.** An ALB
that terminates TLS and re-writes headers sits above everything this repository
controls. If it exists, the retest is probing the ALB's responses, not nginx's,
and the finding may not close even after this change is applied correctly.
Nobody has confirmed which one Godrej's scanner actually reached.

**`pm2 start "pnpm -F few run start"` does not apply `env_production`.** The
Operation Manual's form starts a bare command with no ecosystem file, so PM2's
`env_production` block never applies. The website's ecosystem config declares
`NODE_ENV: "development"` in its base `env` block. Release 1 already defends
against this — the `start` script sets `NODE_ENV=production` itself, for exactly
this reason, and that is recorded in the findings — but an operator following
the manual is running a start command the infrastructure directory does not
describe, and the next thing that depends on `env_production` will break with no
warning.

The service account name is the least consequential row and the most likely to
be a simple staleness: one of the two is a rename nobody propagated.

## What is not being claimed

Which document is right. `infra/README.md` was written against the deployment as
the developers understand it today; the Operation Manual describes the
architecture as designed and handed over in July 2025. Either could be the
stale one, or both could be partly true — an ALB that exists but is not yet
wired to two instances, for example, would make both documents honest and
neither complete.

Resolving it needs someone to look at the AWS account, not to reason from the
documents.

## The decision in front of you

1. **Establish the truth** — how many EC2 instances are running, is the ALB in
   the path, which service account owns the checkout, is nginx on all of them.
   This is a console session, not a discussion.
2. **Then decide what to do with the Operation Manual.** It is Godrej's copy of
   how their system is built. If it is wrong, correcting it is a deliverable
   with a cover note, not a silent `git commit`. If it is right, then
   `infra/README.md` is the one that needs correcting, and it is ours to fix
   freely.
3. **Tell whoever runs the banner verification how many hosts to check**, before
   the retest. This is the part with a deadline.

Ticket 12 (verification script and evidence capture) and ticket 13 (the response
document for Godrej IT) both need an answer to item 3. Neither can honestly
assert "both hosts return no version" without knowing what "both" means.
