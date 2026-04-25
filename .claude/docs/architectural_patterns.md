# Architectural Patterns

This document captures repeated, cross-file architectural patterns in this codebase.

## 1) Feature-Sliced Domain Organization
**Pattern:** Each core domain (`auth`, `projects`, `epics`, `tasks`) follows a similar folder shape with `actions.ts`, `queries.ts`, `schemas/`, `components/`, and domain `types.ts`.

**Evidence**
- `src/features/projects/actions.ts:1-80`, `src/features/projects/queries.ts:1-184`, `src/features/projects/schemas/validations.ts:1-17`
- `src/features/epics/actions.ts:1-262`, `src/features/epics/queries.ts:1-119`, `src/features/epics/schemas/validations.ts:18-86`
- `src/features/tasks/actions.ts:1-235`, `src/features/tasks/queries.ts:1-346`, `src/features/tasks/schemas/validations.ts:9-35`
- `src/features/auth/services/auth-service.ts:67-179`, `src/features/auth/schemas/validations.ts:5-71`

## 2) Server-First Data Access + Client Forms
**Pattern:** Pages and server modules fetch initial data on the server, then pass serialized props into client components for interactivity.

**Evidence**
- Server pages fetch and pass initial payloads: `src/app/(main)/project/page.tsx:20-33`, `src/app/(main)/project/[projectId]/epics/page.tsx:34-69`, `src/app/(main)/project/[projectId]/tasks/page.tsx:39-77`
- Client pages consume initial props and handle interaction/state: `src/features/projects/components/listing/project-list-page.tsx:25-50`, `src/features/epics/components/listing/epics-list-page.tsx:34-61`, `src/features/tasks/components/list/tasks-list-page.tsx:27-57`

## 3) Explicit Query/Mutation Split
**Pattern:**
- `queries.ts` contains read-only data access and mapping logic.
- `actions.ts` contains mutating flows with validation, permission checks, writes, and cache invalidation.

**Evidence**
- Reads: `src/features/projects/queries.ts:111-183`, `src/features/epics/queries.ts:29-119`, `src/features/tasks/queries.ts:291-345`
- Writes: `src/features/projects/actions.ts:13-79`, `src/features/epics/actions.ts:33-261`, `src/features/tasks/actions.ts:38-234`
- Cache invalidation after writes: `src/features/projects/actions.ts:35-36`, `src/features/epics/actions.ts:133-135`, `src/features/tasks/actions.ts:147-150`

## 4) Supabase Access Encapsulated in Factory Helpers
**Pattern:** Supabase clients are centralized in shared factories for server/browser contexts rather than created ad hoc.

**Evidence**
- Server client factory: `src/lib/supabase/server.ts:4-23`
- Browser client factory: `src/lib/supabase/client.ts:3-8`
- Consumed across queries/actions/services: `src/features/projects/queries.ts:59`, `src/features/tasks/actions.ts:54-55`, `src/features/auth/services/auth-service.ts:50-51`

## 5) Route-Level Auth Enforcement in Multiple Layers
**Pattern:** Auth is enforced at middleware and per-layout/per-action layers.

**Evidence**
- Middleware redirects unauthenticated users from protected routes: `src/middleware.ts:48-50`
- Main layout requires authenticated user before rendering shell: `src/app/(main)/layout.tsx:14-27`
- Actions verify user and membership before writes: `src/features/tasks/actions.ts:53-75`, `src/features/epics/actions.ts:48-78`

## 6) Zod at Form Boundaries + React Hook Form in UI
**Pattern:** Client form components use `react-hook-form` with `zodResolver`; server actions re-validate with schema `safeParse` before DB writes.

**Evidence**
- Client resolvers: `src/features/projects/components/project-form.tsx:52-60`, `src/features/epics/components/form/epic-form.tsx:59-69`, `src/features/tasks/components/task-form.tsx:73-85`
- Server safe-parse: `src/features/projects/actions.ts:16-19`, `src/features/epics/actions.ts:43-46`, `src/features/tasks/actions.ts:48-51`

