# AGENTS.md — jblind-front

> Reference guide for AI agents and developers.
> **Goal:** ensure that any change to the project faithfully follows the already-established business, architecture, code, and styling patterns.
> Read this file **before** generating or changing any code.

> ⚠️ **Keep this document up to date.** This file is the source of truth for the project's conventions. Whenever you add a new feature, change the architecture, or invalidate any statement made here, you **must** update the affected sections of `AGENTS.md` in the same change. Outdated documentation is treated as a bug.

> This is the **frontend** of the `jblind` poker tracker. The backend (Java + Spring Boot) lives in the sibling project `jblind` and has its own `AGENTS.md` describing the REST contract this SPA consumes.
> **Note:** Before implementing significant changes, it is recommended to verify the current state of the backend code (`jblind` project) to ensure alignment with the latest API contracts and business logic.

---

## 1. Overview

`jblind-front` is the **Single Page Application (SPA)** for the `jblind` poker tracker.
It lets a tournament director / cash-game host create, edit, run, and track two kinds of "games" and their live sessions.

- **Frontend:** React 19 SPA served by Vite at `http://localhost:5173`.
- **Backend:** consumes the versioned REST API (`/v1`) exposed by `jblind` at `http://localhost:8080` (see `src/lib/axios.ts`).

### Stack

| Item | Version / Tool |
|------|----------------|
| Language | **TypeScript** (`~6.0`) |
| UI library | **React 19** (`react` / `react-dom`) |
| Build / dev server | **Vite 8** (`@vitejs/plugin-react`) |
| Routing | **react-router-dom 7** |
| HTTP client | **axios** (single shared instance in `src/lib/axios.ts`) |
| i18n | **i18next** + **react-i18next** (single typed resource file) |
| Styling | **Tailwind CSS 4** (`@tailwindcss/vite`), utility classes inline |
| Icons | **lucide-react** |
| Class helpers | `clsx`, `tailwind-merge` |
| Linting | **ESLint 10** (flat config) + `typescript-eslint` + react-hooks / react-refresh |
| Formatting | **Prettier** (`.prettierrc`: `singleQuote`, `printWidth: 120`, `tabWidth: 2`) |
| Tests | **None configured yet** (no test runner installed — see section 10) |

---

## 2. Business Domain

The app mirrors the backend's **two independent aggregates**. They are modeled as **separate feature modules** that do not import each other. For the authoritative business rules, defer to the backend `AGENTS.md`; this section describes how the domain surfaces in the UI.

### 2.1 CashGame (`src/features/cashgame`)

A **live cash game**: chips equal real money, players come and go freely and can rebuy/add-on at any time.

- A cash game has blinds (`smallBlind`, `bigBlind`), entry limits (`minBuyIn`, `maxBuyIn`), a `scheduledAt`, and a list of players.
- A **live session** (`CashGameActiveView` + `useCashGameSession`) tracks each player's `totalInvested`, `currentStack`, `profit`, and whether they are still active.
- Player actions: **buy-in / rebuy / add-on / cash-out / update stack**, each posting a log to the backend.
- The active session is **rebuilt from the backend** on load (players + logs come from `GET /v1/cashgames/{id}`), so it survives a refresh without local persistence.

### 2.2 Tournament (`src/features/tournament` + `src/features/timer`)

A **tournament**: a fixed structure of blind levels that increase over time, with prizes by finishing position.

- A tournament has `buyIn`, `startingStack`, `expectedPlayers`, `allowRebuys` / `allowAddOn` flags, an ordered list of `levels` (blinds/breaks), a list of `players`, and a `prize` (mode + payouts).
- Creation/editing is a **multi-step wizard** (`TournamentGeneralSettingsStep` → `TournamentLevelStructureManagerStep` → `TournamentPlayersStep` → `TournamentPrizesStep`).
- The **live clock** lives in the `timer` feature (`TimerView` + `useTournamentSession`): it counts down levels, shows blinds/prize pool/stats, and offers per-player **Eliminate / Rebuy / Add-On** actions that post logs.
- The active session (players, chips, rebuys) is **rebuilt from logs** on load via `tournamentApi.getDetails` (which returns the full tournament object including its logs), so it survives a refresh. The live clock state remains front-only.

### 2.3 Log types (shared contract with the backend)

Enums mirror the backend exactly and are declared as `const object` + `type` (see section 4):

