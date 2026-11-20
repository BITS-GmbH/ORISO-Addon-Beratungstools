# Beratungstools (ORISO add-on)

The digital counselling tools of DigiSucht as one ORISO add-on (contract `oriso-addon/v1`,
ADR-034), behind the [AddonService](https://github.com/OpenResilienceInitiative/ORISO-AddonService).
It replaces the add-ons `digisucht-tools` and `motivationswaage`. Design and the tool module
interface: [ARCHITECTURE.md](ARCHITECTURE.md). Description for admins: [docs/README.md](docs/README.md).

Tools so far: Ausgangssituation und Ziele (`goals`), Motivationswaage (`balance`), Notfallkoffer
(`emergency-kit`), Risikosituationen und Kontrollstrategien (`risk-situations`), Ampelmodell
(`traffic-light`), Positives Wahrnehmen (`positive-perception`).

## Layout

| Path | What |
|---|---|
| `server/src` | Fastify API (Node 24 runs the TypeScript directly), migrations in `db/migrations` |
| `server/src/tools/<id>` | server side of a tool |
| `web/src` | UI bundle (React, the host's web kit), `tools/<id>` per tool |
| `shared` | catalogue of all tools, API types, per-tool texts and calculations |
| `web/dev` | kit stand-in and the local preview |
| `tooling/vite-plugin-oriso-addon` | copy of the AddonService's Vite plugin |

## Development

```sh
npm install
npm run db:up             # MariaDB on localhost:3307 (compose.yaml)
npm run preview           # http://localhost:5179/dev/preview.html: client, counsellor and profile tile (PORT, API_PORT)
npm test                  # unit tests, server and web
npm run test:integration  # against MariaDB (database beratungstools_test)
npm run lint && npm run typecheck
npm run build             # dist/ui/entry.js
```

The preview runs the real API with locally signed tokens and a host stand-in that logs
notifications and audit entries; "Beispieldaten" fills in a released, shared case.

| Variable | Default | |
|---|---|---|
| `DATABASE_URL` | (required) | `mariadb://user:password@host:3306/beratungstools` |
| `ADDONSERVICE_URL` | `http://addonservice:8090` | JWKS and host API |
| `ADDONSERVICE_ISSUER` | `oriso-addonservice` | |
| `NOTIFY_WINDOW_MINUTES` | `15` | bundling window for notifications to counsellors |
| `EXPORT_TIME_ZONE` | `Europe/Berlin` | dates in PDF exports |
| `PORT` | `8080` | |

Images: `harbor.mybits.dev/digisucht/addon-beratungstools:0.1.0-<sha7>`, built by
`.github/workflows/build.yml` on pushes to main.

## License

AGPL-3.0, see [LICENSE](LICENSE).
