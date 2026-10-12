# Smart Scheduling — Instructions for AI Coding Agents

## 1. Read before coding

Before changing code, read these files in order:

1. `docs/frontend/PROJECT_CONTEXT.md`
2. `docs/frontend/SCREEN_MAP.md`
3. `docs/frontend/DESIGN_SYSTEM.md`
4. `docs/frontend/COMPONENT_GUIDE.md`
5. `docs/frontend/API_CONTRACT.md`
6. `docs/frontend/ACCEPTANCE_CRITERIA.md`
7. `docs/frontend/IMPLEMENTATION_PLAN.md`
8. `docs/frontend/TASTE_SKILL_SETUP.md`

Also inspect the existing `package.json`, `src/App.jsx`,
`src/main.jsx`, `src/index.css`, `src/components`,
`src/layouts`, `src/pages`, `src/services`, `src/context`,
`src/constants`, `src/mocks`, and `src/utils`.

The repository code and approved project documents
take precedence over assumptions.

## 2. Project rules that must not be changed

- Project name: Smart Scheduling - Website for Automated
  Staff Scheduling and Shift.
- The Capstone web scope is Single Store.
  Do not introduce multi-store, multi-tenant,
  Business Owner, or Platform Admin features.
- Web roles: Admin, Manager, Staff.
  Follow the approved SRS and existing role definitions
  for exact permissions.
- Web frontend: existing React + Vite project.
- Core backend: Laravel REST API.
- Database: Microsoft SQL Server.
- Queue/cache: Redis.
- Scheduling is handled by a separate Python FastAPI +
  OR-Tools CP-SAT service.
- The web frontend must use the documented Laravel API
  contract. Do not connect directly to the database or
  call internal services unless the approved API explicitly
  requires it.
- The optional AI Assistant is advisory only.
  It must not independently publish schedules, write
  official records, or make HR decisions.
- The Staff mobile app is a separate React Native
  application. Do not generate a React Native app inside
  this web repository.

## 3. Safe implementation rules

- Do not replace the existing project scaffold or rewrite
  the whole app without a clear need.
- Preserve working code and dependencies.
  Inspect before installing or removing packages.
- Reuse the current folders:
  components, constants, context, layouts, mocks,
  pages, services, and utils.
  Extend them only when needed.
- Keep API calls in `src/services`.
  Keep temporary sample data in `src/mocks`.
  Never present mock data as real backend data.
- Do not invent API routes, response schemas, permissions,
  or business rules.
- If backend documentation is unavailable, create a
  clearly isolated service adapter/mock and list the
  missing contract items.
- Every data-driven screen should handle loading, error,
  empty, and success states.
- Include accessible labels, keyboard focus, readable
  contrast, and responsive layouts.
- Do not leave dead buttons, fake links, or controls that
  appear functional but do nothing.
- If a feature is not implemented, make its status clear.
- Avoid exposing credentials, tokens, or secrets in source
  code. Use environment variables for public frontend
  configuration only.
- Do not change diagrams, SRS, proposal, backend, or
  database files when the task is specifically frontend
  implementation.

## 4. Design rules

- Follow the approved Smart Scheduling Figma design if
  it is available to the agent.
- Figma and approved project documents take precedence
  over generic styling suggestions.
- If Taste Skill is installed, read its `SKILL.md` and
  apply it to layout, typography, spacing, density, and
  motion.
- Build a coherent workforce-management product UI,
  not a generic landing page.
- Prioritize clear hierarchy, scan-friendly tables,
  useful filters, status indicators, and fast operational
  workflows.
- Avoid excessive gradients, glassmorphism, oversized
  decorative cards, random colors, and unnecessary
  animations.
- Keep shared tokens and reusable UI components
  consistent across pages.

## 5. Required workflow

### Stage 0 — Inspect and plan

1. Inspect the existing code and available project documents.
2. Identify what already works, what is missing,
   and any conflicts.
3. Present a short implementation plan, files to be
   changed, and assumptions.
4. Wait for user approval before editing files,
   unless the user explicitly authorizes implementation
   in the same request.

### After approval

Implement one phase at a time according to
`docs/frontend/IMPLEMENTATION_PLAN.md`.

After each phase, report changed files, checks run,
known gaps, and the next phase.

Do not silently proceed through a major rewrite.

## 6. Completion report

At the end, report:

- Pages and workflows implemented.
- Files changed.
- Commands/tests run and their results.
- API routes that are connected versus mocked.
- Known limitations and any decisions requiring
  user approval.