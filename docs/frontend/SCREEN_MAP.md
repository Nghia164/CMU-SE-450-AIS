# Frontend Screen Map

This is a planning map, not permission to invent
requirements.

Verify every screen and action against the approved SRS
and Figma before implementation.

Do not build a screen solely because it appears in this
list if the approved scope excludes it.

## Shared

- Sign in / session handling.
- Access-denied and not-found states.
- User profile and notification access only where
  required by the SRS.
- Shared page shell, navigation, breadcrumbs,
  loading states, error states, empty states,
  and confirmation dialogs.

## Admin

Implement only the Admin functions specified in
the approved SRS.

Candidate areas to verify:

- Admin dashboard or operational overview.
- User/account and role management.
- Store-level configuration and service settings.
- Service health/availability status, if included
  in the approved requirements.

## Manager

Core operational areas to verify against the SRS/Figma:

- Dashboard and operational alerts.
- Employee directory and employee details.
- Skills, positions, contracts, and pay-rate information
  where authorized.
- Staff availability and registration deadlines.
- Shift definitions and required staffing/skills.
- Schedule calendar/board with manual assignment
  and editing.
- Automatic scheduling run:
  submit request, show progress/status, display draft
  results, conflicts and unfilled shifts.
- Schedule review, versioning, and publish confirmation.
- Leave request review.
- Shift-swap requests and open-shift/replacement offers.
- Attendance review and timesheet approval.
- Reports and exports, where included in the release.
- Notifications and relevant settings.

## Staff

The main Staff experience is the separate React Native
app.

Do not create a second mobile app in this repository.

Add Staff-facing web pages only when the approved
SRS/Figma explicitly requires them for this web
application.

## Route and navigation rules

- Inspect the existing router before adding or changing
  routes.
- Use the routing library already installed;
  do not add another router unnecessarily.
- Keep navigation and page access role-aware.
- Hiding a navigation item is not authorization:
  backend authorization remains authoritative.
- Do not expose inaccessible actions to a role.
- Show a clear access-denied state if a user navigates
  directly to a restricted URL.
- Keep route names and labels consistent with the
  approved SRS/Figma.