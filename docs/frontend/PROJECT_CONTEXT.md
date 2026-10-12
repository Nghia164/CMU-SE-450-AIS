# Smart Scheduling — Frontend Project Context

## Project identity

- Official project name:
  Smart Scheduling - Website for Automated Staff
  Scheduling and Shift.
- Team/code: C1SE.57.
- Product: workforce management and automated shift
  scheduling for F&B operations.
- Current repository shown by the user:
  React + Vite web frontend.

## Goal

Help a store manage staff information, availability,
shifts, schedules, leave and shift changes, attendance,
timesheets, notifications, dashboards, and reports.

The interface should make operational problems visible
and help the Manager review decisions quickly.

## Confirmed project boundaries

- The Capstone scope is Single Store.
- Web roles are Admin, Manager, Staff.
  Implement permissions from the approved SRS;
  do not guess role permissions.
- React + Vite is used for the web frontend.
- Laravel provides the core REST API and business rules.
- Microsoft SQL Server is the database.
- Redis supports queues/cache.
- A separate Python FastAPI service uses OR-Tools CP-SAT
  for schedule optimization.
- The AI Assistant is optional and advisory only.
- Staff mobile experience belongs to a separate
  React Native app, not this React + Vite web repository.

## Main operational capabilities

Use the approved SRS and Figma to determine exact
page requirements.

The project areas include:

- Authentication and role-based access.
- Employee information, skills, contracts, and effective
  pay rates where specified.
- Staff availability and Manager-defined availability
  deadlines/scheduling periods.
- Shift definitions, staffing requirements, and manual
  schedule editing.
- Automatic scheduling requests, run status, draft
  results, conflict/shortage information, review,
  and publishing.
- Leave requests, direct shift swaps, and
  open-shift/replacement workflows.
- Attendance and timesheet review.
- Dashboard, operational reports, and notifications.
- Optional AI explanations based on verified,
  permission-controlled data.

## Scheduling and AI safety rules

- An optimization result is a draft/suggestion until an
  authorized Manager reviews and publishes it.
- If the optimizer is unavailable, the core workflow
  should still support manual scheduling.
- Do not claim every shift can be filled when eligible
  staff are insufficient; show shortages clearly.
- AI is not the source of truth and must not independently
  edit official data, publish schedules, or make salary,
  reward, penalty, promotion, or other HR decisions.

## Sources of truth

Resolve requirements in this order:

1. Approved SRS and latest approved proposal.
2. Approved Figma screens/design system.
3. Existing frontend behavior and backend API
   documentation.
4. These guidance files.
5. Any assumptions must be written down and confirmed
   before implementing high-impact behavior.

Do not silently import older project versions that mention
MySQL, multi-tenant scope, Business Owner, or Platform
Admin. Those are not part of the current frontend baseline.