# Frontend API Contract and Integration Rules

## Core rule

The frontend communicates with the Laravel REST API.

It must not access Microsoft SQL Server directly
and must not bypass Laravel business rules by calling
the database or internal services from the browser.

## Before connecting an endpoint

1. Inspect the backend route definitions, API
   documentation, existing service files, and response
   examples supplied in the repository.
2. Confirm HTTP method, path, authentication requirements,
   role permissions, request schema, response schema,
   pagination, and error format.
3. Record the verified endpoint in the relevant service
   or API documentation.
4. If any detail is missing, ask for clarification
   or keep the integration behind an explicit mock
   adapter. Do not invent a real endpoint.

## Environment

- Use the existing environment/configuration pattern.
- If a base URL variable is needed, use
  `VITE_API_BASE_URL` only after checking current
  conventions.
- Never put private server secrets in Vite environment
  variables; frontend environment variables are visible
  to the browser.

## Service layer

Organize service functions by confirmed domain when
needed, such as authentication, employees, availability,
shifts, schedules, leave, attendance, timesheets,
and reports.

Use the HTTP client already installed in `package.json`.
Do not add another one without justification.

## Required UI states

Every API-driven page should handle:

- Loading / in-progress.
- Successful result.
- Empty result.
- Validation error.
- Authentication expiry or permission denial.
- Network/server error with a useful retry path
  where appropriate.

## Scheduling workflow

- A scheduling run may take time.
- Show the state returned by the verified backend
  contract rather than assuming immediate success.
- Display the draft/result only when returned by
  the backend.
- Keep draft, conflict, and unfilled-shift information
  visible when supplied.
- Publishing requires an explicit authorized user
  action and backend confirmation.
- Do not make the frontend claim a schedule is published
  merely because a generation request succeeded.

## AI Assistant

- Treat AI output as advisory text, not authoritative
  system data.
- Use only documented, permission-checked backend
  endpoints.
- Do not let an AI response directly update official
  employee data or publish a schedule.