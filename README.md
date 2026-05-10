# Next.js template

This is a Next.js template with shadcn/ui.

## Auth smoke test

Use the quick checklist in `docs/auth-smoke-checklist.md` to verify login,
error handling, token persistence, session persistence across reload, and
dashboard redirect behavior.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

# Next.js template

This is a Next.js template with shadcn/ui.

## Auth smoke test

Use the quick checklist in `docs/auth-smoke-checklist.md` to verify login,
error handling, token persistence, session persistence across reload, and
dashboard redirect behavior.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
# Taskly — Team Project Management

A full-stack project management platform built with Next.js App Router and Supabase. Teams organize work in a three-level hierarchy: **Projects → Epics → Tasks**, with a drag-and-drop board, email invitations, and both desktop pagination and mobile infinite scroll.

---

## Live Demo

https://taskly-management-app.vercel.app

---

## Features

### Authentication
- Email/password signup and login via Supabase Auth
- Forgot password and reset flow
- Middleware-enforced session protection on all private routes
- Route-level auth checks in layouts and server actions

### Projects
- Create, edit, and list projects
- Project dashboard with summary stats
- Paginated project list (desktop) with infinite scroll (mobile)
- Active project context persisted across navigation

### Epics
- Create and manage epics scoped to a project
- Assign members and set deadlines
- Searchable, paginated epic list
- Epic details popup with nested task summary

### Tasks
- Create tasks scoped to an epic or directly to a project
- Assign members and set due dates
- Full 8-stage status workflow:
  `TO_DO → IN_PROGRESS → BLOCKED → IN_REVIEW → READY_FOR_QA → REOPENED → READY_FOR_PRODUCTION → DONE`
- **Board view** — columns per status with drag-and-drop (optimistic UI + rollback on failure)
- **List view** — tabular task list with pagination
- Task detail popup for inline editing
- Search by title or task ID, filter by status

### Team Collaboration
- Invite members to a project via email
- Token-based invitation with auto-join on acceptance
- Project members page with role management

### UX
- Functional breadcrumb navigation in the app header
- Responsive layout: sidebar + navbar shell
- Desktop page-based pagination + mobile infinite scroll (shared hook)
- Toast notifications for mutations

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 19, shadcn/ui, Radix UI primitives, Tailwind CSS v4 |
| Forms & Validation | react-hook-form + Zod (client + server double validation) |
| Backend / Auth / DB | Supabase (Postgres, Auth, Realtime, Edge Functions) |
| Global State | Redux Toolkit (session/user slice only) |
| Drag & Drop | @dnd-kit |
| Email (Invites) | Supabase Edge Function + SMTP |
| Linting / Formatting | ESLint 9, Prettier |

---

## Architecture Highlights

- **Feature-sliced structure** — each domain (`auth`, `projects`, `epics`, `tasks`) owns its `actions.ts`, `queries.ts`, `schemas/`, `components/`, and `types.ts`
- **Server-first data fetching** — server components fetch initial data and pass serialized props into client components for interactivity
- **Strict query/mutation split** — `queries.ts` is read-only; `actions.ts` handles validation, permission checks, writes, and cache invalidation
- **Supabase client factory** — server and browser clients centralized in `src/lib/supabase/` instead of created ad hoc
- **Multi-layer auth enforcement** — middleware → layout → individual server action
- **Normalized API envelope** — all list endpoints return `{ data, error, pagination }` consumed by a shared `useMobilePaginationFetch` hook
- **Optimistic UI on the board** — drag-and-drop updates fire immediately; server failure triggers rollback and a toast