- `CashGameLogType`: `BUY_IN`, `REBUY`, `ADD_ON`, `CASHOUT`, `INFO`.
- `TournamentLogType`: `BUY_IN`, `REBUY`, `ADD_ON`, `ELIMINATION`, `LEFT`.

---

## 3. Architecture

### 3.1 Organization by domain (feature-based)

Code is organized **by business feature**, not by technical type. Each feature is self-contained under `src/features/<feature>` with a fixed internal layout:

```
src/features/<feature>/
├── views/         <- page-level components (mounted by the router)
├── components/    <- presentational / smaller components for this feature
├── hooks/         <- feature-specific React hooks (stateful logic)
├── services/      <- API access objects (axios calls to /v1/...)
├── types/         <- TypeScript interfaces + enums (<feature>.types.ts)
└── utils/         <- pure helpers, form↔payload mappers (<feature>FormMapper.ts)
```

Real layout:

```
src/
├── main.tsx / App.tsx            <- bootstrap + route table
├── layouts/MainLayout.tsx        <- shell (Sidebar + <main>)
├── components/ui/                <- SHARED, cross-feature UI (Modal, Sidebar, ...)
├── hooks/                        <- SHARED hooks (usePreventUnload, useWakeLock)
├── lib/                          <- cross-cutting infra: axios.ts, i18n.ts
├── utils/                        <- cross-cutting pure helpers (DateUtils)
├── @types/                       <- ambient TS declarations (i18next.d.ts)
└── features/
    ├── home/                     <- landing view
    ├── cashgame/                 <- CashGame feature (full internal layout)
    ├── tournament/               <- Tournament CRUD + wizard
    └── timer/                    <- live tournament clock
```

### 3.2 Dependency rules (critical)

- **Features do not import each other.** `cashgame` never imports from `tournament` and vice versa. Shared code goes to `src/components/ui`, `src/hooks`, `src/lib`, or `src/utils`.
- **`lib/` and shared `components/ui` depend on no feature**; features may depend on them.
- **Views** are the only components mounted by the router (`App.tsx`). Components under `components/` are presentational and receive data/callbacks via props.
- **Services are the single doorway to the backend.** UI/hooks call a service object; they never build axios instances themselves.

### 3.3 Data-flow layers

| Layer | What it is | Conventions |
|-------|------------|-------------|
| **View** | Page component mounted by a route. Owns page state or delegates it to a hook. | Named `export function XxxView()`, in `features/<f>/views`. Uses `useTranslation`, `useNavigate`, `useParams`. |
| **Component** | Presentational, reusable piece of a feature. | Named `export function Xxx({...}: XxxProps)`. Receives typed props (`interface XxxProps`), emits events via `onXxx` callbacks. No direct API calls. |
| **Hook** | Encapsulates stateful/session logic (state + effects + service calls + i18n). | Named `useXxx`, returns an object of state + handlers (see `useCashGameSession`). |
| **Service** | Thin object grouping API calls for a feature. | `export const xxxApi = { method: async (...) => { const { data } = await api.<verb>('/v1/...'); return data; } }`. |
| **Types** | Interfaces + enums for the feature. | File `<feature>.types.ts`. Enums as `const object` + `type` alias (section 4). |
| **Mapper (utils)** | Pure functions converting form state ↔ API payload. | File `<feature>FormMapper.ts`: `buildXxxPayload(...)`, `mapXxxToFormState(...)`, plus `EMPTY_*` constants. |

---

## 4. TypeScript & Type Patterns

- **Domain types** live in `features/<feature>/types/<feature>.types.ts` as `interface`s.
- **Enums are NOT `enum`** — they are declared as a frozen `const object` plus a `type` alias derived from it (matches the backend enum values as strings):

```ts
export const TournamentLogType = {
  BUY_IN: 'BUY_IN',
  REBUY: 'REBUY',
  ADD_ON: 'ADD_ON',
  ELIMINATION: 'ELIMINATION',
  LEFT: 'LEFT',
} as const;

export type TournamentLogType = (typeof TournamentLogType)[keyof typeof TournamentLogType];
```

- **Props** are declared as a local `interface XxxProps` next to the component; mark fields `readonly` when the component only reads them.
- Prefer **`import type { ... }`** for type-only imports (`verbatimModuleSyntax` is on — mixing value/type imports will fail the build).
- `noUnusedLocals` / `noUnusedParameters` are enforced: do not leave unused imports/vars.
- Avoid `any`. ESLint flags `@typescript-eslint/no-explicit-any` as an error (there is one legacy `any` in `TimerView.tsx` — do not add more).

