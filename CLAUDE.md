# Task Management App (Taskly)

## Project Overview (WHY)
- Taskly is a team project-management app centered on Projects, Epics, and Tasks (`src/app/layout.tsx:15-22`).
- The authenticated workspace is under `/project`, with nested views for epics, tasks, members, and project details (`src/app/(main)/project/page.tsx:11-33`, `src/app/(main)/project/[projectId]/epics/page.tsx:25-70`, `src/app/(main)/project/[projectId]/tasks/page.tsx:28-78`, `src/app/(main)/project/[projectId]/members/page.tsx:23-54`, `src/app/(main)/project/[projectId]/details/page.tsx:1-3`).
- Auth flow is Supabase-based with middleware protection, callback exchange, and route-level user requirements (`src/middleware.ts:4-71`, `src/app/auth/callback/route.ts:6-53`, `src/lib/auth.utils.ts:6-16`, `src/app/(main)/layout.tsx:14-27`).

## Tech Stack (WHAT)
- Framework: Next.js App Router (route groups, server components, API routes) (`src/app/layout.tsx:24-40`, `src/app/(main)/layout.tsx:9-29`, `src/app/api/projects/route.ts:3-10`).
- Language/tooling: TypeScript (strict), ESLint 9, Prettier (`tsconfig.json:7-24`, `eslint.config.mjs:1-18`, `package.json:10-13`).
- UI: React 19 + shadcn/radix primitives + Tailwind CSS v4 (`package.json:28-39`, `components.json:3-13`, `postcss.config.mjs:1-8`).
- Forms/validation: react-hook-form + zod (`src/features/projects/components/project-form.tsx:3-19`, `src/features/tasks/components/task-form.tsx:3-23`, `src/features/auth/schemas/validations.ts:1-71`).
- Data/auth backend: Supabase SSR client + browser client + middleware-backed session handling (`src/lib/supabase/server.ts:1-23`, `src/lib/supabase/client.ts:1-8`, `src/middleware.ts:14-37`).
- State: Redux Toolkit for authenticated user state and shell-level session sync (`src/store/store.ts:1-20`, `src/store/user/user-slice.ts:20-40`, `src/components/layout/main-shell.tsx:15-27`).
- DnD interactions: @dnd-kit for board task status moves (`src/features/tasks/components/board/tasks-board-page.tsx:3-18`, `src/features/tasks/components/board/draggable-task-card.tsx:3-33`).

## Key Directories and Their Purpose (WHAT)
- `src/app/`: Route entrypoints, layouts, error/loading boundaries, and API handlers (`src/app/layout.tsx:24-40`, `src/app/(main)/layout.tsx:9-29`, `src/app/(main)/project/error.tsx:1-20`, `src/app/api/projects/[projectId]/tasks/route.ts:3-14`).
- `src/features/`: Feature-sliced domain modules (`auth`, `projects`, `epics`, `tasks`) with actions, queries, schemas, components (`src/features/projects/actions.ts:1-80`, `src/features/epics/queries.ts:1-119`, `src/features/tasks/actions.ts:1-235`).
- `src/components/`: Shared UI building blocks, providers, and app-shell components (`src/components/ui/sidebar.tsx:56-150`, `src/components/providers/app-provider.tsx:11-22`, `src/components/layout/app-sidebar.tsx:23-75`).
- `src/lib/`: Cross-cutting utilities (auth, supabase factories, pagination helpers) (`src/lib/auth.utils.ts:6-16`, `src/lib/supabase/server.ts:4-23`, `src/lib/pagination.ts:3-50`).
- `src/store/`: Redux setup, typed hooks, and user slice (`src/store/store.ts:4-17`, `src/store/hooks.ts:5-7`, `src/store/user/user-slice.ts:20-40`).
- `supabase/functions/`: Supabase Edge Functions (`supabase/functions/send-invite-email/index.ts:1-53`).

## Essential Build/Test Commands (HOW)
- Install dependencies: `npm install`.
- Start local dev server: `npm run dev` (`package.json:7`).
- Create production build: `npm run build` (`package.json:8`).
- Run production server locally: `npm run start` (`package.json:9`).
- Run lint checks: `npm run lint` (`package.json:10`).
- Run type checks: `npm run typecheck` (`package.json:12`).
- Format TS/TSX files (optional utility): `npm run format` (`package.json:11`).
- Note: there is currently no `test` script in `package.json` (`package.json:6-13`).

## Additional Documentation (Progressive Disclosure)
- `.claude/docs/architectural_patterns.md` — Read this when changing architecture, data flow, feature structure, state handling, API design, pagination behavior, or validation/mutation conventions.
- Add future specialized guides under `.claude/docs/` and keep this file as a concise index rather than duplicating deep instructions here.
