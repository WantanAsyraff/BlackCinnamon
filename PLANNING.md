# Minecraft SMP Website & Store — Project Planning

**Document:** `PLANNING.md`  
**Project type:** Public landing page + Minecraft rank store + RestApi-powered server-data platform  
**Primary audience:** Southeast Asia, initially Malaysia  
**Primary payment gateway:** ToyyibPay  
**Architecture style:** TypeScript-first monorepo, API-driven, containerized, real-time capable  
**Design priority:** Original identity, accessibility, simplicity, speed, and trust

---

## 1. Project Goal

Build a fast, accessible, mobile-first website for a Minecraft SMP that serves two primary purposes:

1. Help new players understand the server and join quickly.
2. Let existing players safely purchase ranks and other approved server products.

The website may take structural inspiration from successful Minecraft server stores such as DonutSMP, but it must **not imitate their visual identity**. The site should feel specific to our server through real screenshots, server data, branding, typography, copy, community activity, and game systems.

The platform should also be designed so it can grow beyond a static landing page into a live companion platform containing server status, online-player data, leaderboards, events, economy statistics, and other server-driven features. The initial Minecraft data source will be the RestApi plugin from Modrinth; richer telemetry must only be added when an actual supported data source exists.

---

# 2. Product Principles

## 2.1 Keep the website focused

Every page or component must support at least one of these goals:

- Help a player join the server.
- Explain what makes the server different.
- Help a player understand a rank or product.
- Complete a purchase.
- Show useful live server information.
- Build trust.
- Provide support or legal information.

If a section exists only to make the site look more impressive, remove it.

---

## 2.2 Avoid generic AI-generated design

The website must not look like a generic AI-generated SaaS landing page.

Avoid default patterns such as:

- Purple-blue gradient backgrounds everywhere.
- Large glowing blobs.
- Excessive glassmorphism.
- Huge rounded cards nested inside other cards.
- Fake dashboards used as decoration.
- Random 3D graphics.
- AI-generated Minecraft artwork used instead of real server content.
- Constant animations.
- Large feature grids with repetitive copy.
- Generic text such as:
  - "The Ultimate Minecraft Experience"
  - "Embark on an Epic Adventure"
  - "Level Up Your Journey"
- Multiple conflicting accent colours.
- Excessive shadows.
- Tiny gray body text.
- Carousels that hide important content.

Instead use:

- Real server screenshots.
- Screenshots of actual builds.
- Actual events and player activity.
- Real server statistics.
- Original iconography.
- Consistent spacing.
- Strong typography.
- One identifiable brand colour.
- A small design system.
- Clear hierarchy.
- Short copy.

---

## 2.3 AI development rule

AI tools may:

- Implement approved components.
- Generate tests.
- Refactor code.
- Generate API clients.
- Implement responsive states.
- Generate accessibility tests.
- Help document the system.

AI tools must **not independently redesign pages** outside the approved design system.

Add this rule to the project:

> AI may implement the design system, but it may not invent a new visual language on a page-by-page basis.

---

# 3. Target Audience

Primary:

- Malaysia
- Indonesia
- Singapore
- Brunei
- Other Southeast Asian players

Expected behaviour:

- High mobile usage.
- Mixed connection quality.
- Discord-heavy community.
- Players familiar with Minecraft usernames but not necessarily technical terminology.
- Preference for convenient local payment methods where available.

Initial store currency:

- MYR

Future currency/display support may include:

- IDR
- SGD
- BND
- THB
- PHP
- VND

Do not perform client-side currency conversion for actual settlement. Payment amounts must always come from the backend.

---

# 4. Recommended Technology Stack

## 4.1 Frontend

### Next.js

Use:

- Next.js
- React
- TypeScript
- App Router
- Server Components where useful
- CSS Modules, Tailwind CSS, or another utility layer strictly under a custom design system
- Accessible headless primitives where useful

Next.js is responsible for:

- Landing pages.
- Store UI.
- Rank comparison.
- Account pages.
- SEO.
- Server-rendered public content.
- Admin UI.
- Connecting to the application API.
- Subscribing to real-time server events.

It should **not** directly communicate with the Minecraft server.

---

## 4.2 Backend / application integration layer

### NestJS

NestJS remains the core application backend.

Responsibilities:

- REST API for the website.
- RestApi Minecraft plugin adapter.
- Polling and caching server information.
- Normalizing Minecraft server responses into stable website contracts.
- Optional SSE/WebSocket fan-out to browsers.
- Player/account services.
- Store/order logic.
- ToyyibPay integration.
- Webhook handling.
- Queueing rank fulfilment.
- RCON-based fulfilment through strict internal command templates.
- Product management.
- Authentication and authorization.
- Admin audit logs.
- Scheduled reconciliation jobs.

The website must **not** call the Minecraft RestApi plugin directly.

Recommended flow:

```text
Minecraft RestApi Plugin
        |
        | private/server-side HTTP
        v
NestJS RestApi Adapter
        |
        +--> Redis Cache
        |
        +--> Public REST/SSE API
                 |
                 v
              Next.js
```

This creates a stable abstraction around the Minecraft plugin. If the plugin response format changes later, only the NestJS adapter needs to change.

### Browser realtime

For the public website, prefer:

- REST for initial page data.
- Server-Sent Events (SSE) for simple one-way live status updates.

WebSockets may be introduced later for genuinely bidirectional features.

### Rank fulfilment

RestApi is not treated as a command-execution system.

Rank fulfilment is a separate backend-only capability using:

- Minecraft RCON.
- LuckPerms.
- Strict predefined command templates.
- Redis/BullMQ retries.

The public web application must never receive RCON credentials or arbitrary command capability.

## 4.3 Database

Use:

### PostgreSQL

Store:

- Accounts.
- Minecraft profiles.
- Products.
- Ranks.
- Orders.
- Payments.
- Purchase events.
- Entitlements.
- Announcements.
- Optional historical server-status aggregates.
- Audit records.

Do not store every RestApi poll in PostgreSQL. Keep current status in Redis and persist only aggregates/history that are actually needed.

---

## 4.4 Cache and queue

Use:

### Redis

For:

- API caching.
- Server status.
- Session/cache data.
- Rate-limit counters.
- BullMQ jobs.
- Rank fulfilment.
- Retry jobs.
- Cached RestApi responses.
- SSE publication state where required.

---

## 4.5 Minecraft server

Recommended initial server stack:

- Paper
- LuckPerms
- RestApi plugin
- Minecraft RCON enabled only for private backend fulfilment
- Optional Velocity proxy if the network grows

### RestApi plugin

Project:

`https://modrinth.com/plugin/restapi`

The selected RestApi plugin provides:

- Real-time server information.
- Online-player list access.
- An embedded HTTP server.
- A configurable HTTP port.
- Compatibility with Paper, Purpur, and Spigot.
- Support listed for Minecraft 1.16.x through 1.21.x.

The public plugin description does **not** document a general command-execution API.

Therefore it will be used as a **read-side server integration**, not as the payment fulfilment mechanism.

### Important capability boundary

Use RestApi for:

```text
Server online state
Server information
Online player information
Any additional fields confirmed by the installed plugin response
```