---

## 5. API Access

- **One shared axios instance** in `src/lib/axios.ts` (`baseURL: http://localhost:8080/`, `timeout: 10000`). Import it as `api`.
- **Group calls in a per-feature service object** (`cashGameApi`, `tournamentApi`) under `features/<f>/services`. Each method is `async`, awaits `api.<verb>(...)`, and returns `data`.

```ts
import { api } from '../../../lib/axios';

export const tournamentApi = {
  persistLog: async (tournamentId: string, playerId: string | null, type: TournamentLogType, amount: number, message: string) => {
    const { data } = await api.post(`/v1/tournaments/${tournamentId}/logs`, {
      tournamentPlayerId: playerId, type, amount, message,
    });
    return data;
  },
};
```

- **Endpoints** follow the backend contract: `/v1/<resource-in-plural>` with nested sub-resources (`/v1/cashgames/{id}/logs`, `/v1/cashgames/{id}/players`, `/v1/tournaments/{id}/logs`). Creation is `POST /new`, update `PUT /{id}`, delete `DELETE /{id}`.
- **Preferred pattern = service + axios.** ⚠️ Today most CRUD flows still use raw `fetch('http://localhost:8080/...')` directly in views/components (`CashGameTable`, `TournamentTable`, `New*View`, `Edit*View`, `TimerView`, `*ActionsMenu`), and only the newer log/player calls go through the axios services (`cashGameApi`, `tournamentApi`). Raw `fetch` is **legacy** — do not add new raw `fetch` calls; use the shared `api` instance via a feature service, and migrate existing `fetch` flows to services when you touch them.
- **Error handling** in hooks/handlers: `try/catch`, `console.error(...)`, and surface a translated message to the user (`alert(t('...errors.xxx'))`). Update local state **only after** the request succeeds.

---

## 6. State & Data Flow

- **Local state** with `useState`; side effects (data loading, timers) with `useEffect`; memoized loaders with `useCallback`.
- **Session logic goes into a hook**, not the view. `useCashGameSession` and `useTournamentSession` are the references: they load details, map backend players/logs into view models, and expose action handlers.
- **Rebuild state from the backend** on load whenever possible (both cash game and tournament). Logs are replayed to reconstruct the current session state.
- The `react-hooks` ESLint plugin is enabled; respect the rules of hooks and effect dependency arrays (there are two pre-existing `exhaustive-deps` warnings in `TimerView.tsx` — do not add more).

---

## 7. Internationalization (i18n)