## 7) Normalized API Response Envelope for Pagination Endpoints
**Pattern:** API routes return a consistent envelope with `data`, `error`, and `pagination` for list endpoints, enabling shared client pagination hooks.

**Evidence**
- API routes: `src/app/api/projects/route.ts:8-9`, `src/app/api/projects/[projectId]/epics/route.ts:12-13`, `src/app/api/projects/[projectId]/tasks/route.ts:12-13`
- Shared hook expectation: `src/hooks/use-mobile-pagination-fetch.ts:24-28`, `src/hooks/use-mobile-pagination-fetch.ts:79-88`
- Shared pagination model: `src/lib/pagination.ts:5-11`

## 8) Shared Mobile/Desktop Pagination Behavior
**Pattern:** Pages support desktop page navigation and mobile infinite scroll using common pagination primitives.

**Evidence**
- Shared hook for mobile fetch/append: `src/hooks/use-mobile-pagination-fetch.ts:30-121`
- Shared controls and sentinel: `src/components/shared/pagination/compact-pagination.tsx:20-124`, `src/components/shared/pagination/scroll-sentinel.tsx:1-58`
- Applied in multiple feature pages: `src/features/projects/components/listing/project-list-page.tsx:41-49`, `src/features/epics/components/listing/epics-list-page.tsx:53-61`, `src/features/tasks/components/list/tasks-list-page.tsx:47-55`

## 9) App-Shell Context Driven by Route + Project Scope
**Pattern:** Sidebar items are globally defined, but project-scoped links are derived from current route context and disabled when no `projectId` is in scope.

**Evidence**
- Static nav definition: `src/components/layout/main-shell.constants.ts:5-11`
- Runtime route-derived project context and scoped hrefs: `src/components/layout/app-sidebar.tsx:98-107`, `src/components/layout/app-sidebar.tsx:113-156`

## 10) Optimistic UI for High-Frequency Mutations
**Pattern:** For task board drag-and-drop, UI updates optimistically first, then rolls back and toasts on server failure.

**Evidence**
- Optimistic update and rollback in board DnD: `src/features/tasks/components/board/tasks-board-page.tsx:105-130`
- Mutation endpoint used by board: `src/features/tasks/actions.ts:154-234`

## 11) Redux Scope Is Intentionally Narrow
**Pattern:** Redux currently stores authenticated user/session state; feature data (projects/epics/tasks) is fetched per-page/per-query rather than globally cached in Redux.

**Evidence**
- Store only combines `user`: `src/store/store.ts:4-6`
- User slice only: `src/store/user/user-slice.ts:6-40`
- Feature data passed as page props/hook state instead of store slices: `src/app/(main)/project/page.tsx:20-33`, `src/features/tasks/components/list/tasks-list-page.tsx:27-57`

## 12) Error and Loading Boundaries via App Router Conventions
**Pattern:** Route segments define `loading.tsx` / `error.tsx` where needed, delegating UI to feature-level placeholder/error components.

**Evidence**
- Members route boundaries: `src/app/(main)/project/[projectId]/members/loading.tsx:1-5`, `src/app/(main)/project/[projectId]/members/error.tsx:11-19`
- Project route boundaries: `src/app/(main)/project/loading.tsx:1-5`, `src/app/(main)/project/error.tsx:1-20`

## 13) Known Exception / Transitional Area
**Observation:** The invitation feature appears scaffolded but not yet implemented end-to-end (`route.ts` and related new files are currently empty), while the Supabase edge function exists and currently includes hardcoded SMTP credentials.

**Evidence**
- Empty/placeholder files: `src/app/api/invitations/route.ts` (empty), `src/features/projects/services/invite-service.ts` (empty), `src/features/projects/hooks/use-invite-member.ts` (empty), `src/features/projects/components/members/invite-member-form.tsx` (empty), `src/features/projects/utils/invitation-error.ts` (empty)
- Existing edge function implementation: `supabase/functions/send-invite-email/index.ts:1-53`