Do not assume it exposes:

```text
LuckPerms commands
Console commands
Rank grants
Economy data
TPS/MSPT
Historical telemetry
Player UUID lookup
Events/webhooks
```

unless those capabilities are confirmed from the installed version.

### Version-control rule

Do not fork or modify RestApi during the MVP.

Treat it as an external dependency and isolate it behind:

```text
MinecraftRestApiClient
```

inside NestJS.

### Dependency risk

The public RestApi listing is intentionally lightweight and does not publish a rich API contract on the Modrinth page. The project must therefore:

- Pin the production plugin version.
- Keep response fixtures.
- Validate responses at runtime.
- Fail gracefully if fields disappear.
- Stage-test Minecraft/Paper upgrades.
- Avoid making checkout/payment depend on RestApi availability.

The storefront must still be able to sell and reconcile orders even when live server status is temporarily unavailable.

# 5. Why This Architecture Fits Minecraft Better

The selected Minecraft plugin exposes server information through HTTP, so the application should use a conventional server-side REST integration rather than building a custom Paper communication plugin.

Architecture:

```text
                   READ PATH

Minecraft Server
      |
      | RestApi plugin
      | HTTP on configured port
      v
NestJS
MinecraftRestApiClient
      |
      +------ Redis cache
      |
      +------ PostgreSQL aggregates if required
      |
      +------ REST / SSE
                    |
                    v
                 Next.js


                  PURCHASE PATH

Player
  |
  v
Next.js Store
  |
  v
NestJS
  |
  +------ PostgreSQL
  |
  +------ ToyyibPay
  |          |
  |          +---- callback ----+
  |                            |
  +----------------------------+
  |
  v
BullMQ Fulfilment
  |
  | private RCON
  v
Paper Console
  |
  v
LuckPerms
```

Advantages:

- No custom Minecraft API plugin needs to be maintained for the website.
- The selected RestApi plugin supplies the read-side Minecraft information.
- The plugin port stays hidden from public browsers.
- NestJS can cache and normalize the plugin response.
- Frontend code is independent of the Minecraft plugin schema.
- Payment logic remains completely outside Minecraft.
- Rank delivery is recoverable if the server is offline.
- RCON is isolated to an internal fulfilment adapter.
- Future server-data providers can replace RestApi without redesigning the frontend.

The most important rule is:

> RestApi supplies server data. NestJS owns application logic. ToyyibPay owns payment processing. RCON is used only for controlled fulfilment.

# 6. Monorepo Structure

Recommended:

```text
minecraft-platform/
|
├── apps/
│   ├── web/                       # Next.js
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── lib/
│   │   ├── public/
│   │   ├── styles/
│   │   └── tests/
│   │
│   └── api/                       # NestJS
│       ├── src/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── minecraft/
│       │   │   ├── restapi/
│       │   │   ├── status/
│       │   │   ├── players/
│       │   │   └── rcon/
│       │   ├── products/
│       │   ├── orders/
│       │   ├── payments/
│       │   ├── toyyibpay/
│       │   ├── entitlements/
│       │   ├── fulfilment/
│       │   ├── announcements/
│       │   ├── admin/
│       │   ├── audit/
│       │   └── health/
│       └── test/
│
├── packages/
│   ├── contracts/                 # shared API/event schemas
│   ├── validation/
│   ├── design-tokens/
│   ├── eslint-config/
│   └── tsconfig/
│
├── infrastructure/
│   ├── docker/
│   ├── proxy/
│   ├── monitoring/
│   └── deployment/
│
├── docs/
│   ├── architecture/
│   ├── design/
│   ├── minecraft/
│   │   ├── restapi-integration.md
│   │   └── rcon-fulfilment.md
│   ├── payments/
│   ├── api/
│   └── verification/
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example
├── PLANNING.md
└── README.md
```

Recommended monorepo tooling:

- pnpm workspaces
- Turborepo

There is intentionally **no custom Minecraft plugin project in the MVP**.

# 7. Public Website Information Architecture

Primary routes:

```text
/
├── /play
├── /store
│   ├── /ranks
│   └── /ranks/[slug]
├── /rules
├── /support
├── /status
├── /legal
│   ├── /terms
│   ├── /privacy
│   └── /refunds
└── /account
    ├── /orders
    └── /minecraft
```

Optional later:

```text
/leaderboards
/players/[username]
/economy
/events
/map
/vote
/wiki
```

---

# 8. Landing Page

## 8.1 Navigation

Desktop:

```text
[LOGO]

Home
Play
Store
Ranks
Rules

[Discord] [Copy IP]
```

Mobile:

```text
[LOGO]                         [MENU]
```

The server IP should always be easy to access.

---

## 8.2 Hero

Use one strong real server screenshot.

Example structure:

```text
[SERVER NAME]

Survival. Trading. Player-driven economy.

842 players online

play.example.com

[Copy IP] [Start Playing]
```

Do not overload the hero with statistics or promotional copy.

---

## 8.3 Server status

Show:

- Online/offline.
- Online players.
- Max players.
- Version.
- Server address.
- Java/Bedrock support.
- Ping/status age.

Example:

```text
ONLINE

842 / 2,500 Players

play.example.com

Java 1.21.x
Bedrock Supported

[Copy IP]
```

Status should be supplied by NestJS.

---

# 9. Minecraft RestApi Integration

The selected plugin is:

`https://modrinth.com/plugin/restapi`

Its documented purpose is to expose real-time server information and the list of online players through an embedded HTTP server.

NestJS should own all communication with this service.

## 9.1 Integration boundary

Create:

```text
MinecraftRestApiModule
MinecraftRestApiClient
MinecraftStatusService
MinecraftPlayerService
```

The client is responsible only for contacting RestApi.

The rest of the application consumes normalized internal DTOs rather than raw plugin responses.

Example:

```text
RestApi raw response
        |
        v
MinecraftRestApiClient
        |
        v
Normalization / validation
        |
        v
ServerStatusDTO
        |
        +--> Redis
        +--> API
        +--> SSE
```

## 9.2 Do not hardcode an assumed response schema

The public listing does not provide enough detail to safely design the full response contract in advance.

During integration:

1. Install the exact RestApi version on the development Minecraft server.
2. Configure its HTTP port.
3. Call every documented endpoint.
4. Capture real responses.
5. Save sanitized fixtures under:

```text
apps/api/test/fixtures/minecraft-restapi/
```

6. Create runtime validation schemas.
7. Map the raw responses to internal DTOs.
8. Add contract tests.

The website must never depend directly on undocumented raw fields.

---

# 10. Normalized Server Data Model

The internal website contract should remain stable even if the plugin format changes.

Example target contract:

```json
{
  "serverId": "survival-01",
  "online": true,
  "players": {
    "online": 842,
    "max": 2500
  },
  "version": "1.21.x",
  "motd": "Server Name",
  "updatedAt": "2026-09-20T08:00:00Z",
  "stale": false
}
```

Only populate fields actually supplied or reliably derivable from the installed plugin.

If RestApi does not provide a field, return:

```text
null
```

or omit it according to the shared API contract.

Do not manufacture values.

## 10.1 Online players