- **All user-facing text is translated.** Never hardcode display strings in components — add a key to `src/lib/i18n.ts` and use `const { t } = useTranslation();` then `t('feature.key')`.
- `src/lib/i18n.ts` holds a single `resources` object with **`pt` and `en`** blocks, nested **by feature** (`default`, `sidebar`, `home`, `tournament`, `cashgame`, `timer`, ...). `fallbackLng: 'en'`.
- Keep the **`pt` and `en` trees structurally identical** — every key must exist in both languages.
- **Keys are strongly typed** via `src/@types/i18next.d.ts` (it feeds the `en` tree to `i18next`'s `CustomTypeOptions`), so `t()` autocompletes keys and rejects unknown ones. Adding a key in one language only will break typing/consistency.
- Interpolation uses `{{name}}`-style placeholders: `t('timer.logs.rebuy', { name: player.name })`.

---

## 8. Styling & UI

- **Tailwind CSS 4** utility classes written **inline** in `className`. Follow the existing dark theme (`bg-[#0f0f0f]` / `#0a0a0a`, `text-white`, `border-white/10`, rounded `rounded-lg`/`rounded-2xl`, `shadow`).
- Use **`clsx` / `tailwind-merge`** when composing conditional class sets (available as deps).
- **Icons** come from **`lucide-react`** only (e.g., `ArrowLeft`, `Save`, `Coins`, `RotateCcw`, `Trophy`). Import the specific icon and pass `size`. Do not add other icon libraries.
- **Action buttons** follow a color-coded convention (see `CashGamePlayerRow`): a tinted background + hover-fill, an icon, and an i18n `title` tooltip (e.g. blue = buy-in/rebuy, purple = add-on, red = eliminate/cashout).
- **Modals** use the shared `src/components/ui/Modal.tsx` wrapper (`isOpen`, `title`, `maxWidth`, `children`). ⚠️ It currently does **not** expose an `onClose` prop; several delete/action modals pass `onClose` and this is a known pre-existing type error breaking `npm run build`. If you touch modals, either extend `Modal` to accept `onClose` (and fix all call sites) or stop passing it.

---

## 9. Routing & Navigation

- Routes are declared centrally in `src/App.tsx` inside `<Routes>`, wrapped by `MainLayout` (sidebar + content). Route params use `:tournamentId` / `:cashGameId`, read via `useParams`.
- Programmatic navigation via `useNavigate()`.
- When you add a page: create a `XxxView` under `features/<f>/views`, register its `<Route>` in `App.tsx`, and (if it is a top-level destination) add a `SidebarLink` in `src/components/ui/sidebar/Sidebar.tsx` with a `lucide-react` icon and an i18n `title`.

---

## 10. Code Style & Tooling

- **Naming:** components/views are `PascalCase` and use **named exports** (`export function XxxView()`); hooks are `useXxx`; service objects are `xxxApi`; types files are `<feature>.types.ts`; mappers are `<feature>FormMapper.ts`.
- **Files:** `.tsx` for components, `.ts` for logic/types. One primary component/view per file, file named after it.
- **Formatting (Prettier):** single quotes, `printWidth: 120`, `tabWidth: 2` (spaces). Match the surrounding file.
- **ESLint (flat config, `eslint.config.js`):** `@eslint/js` + `typescript-eslint` recommended + `react-hooks` + `react-refresh`. `dist` is ignored. Run `npm run lint`; do not introduce new errors/warnings.
- **TypeScript:** bundler mode (`moduleResolution: bundler`, `noEmit`, `verbatimModuleSyntax`, `allowImportingTsExtensions`), `noUnusedLocals`/`noUnusedParameters`, `noFallthroughCasesInSwitch`. Some imports use explicit `.tsx` extensions — this is intentional under bundler mode.
- **Tests:** there is **no test runner configured** (no Vitest/Jest/RTL in `package.json`). Do **not** invent a testing setup or import assertion libraries that are not installed. If tests are ever requested, propose adding the tooling first. Until then, verification is done via type-check/lint/build (section 11) plus manual flows against a running backend.

---

## 11. Build, Lint & Run

```powershell
# Install deps
npm install

# Start dev server (http://localhost:5173) — requires the jblind backend on :8080
npm run dev

# Type-check + production build
npm run build      # runs `tsc -b && vite build`

# Lint
npm run lint

# Preview a production build
npm run preview
```

- **Prerequisite:** the `jblind` backend must be running on `http://localhost:8080` (with its PostgreSQL) for data-driven screens to work.
- **Known pre-existing build failure:** `npm run build` currently fails type-checking because `Modal` does not accept `onClose` while some modals pass it (section 8). This predates unrelated changes — when verifying a change, a clean type-check of the files you touched (`npx tsc --noEmit`) plus `npx eslint <files>` is the practical gate until the `Modal` issue is fixed.

---

## 12. Checklist for the Agent (before finishing)

1. Did I keep the code **feature-based**? No cross-imports between `cashgame` and `tournament`; shared code under `components/ui`, `hooks`, `lib`, `utils`?
2. Did I use the correct layer (View vs Component vs Hook vs Service) and keep **components presentational** (data/events via props)?
3. Did API calls go through a **feature service using the shared `api`** instance (no new raw `fetch`, no new axios instances)?
4. Are **enums** declared as `const object` + `type`, and did type-only imports use `import type`?
5. Is **every user-facing string** in `i18n.ts` for **both `pt` and `en`**, with matching key trees and typed keys?
6. Does the UI follow the **Tailwind dark theme**, use **lucide-react** icons, and reuse the shared `Modal`/`Sidebar`?
7. Did I add new routes to `App.tsx` (and `Sidebar` if top-level)?
8. Does **`npm run lint`** stay clean (no new `any`, unused vars, or hook-deps warnings) and do the files I touched **type-check** (`npx tsc --noEmit`)?
9. **Did I keep `AGENTS.md` in sync?** If the change adds a feature or contradicts anything here (e.g., fixing the `Modal` `onClose` issue, migrating a `fetch` to a service), update the relevant sections in the same change.
