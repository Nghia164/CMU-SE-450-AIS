# Frontend Acceptance Criteria

A page or workflow is complete only when the relevant
criteria below pass and the approved SRS/Figma
requirements are satisfied.

## Product and scope

- [ ] Uses the current Single Store project scope.
- [ ] Uses only the approved Admin, Manager, and Staff
      role definitions.
- [ ] Does not add features from older proposal versions
      or unrelated HR/payroll products.
- [ ] Does not move Staff mobile workflows into this
      web repository unless required by the approved SRS.

## UI and design

- [ ] Matches approved Figma where a matching screen
      exists.
- [ ] Uses shared tokens and reusable components
      consistently.
- [ ] Has clear page titles, navigation, primary actions,
      and status labels.
- [ ] Has no unnecessary gradients, decorative clutter,
      or inconsistent spacing.
- [ ] Works at desktop, tablet, and narrow viewport widths.
- [ ] Keyboard focus, labels, contrast, and dialog
      behavior are usable.

## Functionality

- [ ] Navigation and buttons perform the action
      they advertise.
- [ ] Role-based navigation and page access are
      consistent with the approved permissions.
- [ ] Forms validate required fields and show
      understandable errors.
- [ ] Data-driven pages handle loading, empty,
      success, and error states.
- [ ] Dates, times, statuses, and currency use
      consistent formatting.
- [ ] Consequential actions such as publishing a schedule
      require explicit confirmation.

## Integration and reliability

- [ ] API calls are in `src/services`.
- [ ] Real endpoints and schemas are verified;
      unverified data is clearly mocked.
- [ ] No credentials or server secrets are committed.
- [ ] No direct database access or undocumented calls
      to internal services.
- [ ] No new console errors, broken imports,
      or broken existing routes.
- [ ] Existing scripts in `package.json` run successfully;
      report any pre-existing failures separately.

## Delivery

- [ ] List all changed files.
- [ ] State which workflows use real API data
      and which still use mocks.
- [ ] Report checks/tests and their outcomes.
- [ ] List unresolved requirements or decisions
      that need approval.