If exposed by RestApi, normalize players to the minimum data required by the website.

Example:

```json
{
  "username": "ExamplePlayer"
}
```

Do not expose sensitive server-side metadata merely because the plugin returns it.

## 10.2 Polling strategy

RestApi is HTTP-based.

Recommended initial polling:

```text
Server status       every 10 seconds
Online player list  every 10-15 seconds
Static information  every 5 minutes
```

Tune this after measuring server impact.

Do not have every website visitor poll the Minecraft plugin independently.

One NestJS polling process should populate Redis.

Public users then read the cached result.

---

# 11. RestApi Network Security

The RestApi plugin runs an embedded HTTP server on a configurable port.

Treat that port as internal infrastructure.

Recommended deployment:

```text
Internet
   X
   |
   | blocked
   |
RestApi Port
   ^
   |
NestJS only
```

Preferred network options, in order:

1. Same host / localhost where practical.
2. Private LAN/VPC.
3. WireGuard/Tailscale or equivalent private network.
4. Firewall allowlist limited to the NestJS host.

Do not intentionally expose the RestApi port to public browsers.

If TLS or authentication is not provided by the installed plugin/version, enforce protection at the network layer.

Configuration values should be server-side only:

```env
MINECRAFT_REST_API_BASE_URL=
MINECRAFT_REST_API_TIMEOUT_MS=3000
MINECRAFT_REST_API_POLL_MS=10000
```

Do not place these in public Next.js environment variables.

---

# 12. Live Website Updates

The Minecraft plugin itself does not need a WebSocket connection.

Use:

```text
RestApi
  |
  | polling
  v
NestJS
  |
  +--> Redis
  |
  +--> REST
  |
  +--> SSE
          |
          v
       Next.js
```

Recommended public pattern:

1. Page loads using server-rendered/cached REST data.
2. Browser optionally opens an SSE stream.
3. NestJS emits updates only when normalized values change.

Possible public events:

```text
server.status
server.player-count
```

WebSockets can be added later if the project gains bidirectional real-time features.

Never expose:

- RestApi internal URL.
- Internal server IP.
- RCON credentials.
- Admin actions.
- Private player data.
- Raw plugin payloads.

# 13. Server Description Section

Keep it short.

Example:

### Build

Create bases, towns, farms and businesses.

### Trade

Participate in a player-driven economy.

### Compete

Join events and climb leaderboards.

### Community

Play with an active regional playerbase.

Maximum 3-4 primary concepts.

---

# 14. Rank Store

Initial route:

```text
/store/ranks
```

Each rank card contains:

- Rank name.
- Price.
- Duration.
- Important benefits.
- Link to details.
- Purchase action.

Example:

```text
ELITE

RM 24.90
30 Days

✓ 8 Homes
✓ Additional Auction Slots
✓ Queue Priority
✓ Cosmetic Features

[View Rank]
```

Do not show a fake discount.

Only use "Popular" or equivalent when supported by real purchase data.

---

# 15. Rank Comparison

Provide a comparison page optimized for understanding.

Example:

| Feature        | Player | VIP | Elite | Legend |
| -------------- | -----: | --: | ----: | -----: |
| Homes          |      2 |   4 |     8 |     12 |
| Auction slots  |      5 |  10 |    20 |     30 |
| Queue priority |     No | Yes |   Yes |    Yes |
| Chat cosmetics |     No | Yes |   Yes |    Yes |

On mobile, use accessible stacked comparison controls.

Avoid a table that requires extreme horizontal scrolling.

---

# 16. Purchase Flow

Recommended flow:

```text
Rank
  ↓
Minecraft Username
  ↓
Player Verification
  ↓
Contact Information
  ↓
Order Review
  ↓
ToyyibPay
  ↓
Payment Callback
  ↓
Server-side Verification
  ↓
Entitlement
  ↓
Minecraft Fulfilment
  ↓
Success
```

---

# 17. Minecraft Identity

Checkout asks for:

```text
Minecraft username
```

Backend resolves:

- Username.
- UUID.
- Optional avatar.

Never trust a client-submitted UUID.

Store the resolved UUID with the order.

This prevents entitlement problems if the player later changes username.

---

# 18. ToyyibPay Integration

ToyyibPay is the primary payment gateway.

Integration belongs in NestJS.

Never expose:

```text
userSecretKey
```

to Next.js or browser code.

---

## 18.1 ToyyibPay environments

Development:

```text
https://dev.toyyibpay.com
```

Production:

```text
https://toyyibpay.com
```

Use separate credentials.

Example:

```env
TOYYIBPAY_ENV=sandbox
TOYYIBPAY_SECRET_KEY=
TOYYIBPAY_CATEGORY_CODE=
TOYYIBPAY_CALLBACK_URL=
TOYYIBPAY_RETURN_URL=
```

---

# 19. ToyyibPay Checkout Flow

## 19.1 Create internal order first

Before talking to ToyyibPay:

```text
POST /api/v1/checkout
```

Backend:

1. Validates product.
2. Loads price from database.
3. Resolves Minecraft account.
4. Creates internal order.
5. Generates public order reference.
6. Sets status `PENDING_PAYMENT`.

Never accept a total supplied by the frontend.

---

## 19.2 Create ToyyibPay bill

NestJS sends the ToyyibPay Create Bill request.

Important fields include:

```text
userSecretKey
categoryCode
billName
billDescription
billPriceSetting
billPayorInfo
billAmount
billReturnUrl
billCallbackUrl
billExternalReferenceNo
billTo
billEmail
billPhone
billPaymentChannel
```

For rank purchases:

```text
billPriceSetting = 1
```

`billAmount` is sent in cents.

Example:

```text
RM 24.90
=
2490
```

Use internal order ID as:

```text
billExternalReferenceNo
```

---

## 19.3 DuitNow QR

ToyyibPay supports an optional DuitNow QR field for accounts that have the feature activated.

Configuration:

```text
enableDuitNowQR = 1
```

Treat its availability as an environment/account capability, not something the UI assumes.

---

# 20. Payment Redirect

After a successful Create Bill response:

```text
https://toyyibpay.com/{BillCode}
```

Redirect the user there.

Persist:

```text
billCode
orderId
provider
amount
createdAt
```

before redirecting.

---

# 21. Callback vs Return URL

These must be treated differently.

## Return URL

The browser is redirected here.

Example:

```text
/payment/return
```

The browser result is for UX only.

Do not grant a rank because:

```text
status_id=1
```

appeared in the browser URL.

---

## Callback URL

ToyyibPay sends server-to-server payment information.

Example:

```text
POST /api/v1/payments/toyyibpay/callback
```

Use this to update payment state.

---

# 22. Callback Verification

ToyyibPay provides a callback hash.

Implement validation according to the provider specification.

Conceptually:

```text
expected =
MD5(
  userSecretKey
  + status
  + order_id
  + refno
  + "ok"
)
```

Compare expected and received hashes.

Do not process an invalid callback.

Because MD5 is part of ToyyibPay's callback protocol, use it only for the required provider verification mechanism. Do not use MD5 for application passwords or internal cryptographic design.

---

# 23. Payment Verification Defence

