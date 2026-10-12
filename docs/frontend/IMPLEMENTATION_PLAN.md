# Frontend Implementation Plan

The AI Agent must inspect the repository and propose
a plan first.

Wait for user approval before editing, unless the user
explicitly authorizes implementation in the same request.

Implement one phase at a time.

## Phase 0 — Audit and plan

- Inspect package scripts/dependencies and current
  app entry points.
- Inspect all existing source folders and identify
  working screens/components.
- Review available SRS, Figma, API docs, and this
  guidance pack.
- Report current state, missing screens, risks,
  files proposed for change, and assumptions.
- Do not delete or rewrite files during the audit.

## Phase 1 — Foundation

After approval:

- Stabilize shared layout, navigation, route handling,
  and role-aware UI using existing libraries.
- Align global typography, spacing, colors, and reusable
  controls with Figma/design tokens.
- Add shared loading, empty, error, and access-denied
  states as needed.

## Phase 2 — Core management pages

- Implement only the approved Admin/Manager pages.
- Reuse shared tables, forms, filters, dialogs,
  and status indicators.
- Use mock adapters only when the real API contract
  is unavailable.

## Phase 3 — Scheduling workflow

- Implement shift/calendar views, manual editing,
  generation-run status, draft review, conflict/shortage
  display, and publishing flow only as supported by
  the SRS/API.
- Keep optimization results as drafts until an authorized
  user publishes them.
- Do not fabricate solver results or claim unavailable
  staffing is resolved.

## Phase 4 — Requests and time operations

- Implement approved leave, shift-swap/open-shift,
  attendance, and timesheet workflows.
- Verify state transitions and permissions against
  the SRS/API contract.

## Phase 5 — Dashboard and reports

- Implement only approved metrics and exports.
- Clearly label estimates and distinguish planned
  schedule data from actual/approved timesheet data
  where required.

## Phase 6 — Integration and quality

- Connect only verified Laravel endpoints.
- Run existing lint/build/test scripts.
- Check responsive behavior, role access, empty/error
  states, and browser console.
- Fix regressions without unrelated rewrites.

## Phase completion report

After each phase, list:

1. What was implemented.
2. Files changed.
3. Checks run and results.
4. Real API integrations versus mocks.
5. Known gaps and the next phase awaiting approval.