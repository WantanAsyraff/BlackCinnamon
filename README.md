# BlackCinnamon

Public landing page and rank store for a Minecraft SMP, with a live
server-data platform. See [PLANNING.md](./PLANNING.md) for the full plan.

- **Frontend:** Next.js (App Router, TypeScript)
- **Backend:** NestJS (TypeScript)
- **Data:** PostgreSQL + Redis
- **Minecraft read path:** RestApi plugin (polled by NestJS)
- **Minecraft fulfilment:** private RCON + LuckPerms
- **Payments:** ToyyibPay

## Architecture boundary

> Next.js renders the product. NestJS owns application logic. RestApi supplies
> read-only Minecraft server data. Private RCON performs tightly controlled
> fulfilment. ToyyibPay owns payment processing.

## Repository layout

```
apps/
  web/        Next.js web app
  api/        NestJS API
packages/
  contracts/      shared API/data contracts
  validation/     shared runtime validation schemas
  design-tokens/  single source of truth for the visual language
  eslint-config/  shared ESLint flat config
  tsconfig/       shared TypeScript configs
infrastructure/
  docker/         service Dockerfiles
  proxy/          Caddy reverse proxy config
docs/             architecture, design, payments, verification notes
```

## Requirements

- Node.js >= 20
- pnpm 12 (via `corepack enable`)
- Docker + Docker Compose (for the full stack)

## Getting started

```bash
cp .env.example .env
pnpm install
```

### Local infrastructure only

```bash
docker compose up -d postgres redis
```

### Run the apps

```bash
pnpm dev           # turbo: web + api + package watchers
```

- Web: http://localhost:3000
- API: http://localhost:3001

To develop just one app you can filter, e.g. `pnpm --filter @blackcinnamon/api dev`.

## Health endpoints

| Endpoint      | Purpose                                                       |
| ------------- | ------------------------------------------------------------- |
| `GET /health` | Liveness. Always returns `200` while the process is up.       |
| `GET /ready`  | Readiness. Checks PostgreSQL and Redis; `503` if any is down. |

## Common commands

```bash
pnpm lint          # ESLint across the workspace
pnpm typecheck     # TypeScript across the workspace
pnpm test          # unit tests across the workspace
pnpm build         # build all apps and packages
pnpm format        # Prettier write
```

## Full stack with Docker

```bash
docker compose up --build
```

- Web via proxy: http://localhost:8080
- API via proxy: http://localhost:8080/health

## Environment

All configuration lives in `.env` (see `.env.example`). Secrets must never be
committed. The Minecraft RestApi address, RCON credentials and ToyyibPay secret
key are **server-side only** and must never be exposed to the browser.