A callback should not immediately issue arbitrary commands.

Recommended process:

```text
Callback
   ↓
Validate hash
   ↓
Locate internal order
   ↓
Check amount/reference
   ↓
Record provider event
   ↓
Verify/reconcile transaction where required
   ↓
Mark payment successful
   ↓
Create entitlement
   ↓
Queue fulfilment job
```

The ToyyibPay Get Bill Transactions API can be used for reconciliation.

This is particularly useful for:

- Delayed callbacks.
- Support investigations.
- Pending transactions.
- Reconciliation jobs.

---

# 24. Payment Statuses

Internal statuses should not mirror gateway strings directly.

Use:

```text
PENDING
PROCESSING
PAID
FAILED
EXPIRED
REFUNDED
CANCELLED
```

Store raw ToyyibPay status separately.

---

# 25. Idempotency

Payment callbacks may be repeated.

The backend must safely handle duplicate events.

Use a unique provider reference.

Example uniqueness:

```text
provider + refno
```

or equivalent confirmed provider transaction identifier.

If a successful callback arrives twice:

```text
Rank should still only be granted once.
```

---

# 26. Rank Fulfilment

RestApi is **not** responsible for rank fulfilment.

After ToyyibPay payment confirmation:

```text
payment.paid
   ↓
Create entitlement
   ↓
BullMQ
   ↓
minecraft.grant-rank
   ↓
RconFulfilmentService
   ↓
Private RCON connection
   ↓
Paper console
   ↓
LuckPerms
   ↓
Persist fulfilment result
```

Payment state and fulfilment state must remain separate.

If Minecraft is unavailable:

```text
Payment = PAID
Fulfilment = RETRYING
```

The user's payment must never be lost because the game server is offline.

---

# 27. RCON and LuckPerms

Paper exposes Minecraft's RCON settings through `server.properties`.

Required server-side settings:

```properties
enable-rcon=true
rcon.port=25575
rcon.password=<strong-random-secret>
```

The exact port may be changed.

## 27.1 RCON must stay private

RCON provides console-level command execution.

Therefore:

- Never expose the RCON port publicly.
- Prefer localhost/private network/VPN connectivity.
- Firewall the port to the NestJS/worker host only.
- Use a strong random password.
- Store the password only in the backend secret store/environment.
- Rotate the password when staff/infrastructure access changes.

Backend environment:

```env
MINECRAFT_RCON_HOST=
MINECRAFT_RCON_PORT=
MINECRAFT_RCON_PASSWORD=
```

## 27.2 Never create a generic command API

Do not implement:

```http
POST /api/admin/minecraft/command
```

for normal application use.

Do not accept:

```json
{
  "command": "anything supplied by a browser"
}
```

Instead expose internal application actions:

```typescript
grantRank(playerUuid, rank, duration);
removeRank(playerUuid, rank);
```

The server-side adapter produces the command.

Example conceptual mapping:

```text
grantRank(uuid, "elite", 30 days)
        ↓
approved template
        ↓
LuckPerms command
```

Rank identifiers must come from an allowlist/database mapping owned by the backend.

## 27.3 LuckPerms mapping

Store the Minecraft group separately from the display name.

Example:

```text
Product: Elite Rank
slug: elite
permission_group: elite
```

The browser never decides:

```text
permission_group
```

## 27.4 Fulfilment acknowledgement

RCON responses are useful but not equivalent to a transactional database acknowledgement.

After running a command:

1. Capture response.
2. Record execution time.
3. Record command template ID, not secret values.
4. Mark the fulfilment successful only according to a defined success rule.
5. Retry ambiguous failures safely.

For stronger guarantees later, a dedicated command/entitlement plugin can replace RCON behind the same `MinecraftFulfilmentProvider` interface without changing checkout code.

# 28. Orders Data Model

## users

```text
id
email
password_hash
discord_id
created_at
updated_at
```

## minecraft_accounts

```text
id
user_id
username
uuid
verified_at
created_at
updated_at
```

## products

```text
id
slug
name
description
type
price_minor
currency
active
created_at
updated_at
```

## ranks

```text
id
product_id
permission_group
duration_seconds
sort_order
```

## rank_features

```text
id
rank_id
label
value
sort_order
```

## orders

```text
id
public_id
user_id
minecraft_account_id
currency
subtotal_minor
total_minor
status
created_at
updated_at
```

## order_items

```text
id
order_id
product_id
product_name_snapshot
unit_price_minor
quantity
```

Store product snapshots so historical orders remain accurate after price/name changes.

---

# 29. Payment Tables

## payments

```text
id
order_id
provider
provider_bill_code
provider_reference
amount_minor
currency
status
paid_at
created_at
updated_at
```

## payment_events

```text
id
payment_id
provider
event_key
event_type
raw_payload
verified
processed_at
created_at
```

## entitlements

```text
id
order_item_id
minecraft_account_id
type
value
starts_at
expires_at
status
created_at
updated_at
```

## fulfilment_jobs

```text
id
entitlement_id
server_id
action
status
attempts
last_error
acknowledged_at
created_at
updated_at
```

---

# 30. Admin Dashboard

Initial admin functionality:

```text
Dashboard
Products
Ranks
Orders
Payments
Players
Announcements
Server Status
Fulfilment
Audit Logs
Settings
```

Dashboard summary:

```text
Revenue Today
Successful Orders
Pending Orders
Failed Payments
Online Players
Minecraft Connection
Queue Health
```

Avoid building dozens of charts.

Prioritize operational information.

---

# 31. Announcements

Backend-managed announcements allow the landing page to contain real server content.

Example:

```text
Season 2 starts September 26
Weekend marketplace event
New spawn released
PvP tournament Saturday
```

Routes:

```http
GET /api/v1/announcements
POST /api/v1/admin/announcements
PATCH /api/v1/admin/announcements/:id
```

---

# 32. Screenshots

Use:

- Spawn.
- Player shops.
- Community builds.
- PvP.
- Events.
- Custom mechanics.
- Seasonal areas.

Image requirements:

- Real server media.
- AVIF/WebP.
- Responsive sizes.
- Lazy loading where appropriate.
- Useful alt text.
- No important text baked into imagery.

---

# 33. Community Section

Keep simple:

```text
Join the Community

Updates, events and support.

[Join Discord]
```

Future integration may show:

- Discord member count.
- Discord online count.
- Recent approved announcements.

Do not make Discord availability a requirement for using the website.

---

# 34. How to Play

Provide simple instructions.

```text
1. Open Minecraft.
2. Select Multiplayer.
3. Add Server.
4. Enter play.example.com.
5. Join.
```

For Bedrock, display:

```text
Address
Port
```

only if Bedrock is actually supported.

---

# 35. Accessibility

Target:

**WCAG 2.2 AA**

Requirements:

- Keyboard navigation.
- Visible focus state.
- Semantic HTML.
- Proper heading hierarchy.
- 4.5:1 contrast for normal text.
- Clear errors.
- Labels attached to controls.
- Reduced-motion support.
- No information communicated by colour alone.
- 200% zoom usable.
- Screen-reader friendly.
- Touch targets around 44x44 px where practical.
- No autoplay audio.
- No essential auto-rotating carousel.
- Logical tab order.

