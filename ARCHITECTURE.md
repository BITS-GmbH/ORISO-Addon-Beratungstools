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

Available: all nine. A tool without a module would stay in the catalogue (`shared/catalog.ts`,
ids, titles, tile texts, audience, order); the core offers only tools with a module, so such a
tool is neither offered for release nor shown, and has no settings or statistics.

Links between tools go through the core, not through imports between tool modules:

- `active` owns planned activities; both diaries read them (same records, no copies, `reads`):
  the client sees them in a diary only while "Aktiv sein" is released, counsellors only while it
  is shared as well, as for every `reads` link. The shape of an activity and the expansion of
  repetitions live in `shared/activities.ts`, so neither diary imports the tool module.
- `emergency-kit` shows the entries of `risk-situations` when that tool is released (`reads`).
- The consumption diary's topics can be preset from the registration (`registrationRef` of the
  `user.registered` event), once Los 2 delivers it.

## Apps and slots

One app, `tools`:

- `asker.navigation`: "Meine Tools", the released tools of the client. Visibility is dynamic:
  hidden until a counsellor releases a tool. The navigation entry shows the app title ("Tools"):
  the manifest has one title per app for all its slots, so the client's entry cannot read "Meine
  Tools" without a per-slot label in the host or a separate app.
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
- **Form of address**: the client UI follows the host's `informal` prop (or the locale
  `de@informal`). Server texts go to counsellors (formal) or, for the release notification to the
  client, are worded without address, because the counsellor's request does not carry the
  client's form of address.
- **Languages**: all texts come from one catalogue per language; see "Languages" below.

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
- `settings_snapshots (tenant_id, agency_id, value JSON, updated_at)`: the last settings the host
  API returned for a Träger and agency (agency 0 for requests without one), for the internal API
  below.

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

**Shared** (`shared/tools/<id>.ts`): ids, constants, calculations used by both sides; the tool's
texts are in the catalogue under its namespace (`goals`, `consumptionDiary`, ...). No zod and
nothing server-only, it is bundled into the UI.

**Server** (`ServerTool` in `server/src/tools/types.ts`):

- `id`: the catalogue id.
- `kinds`: record types with a zod `schema` for `data`; optional `keys(key)` for keyed kinds (one
  record per key, written with `PUT .../keyed/<kind>/<key>`), `max` per client, `dated` (needs
  `day`), `announce(username)` for requests to the counsellors (creating such an entry notifies
  them at once, shared or not, never in demo mode; the text carries no tool content; in every
  language, built with `localized`).
- `options`: settings per Träger and agency (JSON Schema subset); the core prefixes the keys and
  hands the tool its values as `options` (client and counsellor views, export).
- `exportPdf(pdf, { entries, options, linked, counsellors, i18n })`: the tool's part of the PDF below
  the common header, through `PdfWriter` (`heading`, `subheading`, `paragraph`, `field`, `item`,
  `table`, `spacer`, and `drawing` for pdfkit graphics). `exportRange: true` lets counsellors pick a period (diaries);
  dated entries are then filtered by `day`. `i18n` is the language of the PDF (formal German for
  `de`).
- `clientExports`: PDFs the client makes of their own entries (`GET /me/tools/<tool>/export/<format>`,
  query parameters as `params`), with the common header or `bare` for an own layout; `title(i18n)`.
