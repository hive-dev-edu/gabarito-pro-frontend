# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite)
npm run build     # type-check + production build
npm run lint      # ESLint
npm run preview   # preview production build locally
```

No test suite configured.

## Environment Variables

Copy `.env.example` to `.env`:

```
VITE_API_URL=http://localhost:3000        # backend base URL
VITE_GOOGLE_CLIENT_ID=<google_client_id> # Google OAuth client ID
```

## Architecture

React 18 + TypeScript + Vite. Styling via Tailwind CSS v4 (configured as a Vite plugin, no `tailwind.config.js`). Routing via React Router v7.

### Module Structure

Each domain lives under `src/pages/<Domain>/` with a consistent layout:

```
src/pages/<Domain>/
  <Domain>.tsx           # page component(s)
  components/            # domain-local components
  hooks/                 # domain-local hooks
  services/              # API calls using httpClient
  types/                 # TypeScript interfaces/types
  utils/                 # pure helpers
```

Shared code in `src/shared/`: `components/`, `services/`, `types/`, `constants/`.

### Auth Flow

- JWT stored in `localStorage` as `accessToken`.
- `src/utils/auth.ts` — `estaAutenticado()` decodes and checks token expiry client-side; `logout()` removes token.
- `src/utils/httpClient.ts` — Axios instance that auto-attaches `Authorization: Bearer <token>` header and redirects to `/login` on 401.
- `src/shared/components/RotaProtegida.tsx` — redirects unauthenticated users to `/login`.
- `src/shared/components/LayoutProtegido.tsx` — wraps all protected routes with `RotaProtegida` + `Header`.

### Route Layout

Public routes: `/`, `/login`, `/cadastrar`, `/verify`, `/esqueceu-senha`, `/reset-password`.

All other routes are nested under `<LayoutProtegido>` (authenticated + shared header).

### API Service Pattern

Services are class instances exported as singletons:

```ts
class FooService {
  async getAll() { return httpClient.get('/foo') }
}
export default new FooService();
```

API responses often have inconsistent shape from the backend — services normalize them before returning (see `avaliacoes.service.ts` for an example of defensive normalization).

### Domain Overview

| Domain | Description |
|---|---|
| `Questoes` | Question bank — CRUD for multiple-choice, true/false, essay questions |
| `Avaliacoes` | Assessments — create from question bank, manage drafts/published versions |
| `Correcoes` | Grading — image upload for OMR correction, correction detail view |
| `Turmas` | Classes — manage student groups |
| `Dashboard` | Stats overview |
| `Perfil` | User profile |

### Question Rules (from `docs/questions.md`)

- `multiple_choice`: exactly 5 alternatives, exactly 1 correct.
- `true_false`: exactly 2 alternatives, exactly 1 correct.
- `essay`: no alternatives.
- Alternatives update is replace-all — send the complete array when updating any alternative.

### Education Level / Grade Encoding

`src/shared/constants/education.ts` maps UI display values to API values. The API uses `ensino_fundamental` / `ensino_medio` etc. (snake_case); UI uses `"Ensino Fundamental"` / `"Ensino Médio"`. Use `buildGradeLevel` / `parseGradeLevel` helpers when converting.