Checkout accessibility is a launch blocker.

---

# 36. Mobile First

Primary testing widths should include:

```text
360px
390px
430px
768px
1024px
1440px
```

Mobile priorities:

- Copy IP.
- Server status.
- Store.
- Rank comparison.
- Checkout.
- Discord.
- Support.

Avoid:

- Full-screen autoplay video.
- Huge hero heights.
- Tiny rank matrices.
- Hover-dependent actions.

---

# 37. Performance Targets

Target:

```text
LCP        < 2.5s
CLS        < 0.1
INP        < 200ms target
```

Practices:

- Server render important content.
- Optimize images.
- Minimize client components.
- Lazy-load secondary sections.
- Cache server-status responses.
- Limit font families.
- Self-host fonts when appropriate.
- Do not ship admin code to public routes.
- Avoid large animation libraries unless necessary.

---

# 38. Design System

Define tokens before page development.

Example:

```text
background
surface
surfaceRaised
text
textMuted
brand
brandHover
success
warning
danger
border
focus
```

Spacing:

```text
4
8
12
16
24
32
48
64
96
```

Border radius:

```text
4
6
8
```

Do not default every element to large pill shapes.

---

# 39. Typography

Use:

- One clear UI/body typeface.
- Optional secondary display font.

Pixel fonts may be used for:

- Logo-adjacent text.
- Section labels.
- Decorative headings.

Do not use pixel fonts for:

- Product descriptions.
- Forms.
- Prices.
- Legal documents.
- Checkout.
- Accessibility-critical text.

---

# 40. Components

Build these before full page generation:

```text
Button
IconButton
Link
Input
Textarea
Select
Checkbox
Radio
Dialog
Drawer
Navigation
Container
Section
StatusIndicator
ServerAddress
RankCard
RankComparison
Price
Badge
Alert
Toast
Skeleton
EmptyState
ErrorState
Pagination
Table
Tabs
```

Every component requires:

- Default state.
- Hover state where applicable.
- Focus state.
- Disabled state.
- Error state where applicable.
- Loading state where applicable.
- Mobile behaviour.

---

# 41. Public API

Initial:

```http
GET  /api/v1/server/status
GET  /api/v1/server/players

GET  /api/v1/products
GET  /api/v1/products/:slug
GET  /api/v1/ranks
GET  /api/v1/ranks/compare
GET  /api/v1/announcements

POST /api/v1/minecraft/resolve
POST /api/v1/checkout

GET  /api/v1/orders/:publicId
GET  /api/v1/payments/:publicId/status
```

Payment:

```http
POST /api/v1/payments/toyyibpay/callback
```

Live public status:

```text
GET /api/v1/server/events
Content-Type: text/event-stream
```

Internal Minecraft integration is **not** exposed as a public website API.

NestJS directly contacts:

```text
MINECRAFT_REST_API_BASE_URL
```

from the server environment.

Rank fulfilment is triggered internally through the queue and RCON adapter.

There should be no browser-accessible endpoint that proxies arbitrary RestApi URLs or arbitrary RCON commands.

# 42. Authentication

Public browsing requires no account.

Initial rank purchase may use:

- Guest checkout, or
- Account checkout.

Recommended MVP:

**Guest checkout first.**

Required:

```text
Minecraft username
Email
Phone if ToyyibPay flow requires it
```

Later account features:

- Discord OAuth.
- Order history.
- Linked Minecraft profile.
- Saved purchase identity.

Do not create unnecessary signup friction before payment.

---

# 43. Security

Required:

- HTTPS.
- Secure cookies.
- HttpOnly cookies.
- SameSite policy.
- CSRF defence where applicable.
- Input validation.
- Output escaping.
- Rate limiting.
- Admin MFA.
- Role-based access.
- Audit logs.
- Webhook validation.
- Provider reconciliation.
- Database backups.
- Secret isolation.
- Environment separation.
- Dependency scanning.
- Container scanning.
- CSP.
- Security headers.
- Non-root containers.
- Principle of least privilege.

---

# 44. Secrets

Never commit:

```text
TOYYIBPAY_SECRET_KEY
DATABASE_URL
REDIS_URL
ADMIN_SESSION_SECRET
MINECRAFT_REST_API_BASE_URL        # if it reveals private infrastructure
MINECRAFT_RCON_HOST
MINECRAFT_RCON_PORT
MINECRAFT_RCON_PASSWORD
DISCORD_CLIENT_SECRET
```

Repository contains:

```text
.env.example
```

only.

A public browser must never receive:

- ToyyibPay secret key.
- RCON credentials.
- Private RestApi host/port.
- Database credentials.
- Redis credentials.

# 45. Infrastructure

Containerize web services.

Recommended Docker Compose services:

```text
web
api
worker
postgres
redis
reverse-proxy
```

Optional:

```text
monitoring
```

The production Minecraft server remains in a separate deployment unit.

The API/worker must have private connectivity to:

```text
Minecraft RestApi port
Minecraft RCON port
```

The public internet should not.

Use:

```text
Web Infrastructure
```

and:

```text
Game Infrastructure
```

as separate failure domains.

Example:

```text
Public Internet
     |
     v
Reverse Proxy
     |
     +---- Next.js
     |
     +---- NestJS
             |
        private network
         /          \
        v            v
   RestApi HTTP     RCON
        \            /
         \          /
          Minecraft
```

# 46. Reverse Proxy

Use:

- Caddy, or
- Nginx

Suggested public routing:

```text
example.com
        -> Next.js

api.example.com
        -> NestJS

api.example.com/server/events
        -> NestJS SSE

admin.example.com
        -> Next.js admin
```

A same-domain `/api` reverse proxy can also simplify browser security policy.

Do **not** publicly proxy:

```text
Minecraft RestApi port
Minecraft RCON port
```

If the Minecraft server is on another machine, connect it to the backend over a private network or VPN rather than exposing management/data ports to the open internet.

# 47. Monitoring

Track:

Web:

- Error rate.
- Core Web Vitals.
- Failed API calls.

API:

- Request rate.
- Latency.
- 5xx responses.
- Queue depth.

Payment:

- Created bills.
- Paid orders.
- Pending orders.
- Failed callbacks.
- Reconciliation mismatches.

Minecraft RestApi:

- Last successful poll.
- Poll latency.
- Consecutive failures.
- Response validation failures.
- Cached status age.
- Online-player count.

RCON fulfilment:

- Connection success rate.
- Command execution failures.
- Retry count.
- Queue age.
- Permanent fulfilment failures.

The public status page should distinguish:

```text
Minecraft offline
```

from:

```text
Minecraft data temporarily unavailable
```

where possible.

# 48. Backups

Back up PostgreSQL.

Minimum:

- Daily automated backup.
- Multiple retained versions.
- Backup stored away from primary host.
- Periodic restore test.

Redis should not be treated as the permanent source of truth.

---

# 49. Development Phases

---

## Phase 0 — Product and Compliance Definition

### Goal

Lock product scope before implementation.

### Tasks

