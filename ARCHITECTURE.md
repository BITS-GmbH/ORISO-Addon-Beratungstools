# Architecture

One ORISO add-on (contract `oriso-addon/v1`, ADR-034) for the digital counselling tools of
DigiSucht (delphi, Los 5). It replaces the two earlier add-ons `digisucht-tools`
("Ausgangssituation und Ziele") and `motivationswaage`; their behaviour is carried over, their
test data is not.

## Tools

In the order of delphi's priority:

| id | Tool | Audience |
|---|---|---|
| `goals` | Ausgangssituation und Ziele | affected, relatives |
| `consumption-diary` | Konsumtagebuch | affected |
| `relatives-diary` | Tagebuch für Angehörige | relatives |
| `balance` | Motivationswaage | affected |
| `emergency-kit` | Notfallkoffer | affected |
| `active` | Aktiv sein | affected, relatives |
| `risk-situations` | Risikosituationen und Kontrollstrategien | affected |
| `traffic-light` | Ampelmodell | affected (media) |
| `positive-perception` | Positives Wahrnehmen | parents |

Each tool is a module with the same shape on both sides: `server/src/tools/<id>/` (validation,
persistence of its entries, export) and `web/src/tools/<id>/` (client view, read-only counsellor
view). A tool module registers itself in one list per side; the core never names a tool.

Links between tools go through the core, not through imports between tool modules:

- `active` owns planned activities; both diaries read them (same records, no copies).
- `emergency-kit` shows the entries of `risk-situations` when that tool is released.
- The consumption diary's topics can be preset from the registration (`registrationRef` of the
  `user.registered` event), once Los 2 delivers it.

## Apps and slots

One app, `tools`:

- `asker.navigation`: "Meine Tools", the released tools of the client. Visibility is dynamic:
  hidden until a counsellor releases a tool.
- `consultant.session`: the tool overview of the case, tiles in two groups "Noch nicht
  freigeschaltet" and "Freigeschaltet", with release, "Einträge ansehen" (only with an effective
  share) and "User-Vorschau" (demo mode).
- `consultant.asker-profile`: tile with the state per tool and a link into the case view.
- `asker.session-menu`: entry to the client's tools from the chat menu.

The badge on the counsellor side counts tools with entries the counsellor has not seen.

## Core concepts

Every tool uses the same three independent states per client and tool, as the specification
demands ("released", "has entries" and "shared" are never the same thing):

- **Release** by a counsellor of the case; can be withdrawn. Releasing follows the DPA gate
  of the host (`/gates`).
- **Entries** created and changed only by the client (in demo mode by the counsellor, on demo
  data).
- **Share**: a switch per tool, off by default. Counsellors read entries only while it is on;
  every read checks it again on the server.

Further core services:

- **Notifications** to the counsellors of the case through the host API (Activity Timeline,
  mail per their preferences): first share, new entry and changed entry in a shared tool.
  Events per client and tool are bundled (window of 15 minutes) into one notification. Each
  counsellor can switch the three kinds on or off. Notifications never carry tool content.
- **Seen markers** per counsellor, client and tool, for the badge and "neu" markers.
- **Demo mode**: the counsellor uses the client view of a tool on separate data owned by
  `demo:<counsellorId>`, clearly labelled, with "Demo zurücksetzen".
- **Export**: PDF of the shared entries of a tool, generated on the server after a fresh access
  check, with tool name, client, export date, period and content; diaries with a date range.
  Tool-specific formats (Notfallkoffer as business card, calendar export of Aktiv sein as ICS)
  come on top.
- **Audit** of release, withdrawal and exports through the host API.
- **Lifecycle**: `user.deleted` deletes all data of that user; `session.deleted` changes
  nothing (the data belongs to the client, not the session).
- **Settings** (JSON Schema, per Träger and Beratungsstelle): which tools are offered, plus
  per-tool options such as the poles of the Motivationswaage. A tool switched off is neither
  offered for release nor shown.
- **Statistics** per tool: released, started, shared (counts, no personal data).

## Storage

MariaDB, own schema `beratungstools` in the platform's MariaDB (created by a job, like the
AddonService). The service applies numbered SQL migrations at start.

- `releases (tenant_id, asker_id, tool, released_by, released_at, withdrawn_at, opened_at)`
- `shares (tenant_id, asker_id, tool, shared, shared_since, changed_at)`
- `entries (id, tenant_id, owner_id, tool, kind, day, data JSON, created_at, updated_at)`:
  one generic table for all tools. `kind` separates record types inside a tool (e.g. `phase`,
  `day-summary`, `activity`), `day` is set for dated records so diaries and calendars can query
  ranges.
- `seen (counsellor_id, asker_id, tool, seen_at)`
- `notification_prefs (counsellor_id, first_share, new_entry, changed_entry)`
- `notification_outbox (tenant_id, asker_id, tool, kind, due_at, ...)` for bundling.

## Stack

- Server: Node 24, TypeScript, Fastify, `mariadb`, zod. Tokens verified against the
  AddonService JWKS (RS256, issuer and audience), as in the earlier add-ons.
- Web: React with TSX, built by Vite with `@oriso/vite-plugin-addon`, so React and the web kit
  (`@oriso/web-kit`) come from the host. One ES module `ui/entry.js` with the mount lifecycle.
- Tests: Vitest on both sides; server integration tests against a MariaDB container.
- Image: one container serving API and UI bundle, built in CI and pushed to Harbor.

## Open points (from delphi's specification)

- Feedback from counsellors to entries: channel not decided (comment in the tool or a chat
  message).
- Notifications by mail in addition to the platform.
- Export formats besides PDF; storing exports in the documentation (Los 4).
- Responsive behaviour on narrow screens and for archived cases.
