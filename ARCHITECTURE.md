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
view), plus `shared/tools/<id>.ts` for what both sides need (texts, calculations). A tool module
registers itself in one list per side; the core never names a tool. See "Tool modules" below.

Available so far: `goals` and `balance`. The other seven are in the catalogue
(`shared/catalog.ts`, ids, titles, tile texts, audience, order) but have no module yet; the core
offers only tools with a module, so they are neither offered for release nor shown, and have no
settings or statistics until their module lands.

Links between tools go through the core, not through imports between tool modules:

- `active` owns planned activities; both diaries read them (same records, no copies).
- `emergency-kit` shows the entries of `risk-situations` when that tool is released (`reads`).
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
  counsellor can switch the three kinds on or off. Notifications never carry tool content; they
  name the client by username (from the client's token), the tool and the kind of event. See
  "Notifications" below for how this works within the host API.
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
- **Settings** (JSON Schema, per Träger and Beratungsstelle): `allowSharing` (clients may share
  at all), then per tool a switch named after the tool (`goals`, `balance`, `consumptionDiary`,
  ...) followed by its options prefixed with that name (`goalsIntro`, `balancePoles`). A tool
  switched off is neither offered for release nor shown, and its shared entries are closed.
- **Statistics** per tool: released, started, shared (counts, no personal data), with the ids
  `<tool>.released`, `<tool>.started`, `<tool>.shared`. Demo data is never counted.
- **Form of address**: the client UI follows the host's `informal` prop. Server texts go to
  counsellors (formal) or, for the release notification to the client, are worded without
  address, because the counsellor's request does not carry the client's form of address.

## Storage

MariaDB, own schema `beratungstools` in the platform's MariaDB (created by a job, like the
AddonService). The service applies numbered SQL migrations at start.

- `releases (tenant_id, asker_id, tool, released_by, released_at, withdrawn_at, opened_at)`
- `shares (tenant_id, asker_id, tool, shared, shared_since, changed_at)`; `asker_id` is the
  owner, so demo data (`demo:<counsellorId>`) has its own share switch.
- `entries (id, tenant_id, owner_id, tool, kind, entry_key, day, data JSON, created_at,
  updated_at)`: one generic table for all tools. `kind` separates record types inside a tool
  (e.g. `phase`, `day-summary`, `activity`), `day` is set for dated records so diaries and
  calendars can query ranges. `entry_key` (unique per owner, tool and kind) holds kinds with one
  record per key, such as the answer to each question of `goals`; it was added to the design so
  that autosave cannot create duplicates.
- `seen (tenant_id, counsellor_id, asker_id, tool, seen_at)`
- `notification_prefs (counsellor_id, first_share, new_entry, changed_entry, updated_at)`
- `notification_outbox (tenant_id, asker_id, tool, pending, version, due_at, last_sent_at,
  claim_id, claimed_at)`: one row per client and tool; `pending` is a bit set of event kinds.

## Notifications

Changed from the first design (a scheduler sending due bundles), because of two limits of the
host API (AddonService, contract `oriso-addon/v1`):

1. `POST /host/notifications` needs a user token, and add-on tokens are valid for 2 minutes. A
   background job has no token, so it cannot send a bundle 15 minutes later.
2. `recipient: "counsellors"` addresses all counsellors of the client; the add-on cannot pick
   single counsellors.

So:

- The first event of a client in a tool goes out at once (with the client's token) and opens a
  window of 15 minutes (`NOTIFY_WINDOW_MINUTES`). Events within the window are collected in the
  outbox row and go out as one notification after the window, sent from the client's next
  request: any API call or the registry's `/visibility` check, which the AddonService makes with
  the client's token whenever the client uses ORISO. A client who stops within a window gets the
  rest delivered on their next visit; the "neu" markers and the counsellor badge do not depend on
  notifications and are always current.
- Due rows are claimed with a conditional `UPDATE` (claim id and time), so with several replicas
  only one sends; a claim older than 5 minutes is taken over. A failed send is retried after a
  minute. Before sending, release and share are checked again; a withdrawn share drops the
  notification.
- Preferences: the client's counsellors come from `/host/context`; a kind is sent if at least
  one of them wants it, and dropped if none does. With one counsellor per client (the usual
  case) this is exact; with several, one who switched a kind off still gets it when another
  wants it.
- When the host API accepts service tokens and single recipients for notifications, the same
  outbox can be flushed by an in-process scheduler and filtered per counsellor; the claim logic
  is already safe for that.

## Tool modules

A tool is added without touching the core: write the three parts below, add the server module
to `server/src/tools/index.ts` and the web module to `web/src/tools/index.ts`, and the catalogue
entry in `shared/catalog.ts` already exists.

**Shared** (`shared/tools/<id>.ts`): texts (formal and informal), constants, calculations used by
both sides. No zod and nothing server-only, it is bundled into the UI.

**Server** (`ServerTool` in `server/src/tools/types.ts`):

- `id`: the catalogue id.
- `kinds`: record types with a zod `schema` for `data`; optional `keys(key)` for keyed kinds (one
  record per key, written with `PUT .../keyed/<kind>/<key>`), `max` per client, `dated` (needs
  `day`), `announce(username)` for requests to the counsellors (creating such an entry notifies
  them at once, shared or not, never in demo mode; the text carries no tool content).
- `options`: settings per Träger and agency (JSON Schema subset); the core prefixes the keys and
  hands the tool its values as `options` (client and counsellor views, export).
- `exportPdf(pdf, { entries, options, linked, counsellors })`: the tool's part of the PDF below
  the common header, through `PdfWriter` (`heading`, `subheading`, `paragraph`, `field`, `item`,
  `table`, `spacer`, and `drawing` for pdfkit graphics). `exportRange: true` lets counsellors pick a period (diaries);
  dated entries are then filtered by `day`.
- `clientExports`: PDFs the client makes of their own entries (`GET /me/tools/<tool>/export/<format>`,
  query parameters as `params`), with the common header or `bare` for an own layout.
- `reads`: other tools whose entries this tool shows. The core hands them over as `linked`: to the
  client while that tool is released (in demo mode the counsellor's demo data), to counsellors
  only while the client shares that tool as well. Tools never import each other.
- `counsellorNames`: the names of the client's counsellors from the host context, as `counsellors`.
- `demo()`: optional example entries for the counsellor's demo, applied on first use and reset.
- `calendar({ releasedAt, shared, entries })`: optional reminders for the client's calendar.

The core does the rest for every tool: release and withdrawal, share, access checks, entry
storage and validation, notifications, seen markers, demo, audit, statistics, deletion.

**Web** (`WebTool` in `web/src/tools/types.ts`):

- `id` and an optional `icon` (children of a 24×24 outline SVG).
- `ClientView({ tool, entries, store, informal, locale, onDone, download })`: the client's view,
  also used in demo mode; `tool.linked` and `tool.counsellors` as above, `download(format, params)`
  fetches one of the tool's client PDFs. Changes go through `store` (`create`, `update`, `remove`, `putKeyed`,
  `removeKeyed`), which saves at once, updates `entries` and drives the core's autosave
  indicator. The core renders the header, the share switch and the demo banner.
- `CounsellorView({ entries, options, isNew, locale, linked })`: read only; `isNew(entry)` tells what the
  counsellor has not seen yet. The core renders the header, the PDF export and marks the entries
  as seen.

Generic API used by the modules through the core (`/api` behind the AddonService):

| Route | Who | What |
|---|---|---|
| `GET /me/tools` | client | released tools ("Meine Tools") |
| `GET /me/tools/<tool>` | client | entries, share, options; marks the tool as opened |
| `POST /me/tools/<tool>/entries`, `PUT`/`DELETE .../entries/<id>` | client | unkeyed entries |
| `PUT`/`DELETE /me/tools/<tool>/keyed/<kind>/<key>` | client | keyed entries |
| `PUT /me/tools/<tool>/share` | client | share switch |
| `GET /me/tools/<tool>/export/<format>` | client | the tool's own PDFs (`clientExports`) |
| `/demo/...` (same as `/me/tools/<tool>...`) and `POST /demo/tools/<tool>/reset` | counsellor | demo data |
| `GET /case/tools` | counsellor in a case | tiles: release, entries present, share, new count |
| `POST`/`DELETE /case/tools/<tool>/release` | counsellor in a case | release, withdrawal |
| `GET /case/tools/<tool>/entries`, `POST .../seen` | counsellor in a case | shared entries, seen marker |
| `GET /case/tools/<tool>/export?from=&to=` | counsellor in a case | PDF |
| `GET`/`PUT /counsellor/notification-prefs` | counsellor | own notification preferences |

Besides the API: `/.well-known/oriso-addon.json`, `/schema/settings.json`, `/health`, `/ui/**`,
and for the AddonService `/visibility`, `/stats`, `/events`, `/calendar`.

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