- Confirm server name.
- Confirm domain.
- Confirm Java/Bedrock support.
- Confirm server address.
- Confirm branding direction.
- Confirm rank names.
- Confirm rank prices.
- Confirm rank duration.
- Confirm rank permissions.
- Confirm server monetization rules.
- Confirm ToyyibPay merchant account.
- Confirm payment channels enabled.
- Confirm refund policy.
- Confirm privacy requirements.
- Confirm Terms of Service.
- Define MVP.

### Deliverables

```text
PLANNING.md
PRODUCT.md
STORE.md
DESIGN.md
COMPLIANCE.md
```

### Exit Criteria

No unresolved ambiguity about the MVP store.

---

## Phase 1 — Repository and Infrastructure Foundation

### Goal

Create the development environment without implementing product features.

### Tasks

Create:

- pnpm workspace.
- Turborepo.
- Next.js app.
- NestJS app.
- PostgreSQL.
- Redis.
- Dockerfiles.
- Docker Compose.
- Environment management.
- Linting.
- Formatting.
- Type checking.
- Unit-test foundation.
- CI workflow.
- Health checks.

### Endpoints

```http
GET /health
GET /ready
```

### Verification

- One command starts local environment.
- Web can reach API.
- API can reach PostgreSQL.
- API can reach Redis.
- Tests run in CI.

---

## Phase 2 — Shared Contracts and Data Model

### Goal

Prevent frontend, backend and Minecraft integration from inventing incompatible data shapes.

### Tasks

Create:

```text
packages/contracts
```

Define:

- Product DTO.
- Rank DTO.
- ServerStatus DTO.
- OnlinePlayer DTO.
- RestApi normalization schemas.
- Public server-status SSE event.
- Checkout request.
- Order response.
- Payment states.
- Fulfilment states.

Implement database migrations.

### Verification

- Both frontend and backend import shared contracts.
- Invalid payload tests exist.
- Migrations create a clean database.

---

## Phase 3 — Design System

### Goal

Create the visual rules before AI or developers produce pages.

### Tasks

Define:

- Colours.
- Typography.
- Spacing.
- Borders.
- Focus states.
- Layout widths.
- Breakpoints.
- Motion.
- Icon style.

Implement base components.

### Verification

Create a component showcase route.

Test:

- Keyboard.
- Screen reader.
- Dark UI contrast.
- 200% zoom.
- Mobile controls.
- Reduced motion.

---

## Phase 4 — Landing Page

### Goal

Ship the public identity of the server.

### Build

- Navigation.
- Hero.
- Copy IP.
- Server status placeholder.
- Server description.
- Store preview.
- How to Play.
- Screenshots.
- Community.
- Announcements.
- Footer.
- Legal links.

### Do Not Build

- Payment.
- Player account.
- Leaderboards/economy analytics.
- Any RestApi field that has not yet been verified against the installed plugin.

### Verification

- Lighthouse/accessibility pass.
- Real-device mobile test.
- No generic placeholder copy.
- Real server imagery used.

---

## Phase 5 — RestApi Plugin Integration

### Goal

Connect NestJS to the selected RestApi plugin without writing a custom Minecraft website bridge plugin.

### Minecraft setup

- Install RestApi from Modrinth.
- Confirm the exact installed version.
- Confirm Paper compatibility.
- Configure its embedded HTTP port.
- Keep the port private.
- Restart the server.
- Verify the plugin is responding.

### Discovery work

Before coding the final adapter:

1. Enumerate the endpoints available in the installed version.
2. Capture successful responses.
3. Capture offline/error responses.
4. Record whether authentication exists in that version.
5. Record all configurable plugin settings.
6. Save sanitized JSON fixtures.

Create:

```text
docs/minecraft/restapi-integration.md
apps/api/test/fixtures/minecraft-restapi/
```

### Backend

Create:

```text
MinecraftRestApiModule
MinecraftRestApiClient
MinecraftRestApiHealthService
```

Configuration:

```env
MINECRAFT_REST_API_BASE_URL=
MINECRAFT_REST_API_TIMEOUT_MS=3000
MINECRAFT_REST_API_POLL_MS=10000
```

### Dependency lifecycle

RestApi is an external server dependency.

For each Minecraft/Paper upgrade:

1. Keep the currently working RestApi JAR available for rollback.
2. Test RestApi on staging first.
3. Run the saved response-contract tests.
4. Compare the live response with stored fixtures.
5. Confirm the plugin still starts cleanly.
6. Confirm the configured HTTP port remains private.
7. Only then upgrade production.

Pin/document the exact plugin version used in production.

### Verification

- API can reach RestApi.
- Browser cannot directly reach RestApi.
- Timeout is handled.
- Malformed response is handled.
- Minecraft restart is handled.
- Plugin restart is handled.
- Raw fixtures are covered by tests.

---

## Phase 6 — Normalized Live Server Status

### Goal

Expose stable website data derived from RestApi.

### Build

Create normalized contracts for:

```text
Server status
Player count
Online player list
```

Only include additional fields that are confirmed from the installed RestApi response.

Backend:

```http
GET /api/v1/server/status
GET /api/v1/server/players
```

Caching:

```text
RestApi
  ↓
NestJS poller
  ↓
Redis
  ↓
Public API
```

Optional live updates:

```text
GET /api/v1/server/events
```

using SSE.

### Verification

- Website works if RestApi is unavailable.
- Stale data is labelled.
- Last successful update is tracked.
- Browser requests do not multiply Minecraft-side polling.
- Private RestApi address is never serialized to the frontend.
- Player information is filtered to approved public fields.

## Phase 7 — Product and Rank Backend

### Goal

Create the store domain.

### Build

- Products.
- Ranks.
- Rank features.
- Pricing.
- Activation states.
- Admin CRUD.
- Public catalogue endpoints.

### Rule

Prices come from backend only.

### Verification

- Inactive products cannot be purchased.
- Product API never accepts a browser-supplied final price.

---

## Phase 8 — Store Frontend

### Goal

Create a simple purchase-oriented storefront.

### Build

```text
/store
/store/ranks
/store/ranks/[slug]
```

Include:

- Rank cards.
- Rank details.
- Rank comparison.
- Pricing.
- Checkout CTA.

### Verification

- Fully keyboard operable.
- Rank comparison usable on phones.
- No misleading sales indicators.

---

## Phase 9 — Minecraft Player Resolution

### Goal

Bind orders to a real Minecraft identity.

### Build

```http
POST /api/v1/minecraft/resolve
```

Return:

- Current username.
- UUID.
- Avatar metadata if used.

### Verification

- Invalid username handled.
- Player identity stored server-side.
- Client cannot provide arbitrary UUID.

---

## Phase 10 — Order System

### Goal

Create payment-independent orders.

### Build

- Order creation.
- Order items.
- Product snapshot.
- Totals.
- Currency.
- Public order ID.
- Pending-payment lifecycle.

### Verification

Test:

- Changed product price.
- Deleted/inactive product.
- Repeated checkout.
- Invalid product ID.
- Invalid username.

---

## Phase 11 — ToyyibPay Sandbox Integration

### Goal

Complete the first real payment flow.

### Setup

Use:

```text
dev.toyyibpay.com
```

### Build