- `reads`: other tools whose entries this tool shows. The core hands them over as `linked`: to the
  client while that tool is released (in demo mode the counsellor's demo data), to counsellors
  only while the client shares that tool as well. Tools never import each other.
- `counsellorNames`: the names of the client's counsellors from the host context, as `counsellors`.
- `demo(i18n)`: optional example entries for the counsellor's demo in the counsellor's language,
  applied on first use and reset.
- `calendar({ releasedAt, shared, entries })`: optional reminders for the client's calendar, with
  titles in every language (`localized`). The AddonService collects them for clients
  (`GET /addons/calendar`); ORISO-Frontend (v2.0.17) shows them only in the timeline of the session
  list ("Jetzt"), not in the calendar "Meine Termine", which does not query add-ons yet.

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

## Internal API for other add-ons

Other add-ons in the cluster can read what a client shares, server to server, without the
AddonService gateway (decided for `dokumentation`, the counsellors' documentation). The caller
forwards the add-on token the AddonService issued to it for the counsellor's request: same JWKS
and issuer, `aud` is the caller's name, and `askerId` is set only after the AddonService checked
the counsellor's access to the session.

- `TRUSTED_READERS` (comma-separated add-on names, default empty) lists the audiences accepted
  besides `beratungstools`. Tokens of a trusted reader get 403 on every other route; tokens of
  this add-on get 403 on `/internal/**`.
- Every route needs the role `consultant` (else 403) and `askerId` (else 400), and checks
  release, share and settings like the case routes. Reads neither mark entries as seen nor notify
  nor write audit entries.
- `GET /internal/case/tools?lang=`: `{ tools: [{ id, title, lastChangedAt }] }`, the tools the
  counsellor may read now, in catalogue order.
- `GET /internal/case/tools/<tool>/text?lang=&from=&to=`: `{ id, title, text }`, the counsellor PDF
  export of the tool as plain text (first line the period of the entries; headings with `#`,
  list items with `- `, table rows with ` | ` between cells; drawings left out). 403 when not
  readable.

The host API answers `/settings` for the add-on the token was issued for, so a reader's token
would get the reader's settings. Therefore every regular request that gets settings from the host
keeps a snapshot per Träger and agency (written in the background when changed or older than five
minutes; a failure only logs). Internal reads use the snapshot of the token's agency, else of the
Träger, else the schema defaults. A change in ORISO-Admin reaches internal reads with the next
regular request of that agency.

## Languages

ORISO's languages are German (formal "Sie", and informal "du" as `de@informal`), English,
French, Russian, Tigrinya and Turkish. The add-on ships its own translations (ADR-034); the host
only passes the locale.

**Catalogue** (`shared/i18n`): one file per language. `de.ts` is the source and defines every
key; its type is the schema. A value is a text with `{placeholders}`, a pair
`{ formal, informal }` (German only), a plural `{ one, other }` (plus `few`, `many`, ... as the
language needs, chosen by `count`), a list or a nested namespace: `common`, `days`, `catalog`
(title, summary and tile text per tool), the core views (`client`, `toolPage`, `counsellor`,
`entries`, `demo`, `prefs`, `profile`, `rangePicker`, `planned`), the server texts (`pdf`,
`notifications`, `audit`, `manifest`) and one namespace per tool. `en.ts` is typed `Complete`,
so a missing key is a type error; `fr.ts`, `ru.ts`, `ti.ts` and `tr.ts` are typed `Catalogue`
(partial). `server/test/i18n.test.ts` lists, per language, missing keys, wrong list lengths,
unknown placeholders and missing plural forms, and fails on em dashes.

**Lookup** (`shared/i18n/index.ts`): `i18n(lang, informal)` gives `m` (the catalogue of that
language with English, then German, filling in what it lacks, forms of address resolved),
`t(text, vars)` for placeholders and plurals, and `number` formatting with `Intl` for the language
(`de-DE`, `en-GB`, `fr-FR`, `ru-RU`, `ti`, `tr-TR`). Every date, in the web and in PDFs, goes
through one helper (`shared/i18n/dates.ts`, used by `i18n.date`/`formatDate` and by
`shared/days.ts` for days, weeks, periods and months): `Intl` per language, with the separator of
the full date also for day and month alone (Turkish `23.11`, not `23/11`), and periods built the
same way everywhere (`days.period`). Browsers mostly have no Tigrinya dates, so Tigrinya uses the
numeric order `dd/MM/yyyy` with weekday and month names from the catalogue (`days.weekdays`,
`days.weekdaysShort`, `days.months`, `days.weekdayDate`, `days.monthYear`). `localized(fn)` builds
a text in every language for the host.

**Where the language comes from:**

- Web: the host's `locale` prop (`langOf`: `de@informal` and `en-GB` map to `de` and `en`; unknown
  languages fall back to German) and `informal`; views call `useI18n()`.
- PDFs: the web adds `?lang=` to every export (`/case/tools/<tool>/export`,
  `/me/tools/<tool>/export/<format>`); without it the PDF is German. The add-on token carries no
  locale.
- Demo: the web adds `?lang=` when it loads or resets a demo, so the example entries are seeded in
  the counsellor's language. They are stored like the client's entries and keep that language.
- Notifications, audit summaries, calendar entries, statistics labels and the manifest: sent in
  all languages (the host's localized text accepts any language code and shows the recipient's
  language, else German). The add-on does not need to know the recipient's language.
- ORISO-Admin settings (titles and descriptions of the settings schema) stay German, as
  ORISO-Admin is German; so do the stored values of settings such as the Motivationswaage's pole
  labels (shown translated by their position).

**Not translated:** what users or admins write (entries, picked suggestions once saved, the
agency's contact details, custom intro texts from the settings) and the example entries of a demo
once seeded.

**PDF font:** pdfkit embeds one font per text run and has no fallback, so the PDFs use
`server/fonts/BeratungstoolsSans-*.ttf`: Noto Sans (Latin, Greek, Cyrillic) merged with Noto Sans
Ethiopic (Ge'ez), both under the SIL Open Font License (`server/fonts/OFL.txt`), built with
`tooling/fonts/merge.py`. The web UI uses the host's fonts.

**Adding a translation:** translate the values in `shared/i18n/<lang>.ts` (a copy of `en.ts` to
start from), keeping the keys, the `{placeholders}` and the length of lists; add the plural forms
the language needs; run `npm test` until `server/test/i18n.test.ts` passes. New texts are added
to `de.ts` first; TypeScript then asks for them in `en.ts`, and the test lists them for the other
languages, which show English until they are translated. A new language needs an entry in `LANGS`
and `INTL_LOCALES` in `shared/i18n/index.ts` and a catalogue file.

## Stack

- Server: Node 24, TypeScript, Fastify, `mariadb`, zod. Tokens verified against the
  AddonService JWKS (RS256, issuer and audience), as in the earlier add-ons.
- Web: React with TSX, built by Vite with `@oriso/vite-plugin-addon`, so React and the web kit
  (`@oriso/web-kit`) come from the host. One ES module `ui/entry.js` with the mount lifecycle.
- Tests: Vitest on both sides; server integration tests against a MariaDB container.
- Image: one container serving API and UI bundle, built in CI and pushed to Harbor.

## Open points (from delphi's specification)

- Feedback from counsellors to entries: channel not decided (comment in the tool or a chat
  message). The diaries' row "Rückmeldung vom Beratungsteam" is left out until it is.
- Appointments with counsellors in the diaries come with the appointment service (Los 3); not
  shown yet.
- Consumption diary: topics preset from the registration (Los 2) and further topics activated
  by counsellors are not implemented; clients choose alcohol, cannabis, gambling and media
  themselves.
- Notifications by mail in addition to the platform.
- Export formats besides PDF; storing exports in the documentation (Los 4).
- Responsive behaviour on narrow screens and for archived cases.
- The open tool is not in the URL, so a reload or the browser's back button returns to the tool
  overview. The host passes no route, sub-path or query to add-ons, its route
  `addons/:addonName/:appId` takes no sub-path, `navigate` is the host router's push and a change
  of the URL alone does not call `update`. Needed from the host: a sub-path (or a query parameter
  reserved for the add-on, also on the `?addon=` panel of the case view) passed as a prop, kept
  in history entries, with `update` on every change.
