# Frontend Component and Folder Guide

## Existing structure

The repository currently shows this structure.
Preserve it and extend it rather than replacing it:

- `src/components/`
  Reusable UI components.
- `src/constants/`
  Shared constants, labels, route definitions,
  and status mappings.
- `src/context/`
  Shared React contexts such as authentication/session
  state, if used by the current app.
- `src/layouts/`
  Shared application shells and role-aware layouts.
- `src/mocks/`
  Clearly identified development/test data only.
- `src/pages/`
  Route-level pages grouped by domain when practical.
- `src/services/`
  API clients and domain service functions.
- `src/utils/`
  Formatting, validation, date/time, and other
  pure helpers.
- `src/App.jsx`
  App routes/composition, following the current
  implementation.
- `src/main.jsx`
  App bootstrap.
- `src/index.css`
  Global styles and tokens, following the current
  styling approach.

## Architecture rules

- Route-level pages compose reusable components;
  avoid putting an entire feature into one huge component.
- Keep business/API logic out of presentational components.
- Keep network calls inside `src/services`.
- Keep role and status constants centralized.
- Use the existing state-management pattern.
- Do not add Redux or another state library unless
  the project needs it and the user approves.
- Reuse existing table, form, modal, button, badge,
  date, and layout components where suitable.
- Avoid duplicate components that differ only by
  a few props.
- Keep components small enough to understand and test.

## Suggested domain grouping

Use the existing naming convention and folder style.

If grouping is needed, domains may include:

- `auth`
- `dashboard`
- `employees`
- `availability`
- `shifts`
- `scheduling`
- `leave`
- `shift-swaps`
- `attendance`
- `timesheets`
- `reports`
- `settings`

Do not create every folder automatically.
Add only what the approved screens require.

## Data handling

- Format dates, times, and currency consistently
  through utilities.
- Keep mock records in `src/mocks` and mark mock mode
  clearly during development.
- Never hard-code credentials or production URLs.
- Avoid duplicating backend validation rules in a way
  that contradicts the API.
- Frontend validation improves usability;
  the backend remains authoritative.