`ToyyibPayModule`

Services:

```text
ToyyibPayClient
ToyyibPayBillService
ToyyibPayCallbackService
ToyyibPayReconciliationService
```

Implement:

- Create Bill.
- Bill response parser.
- Redirect URL.
- Return URL.
- Callback URL.
- Callback hash verification.
- Payment records.
- Get Bill Transactions reconciliation.

### Important

ToyyibPay Create Bill may return HTTP success while the response body represents an application error. Parse and validate the response body rather than trusting HTTP 200 alone.

### Verification

Test:

- Successful sandbox payment.
- Failed payment.
- Pending payment.
- Duplicate callback.
- Invalid hash.
- Wrong amount.
- Unknown order.
- ToyyibPay unavailable.

---

## Phase 12 — Payment UI

### Goal

Create a clear user experience around ToyyibPay.

### Pages

```text
/checkout
/payment/return
/order/[publicId]
```

### States

- Creating bill.
- Redirecting.
- Pending.
- Paid.
- Failed.
- Verification delayed.

### Important

The return page must query backend order status.

It must not trust URL parameters as proof of payment.

---

## Phase 13 — RCON Fulfilment Adapter

### Goal

Deliver paid ranks without modifying the RestApi plugin.

### Minecraft setup

Enable RCON in `server.properties`:

```properties
enable-rcon=true
rcon.port=25575
rcon.password=<strong-random-secret>
```

Then restrict network access so only the backend/worker can connect.

### Backend

Create:

```text
MinecraftFulfilmentModule
RconClient
RconFulfilmentProvider
LuckPermsCommandFactory
```

The command factory only accepts internal typed operations.

Example:

```typescript
grantRank({
  playerUuid,
  permissionGroup: 'elite',
  durationSeconds: 2592000,
});
```

No arbitrary command strings from HTTP requests.

### Queue

BullMQ job:

```text
minecraft.grant-rank
```

Process:

```text
Paid order
   ↓
Entitlement
   ↓
Queue
   ↓
RCON adapter
   ↓
LuckPerms
   ↓
Store result
```

### Verification

Test:

- Valid rank.
- Invalid rank/group mapping.
- Minecraft online.
- Minecraft offline.
- RCON refused.
- Wrong RCON password.
- Duplicate job.
- Worker restart.
- Already-delivered entitlement.

---

## Phase 14 — Fulfilment Recovery and Reconciliation

### Goal

Ensure a paid purchase is never lost.

### Build

- Retry policy.
- Exponential backoff.
- Dead-letter handling.
- Admin retry button.
- Fulfilment audit trail.
- Rank expiration/removal jobs if required.
- Payment-to-entitlement reconciliation.
- Alert for long-running paid-but-undelivered orders.

### Verification

Simulate Minecraft being offline during payment.

Expected:

```text
Payment = PAID
Entitlement = ACTIVE/PENDING_DELIVERY
Fulfilment = RETRYING
```

After RCON becomes reachable:

```text
Fulfilment = DELIVERED
```

Verify a duplicate queue job does not grant an unintended duplicate entitlement.

## Phase 15 — Admin Dashboard

### Goal

Give operators enough visibility to run the store.

### Build

- Dashboard.
- Products.
- Ranks.
- Orders.
- Payments.
- Fulfilments.
- Announcements.
- Players.
- Server status.
- Audit log.

### Access

Require:

- Authentication.
- Admin roles.
- MFA where possible.

---

## Phase 16 — Accessibility Audit

### Goal

Perform deliberate manual accessibility verification.

Test:

- Keyboard-only.
- Screen reader.
- Focus visibility.
- Contrast.
- 200% zoom.
- Mobile.
- Reduced motion.
- Checkout errors.
- Payment states.

Fix before launch.

---

## Phase 17 — Performance and Low-Bandwidth Optimization

### Goal

Make the website practical for regional mobile connections.

### Tasks

- AVIF/WebP.
- Responsive images.
- Font reduction.
- JS bundle inspection.
- Server rendering.
- Cache headers.
- Redis caching.
- Lazy loading.
- CDN.
- Compress API responses.

### Verification

Test using simulated slow mobile connections.

---

## Phase 18 — Security Hardening

### Goal

Attempt to break the system before production.

Test:

- Webhook spoofing.
- Price tampering.
- Replay callbacks.
- Duplicate fulfilment.
- Invalid Minecraft token.
- Rate-limit bypass.
- XSS.
- CSRF.
- SQL injection.
- SSRF.
- Admin authorization.
- Secret leakage.
- Broken object authorization.

Run dependency and container scans.

---

## Phase 19 — Production Deployment

### Goal

Launch infrastructure without launching store traffic yet.

Deploy:

```text
Next.js
NestJS
Worker
PostgreSQL
Redis
Reverse Proxy
```

Configure:

- Domain.
- TLS.
- CDN/WAF.
- Backups.
- Logs.
- Monitoring.
- Alerting.

Minecraft remains separately hosted.

---

## Phase 20 — ToyyibPay Production Cutover

### Goal

Move from sandbox to real payment processing.

Tasks:

- Add production key.
- Add production category code.
- Confirm callback URL.
- Confirm return URL.
- Confirm payment channels.
- Confirm DuitNow QR if enabled.
- Execute smallest possible real purchase test.
- Verify settlement.
- Verify callback.
- Verify rank grant.

Do not reuse sandbox credentials.

---

## Phase 21 — Soft Launch

### Goal

Expose the system to a limited real audience.

Recommended:

- Staff.
- Trusted players.
- Small Discord group.

Monitor:

- Checkout completion.
- Payment mismatch.
- Rank delivery.
- Mobile issues.
- API latency.
- Minecraft reconnects.
- Support requests.

Do not add features during the soft launch unless required for a blocker.

---

## Phase 22 — Public Launch

### Launch checklist

- Store prices verified.
- Rank benefits verified.
- Payments verified.
- Callback verified.
- Reconciliation verified.
- Fulfilment verified.
- Refund policy published.
- Terms published.
- Privacy notice published.
- Backups active.
- Monitoring active.
- Admin MFA active.
- Server status correct.
- Discord/support links correct.
- Mobile checkout verified.
- Accessibility blockers resolved.

---

# 50. Post-MVP Roadmap

Only begin these after the purchase system is stable.

## Phase A — Accounts

Add:

- Account login.
- Discord OAuth.
- Linked Minecraft profiles.
- Order history.
- Entitlement history.

---

## Phase B — Leaderboards

Examples:

- Balance.
- Playtime.
- Kills.
- Wins.
- Events.

Do not query the live Minecraft database directly from browser requests.

Publish sanitized aggregates through NestJS.

---

## Phase C — Economy Dashboard

Potential:

- Market activity.
- Price indexes.
- Richest players.
- Shop statistics.
- Item trends.

Build only if it improves the game rather than exposing exploitable market data.

---

## Phase D — Events

Add:

- Event schedule.
- Registration.
- Live event status.
- Results.
- Winners.

Minecraft plugin can publish event state.

---

## Phase E — Map

Integrate an existing Minecraft web-map solution rather than writing map rendering from scratch.

Link or embed appropriately.

---

