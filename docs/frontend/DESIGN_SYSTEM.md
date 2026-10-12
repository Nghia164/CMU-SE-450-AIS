# Smart Scheduling — UI Design System

## Priority

1. Follow the approved Figma screens and design tokens
   when available.
2. Follow existing reusable components and styles if
   they already match the approved design.
3. Use the fallback guidance below only where the design
   is not specified.

## Visual direction

Create a polished, practical workforce-management
SaaS interface.

It should feel reliable and operational:
clear hierarchy, compact but readable information,
predictable navigation, and strong visibility of schedule
conflicts and request statuses.

Do not make it look like a marketing landing page.

## Fallback design tokens

Use these only if no approved Figma token exists:

- App background: `#F8FAFC`
- Main surface: `#FFFFFF`
- Primary text: `#0F172A`
- Secondary text: `#64748B`
- Border: `#E2E8F0`
- Primary action: `#2563EB`
- Success: `#15803D`
- Warning: `#B45309`
- Error: `#B91C1C`
- Informational: `#0369A1`

Centralize tokens in the existing styling approach
instead of scattering raw colors across components.

Do not override Figma colors with these fallback values.

## Typography and spacing

- Use the typography already configured in the project
  or Figma.
- If none exists, use a clean system sans-serif stack.
- Do not add a font dependency without a reason.
- Use a consistent spacing scale, preferably multiples
  of 4 or 8.
- Keep headings, body text, metadata, table content,
  and helper text visually distinct.
- Avoid overly large headings inside operational pages.

## Layout

- Provide a consistent application shell with clear
  navigation and page titles.
- Use tables for scan-heavy lists; use cards only when
  they improve comparison or summary.
- Use filters, search, pagination, and sorting when
  required by the dataset and SRS.
- For scheduling views, make date ranges, staff names,
  shift times, assignment status, conflicts, and
  unfilled shifts easy to scan.
- Use clear confirmation steps for publishing schedules
  and approving consequential requests.
- Keep primary actions prominent but avoid multiple
  competing primary buttons.

## Status and feedback

- Do not communicate status through color alone;
  include text or an accessible icon/label.
- Define consistent states for draft, published,
  pending, approved, rejected, conflict, unfilled,
  loading, error, and empty results where relevant.
- Confirm destructive or consequential actions.
- Show useful validation messages near affected fields.

## Responsive and accessible behavior

- Support desktop first for the management web app,
  with usable tablet and narrow-screen layouts.
- Tables may use controlled horizontal scrolling on
  small screens; do not let the entire page overflow
  horizontally.
- Maintain keyboard focus visibility, semantic headings,
  labels, contrast, and accessible dialog behavior.
- Respect reduced-motion preferences.

## Taste Skill

If Taste Skill is installed, read and follow its actual
`SKILL.md`.

Use its design exploration and visual-quality guidance,
but do not invent extra Taste Skill rules or let styling
override product requirements.