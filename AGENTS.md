# Smart Scheduling — AI Agent Instructions

## Mandatory source review before frontend work

You are working in the repository root `smart-scheduling/`. The frontend code is inside `frontend/`; SQL scripts are inside `database/sql/`.

Before proposing or editing frontend code:

1. Read `README.md`.
2. Read `docs/AI_AGENT_SOURCE_INDEX.md`.
3. Locate and read the approved Proposal and SRS listed in the source index. If both DOCX and PDF copies exist, use the PDF/text-readable copy for content extraction and consult the DOCX when layout or tables need verification.
4. Read relevant User Stories, Product Backlog, Use Case Specifications, and architecture documents referenced by the source index.
5. Read `docs/design/FIGMA_REFERENCE.md` and inspect the linked Figma file or exported frames under `docs/design/figma-exports/`.
6. Inspect `frontend/package.json` and the existing `frontend/src/` code before suggesting changes.
7. Inspect `database/sql/` only when a UI field, entity, or API data shape needs verification. SQL schema informs data fields; it does not replace the SRS for user-facing behavior.

Do not claim to have read a source that you could not open. Report inaccessible files or Figma access limitations and ask for the needed export/permission.

## Source-of-truth rules

- Latest approved Proposal: project scope, goals, architecture, technology stack, and project boundaries.
- Latest approved SRS: functional requirements, business rules, actor permissions, validations, workflows, and acceptance behavior.
- Approved User Stories, Product Backlog, and Use Case Specifications: detailed story-level behavior and traceability, when consistent with the approved SRS.
- Figma: visual design, page composition, navigation presentation, typography, colors, spacing, components, and interaction appearance. Figma must not silently override business rules in the SRS.
- Existing code: current implementation and conventions, not proof that an undocumented behavior is approved.

If sources conflict, do not silently choose or merge the conflicting rules. State the conflict, cite the document/section or Figma frame where possible, and ask for a decision. For implementation planning, use the latest approved source versions only.

## Project baseline

- Project name: **Smart Scheduling - Website for Automated Staff Scheduling and Shift**.
- Project code: **C1SE.57**.
- Capstone scope: **Single Store**. Do not add multi-store or multi-tenant features.
- Web frontend: existing React + Vite project in `frontend/`.
- Core backend: Laravel REST API.
- Database: Microsoft SQL Server, with SQL scripts in `database/sql/`.
- Queue/cache: Redis.
- Scheduling service: Python FastAPI + OR-Tools CP-SAT.
- Web roles: Admin, Manager, Staff. Exact permissions must come from the approved SRS.
- The Staff mobile application is separate; do not create a React Native app inside `frontend/`.
- The optional AI Assistant is advisory only. It must not independently publish schedules, modify official records, or make HR decisions.
- The browser frontend must use documented backend APIs, not connect directly to SQL Server or internal services.

## Frontend implementation rules

- Work inside `frontend/`; do not move or recreate the repository structure.
- Preserve existing working code and dependencies. Inspect before installing, deleting, or replacing packages.
- Follow the existing folders and conventions in `frontend/src/`.
- Keep API requests in the existing service layer or `frontend/src/services/` if that folder exists.
- Keep mock data clearly separated from real API data.
- Do not invent API endpoints, response schemas, permissions, fields, or business rules.
- Every data-driven page should handle loading, success, empty, validation-error, and server-error states.
- Do not leave buttons or links that appear functional but do nothing.
- Use the approved Figma design for the relevant screen. If a screen is not present in Figma, identify the gap and use existing design patterns rather than inventing a radically different style.
- If Taste Skill is installed, read its actual `SKILL.md`. Visual styling must not override the approved requirements or reduce schedule/table readability.

## Required workflow

### Stage 0 — Audit only
1. Read the sources listed above.
2. Inspect the current frontend.
3. Create a traceability table with: requirement/story ID, expected screen/workflow, SRS source, Figma frame, current implementation status, and missing details.
4. List conflicts, inaccessible sources, assumptions, and proposed files to change.
5. Present a phased implementation plan.
6. **Do not edit code until the user approves the plan**, unless the user explicitly asks you to implement immediately.

### After approval
- Implement one approved phase at a time.
- Re-check the relevant SRS requirement and Figma frame before implementing each screen.
- Do not implement out-of-scope functionality.
- Run the available lint/build/test commands after each phase.
- Report files changed, requirements covered, real API integrations versus mocks, checks performed, and remaining gaps.

## Completion checklist

Before calling frontend work complete, verify:
- [ ] Relevant Proposal/SRS sections were read.
- [ ] Each implemented screen maps to an approved requirement or story.
- [ ] Figma was inspected directly or through exported frames.
- [ ] Role permissions and business rules match the SRS.
- [ ] No unapproved scope was added.
- [ ] Existing routes and functionality still work.
- [ ] Build/lint/tests were run where available.
- [ ] Unimplemented API endpoints and mocked data are clearly identified.