## Phase F — Localization

Prepare for:

```text
English
Bahasa Melayu
Bahasa Indonesia
```

Do not translate commands unless the actual server commands are localized.

---

# 51. Initial MVP Scope

The first production version should contain:

```text
Landing Page
Copy Server IP
Live Player Count
Server Status
Online Player List if desired
How to Play
Real Server Screenshots
Discord Link

RestApi Integration
Server-side RestApi polling
Redis status cache
SSE live status updates

Rank Store
Rank Details
Rank Comparison

Minecraft Username Resolution
Guest Checkout

ToyyibPay
Payment Callback Verification
Order Status
Payment Reconciliation

Private RCON Fulfilment
LuckPerms Rank Grant
Fulfilment Retry
Paid-but-undelivered Monitoring

Announcements

Terms
Privacy
Refund Policy

Admin:
Products
Ranks
Orders
Payments
Fulfilment
Announcements
Server Status
RestApi Health
RCON/Fulfilment Health
```

Everything else is optional.

The MVP does **not** require a custom Minecraft website plugin.

# 52. Features Explicitly Deferred

Do not add to the first MVP:

- Complex social profiles.
- Custom forums.
- Friend system.
- Live chat.
- Huge player analytics dashboard.
- Custom map renderer.
- Native mobile app.
- Loot-box system.
- Referral program.
- Creator codes.
- Multiple payment providers.
- Custom wallet.
- Multiple currencies.
- AI chatbot.
- Advanced CMS.
- Clan system.

This keeps the first version realistic.

---

# 53. Recommended Development Order

The practical implementation sequence is:

```text
0   Specification
1   Repo + Containers
2   Shared Contracts
3   Design System
4   Landing Page
5   RestApi Plugin Integration
6   Normalized Live Server Status
7   Rank Backend
8   Store UI
9   Player Resolution
10  Orders
11  ToyyibPay Sandbox
12  Checkout UI
13  RCON + LuckPerms Fulfilment
14  Fulfilment Recovery
15  Admin
16  Accessibility
17  Performance
18  Security
19  Production Infrastructure
20  ToyyibPay Production
21  Soft Launch
22  Public Launch
```

Do not skip the RestApi discovery/fixture step.

The actual installed plugin response must be captured before the frontend status contract is finalized.

# 54. Architecture Summary

```text
                            INTERNET
                               |
                         CDN / WAF / TLS
                               |
                  +------------+------------+
                  |                         |
                  v                         v
             Next.js Web               NestJS API
                  |                         |
                  | REST / SSE              |
                  +------------+------------+
                               |
                   +-----------+-----------+
                   |                       |
                   v                       v
              PostgreSQL                Redis
                                        BullMQ
                                          |
                                +---------+---------+
                                |                   |
                                | read              | fulfil
                                v                   v
                         RestApi Client          RCON Client
                                |                   |
                                | private           | private
                                v                   v
                         +-----------------------------+
                         |       Paper Server          |
                         |                             |
                         | RestApi Plugin   LuckPerms  |
                         +-----------------------------+


                            PAYMENT

Player
  |
  v
Next.js
  |
  v
NestJS
  |
  v
ToyyibPay
  |
  | callback
  v
NestJS
  |
  v
PostgreSQL
  |
  v
BullMQ
  |
  v
RCON
  |
  v
LuckPerms
```

The Minecraft integration is deliberately split into:

```text
READ
RestApi plugin

WRITE / FULFILMENT
Private RCON + LuckPerms
```

This prevents a server-information plugin from being forced into responsibilities it does not document.

# 55. Final Technical Recommendation

Use:

```text
Frontend
Next.js
React
TypeScript

Backend
NestJS
TypeScript

Public live updates
REST + Server-Sent Events

Database
PostgreSQL

Cache / Queue
Redis
BullMQ

Minecraft read integration
RestApi
https://modrinth.com/plugin/restapi

Minecraft fulfilment
Private Minecraft RCON
LuckPerms

Payment
ToyyibPay

Infrastructure
Docker
Docker Compose
Caddy or Nginx
CDN / WAF

Monorepo
pnpm
Turborepo
```

The most important architectural boundary is:

> **Next.js renders the product. NestJS owns application logic. RestApi supplies read-only Minecraft server data. Private RCON performs tightly controlled fulfilment. ToyyibPay owns payment processing.**

This means the team does not need to maintain a custom Paper plugin for the MVP.

It also prevents:

- Payment credentials entering Minecraft.
- RCON entering the browser.
- The RestApi port being public.
- Frontend components depending on raw plugin response formats.
- A change in Minecraft integration from forcing a storefront rewrite.

# 56. Definition of Done

The MVP is complete only when both the read flow and purchase flow are reliable.

## Read flow

```text
RestApi plugin runs on Paper
        ↓
NestJS polls RestApi
        ↓
Response passes validation
        ↓
NestJS normalizes response
        ↓
Redis cache updates
        ↓
Next.js reads public API
        ↓
Player sees server status/player count
```

The website must remain functional when RestApi is temporarily unavailable.

## Purchase flow

```text
Player opens website
        ↓
Selects rank
        ↓
Enters Minecraft username
        ↓
Backend resolves player
        ↓
Backend creates immutable order
        ↓
ToyyibPay bill created
        ↓
Player pays
        ↓
NestJS receives valid callback
        ↓
Transaction is validated
        ↓
Order becomes PAID
        ↓
Entitlement is created
        ↓
Fulfilment job is queued
        ↓
Worker connects through private RCON
        ↓
Approved LuckPerms command runs
        ↓
Fulfilment result is persisted
        ↓
Website displays completed order
```

The flow must remain recoverable when:

- RestApi is unavailable.
- RestApi returns an unexpected schema.
- ToyyibPay is temporarily unavailable.
- Callback is duplicated.
- Browser closes after payment.
- Minecraft server is offline.
- RCON is unavailable.
- Queue worker restarts.
- User changes Minecraft username.
- A fulfilment job fails.

A payment is not considered operationally complete until its entitlement and fulfilment state are traceable.

# 57. Design Rule to Keep Permanently

> **Every visual element must improve navigation, comprehension, trust, accessibility, branding, or conversion. If it does none of these, remove it.**

And:

> **Use real server content before decorative generated content. The website should look like our Minecraft server, not like a website generator's idea of a Minecraft server.**

---

# 58. RestApi Integration Notes

Selected dependency:

`https://modrinth.com/plugin/restapi`

Publicly documented capability at planning time:

- Real-time server information.
- Online player list.
- Embedded HTTP server.
- Configurable port.
- Paper/Purpur/Spigot compatibility.
- Minecraft versions listed from 1.16.x through 1.21.x.

The public project page does not document a general-purpose console-command or LuckPerms-write API.

Therefore this plan deliberately uses:

```text
RestApi = READ PATH
RCON    = WRITE / FULFILMENT PATH
```

Before Phase 6 is considered complete, the team must document the **actual response schema from the exact installed version** rather than relying on assumptions made in this planning document.

For production:

- Keep RestApi reachable only by the backend.
- Keep RCON reachable only by the fulfilment worker/backend.
- Never expose either service directly to browser clients.
