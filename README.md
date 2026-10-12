
# Smart Scheduling — Website for Automated Staff Scheduling and Shift

Smart Scheduling is a workforce-management web application for F&B businesses. It is designed to help a single store manage employees, staff availability, shifts, schedules, leave and shift-change requests, attendance, timesheets, notifications, dashboards, and reports.

- **Project code:** C1SE.57
- **Frontend:** React + Vite
- **Scope:** Single Store

## 1. Project Goals

- Reduce the time required to prepare and maintain staff schedules.
- Help Managers review staff availability, staffing requirements, and scheduling conflicts.
- Support automatic schedule generation while allowing authorized Managers to review and publish schedules.
- Simplify leave requests, shift swaps, attendance, and timesheet workflows.
- Provide operational information through dashboards, notifications, and reports where specified in the approved requirements.

## 2. Technology Stack

- **Frontend:** React, Vite, JavaScript/JSX, CSS.
- **Core Backend:** Laravel REST API.
- **Database:** Microsoft SQL Server.
- **Queue and Cache:** Redis.
- **Scheduling Service:** Python FastAPI and OR-Tools CP-SAT.
- **Optional AI Assistant:** Advisory explanations and assistance.
- **Staff Mobile App:** React Native, maintained separately.

The frontend must communicate with the documented Laravel API. It must not connect directly to SQL Server or bypass backend business rules.

## 3. User Roles

The web application uses three roles:

- **Admin**
- **Manager**
- **Staff**

Exact permissions and accessible screens must follow the approved Software Requirements Specification (SRS).

## 4. Project Structure

```text
smart-scheduling/
├── public/
├── src/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── layouts/
│   ├── mocks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── docs/
│   └── frontend/
├── AGENTS.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

- `components/`: Reusable UI components.
- `constants/`: Shared constants and status definitions.
- `context/`: Shared React context.
- `layouts/`: Application layouts.
- `mocks/`: Development and test data.
- `pages/`: Application pages.
- `services/`: API integration.
- `utils/`: Helper functions.
- `docs/frontend/`: Frontend requirements and AI Agent guidance.
- `AGENTS.md`: Instructions for AI coding agents.

## 5. Getting Started

### Requirements

- Node.js compatible with the installed Vite version.
- npm.

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

Check `package.json` for the actual scripts available in the repository.

## 6. Environment Configuration

If the frontend requires a backend URL, follow the existing configuration convention. For example, if approved for the project:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Replace the example with the actual Laravel API URL. Do not assume the port without checking the backend configuration.

Never expose database credentials, private API keys, or server-side secrets in frontend environment variables.

## 7. Design and Requirements

Follow these sources in order:

1. Approved SRS and latest approved project proposal.
2. Approved Smart Scheduling Figma design.
3. Verified backend API documentation.
4. Existing frontend code and frontend guidance files.

The interface should prioritize readable scheduling views, clear request statuses, useful filters, consistent forms, responsive layouts, and accessible interactions.

## 8. AI Coding Agent

Before implementing features, read the following files when available:

- `AGENTS.md`
- `docs/frontend/PROJECT_CONTEXT.md`
- `docs/frontend/SCREEN_MAP.md`
- `docs/frontend/DESIGN_SYSTEM.md`
- `docs/frontend/COMPONENT_GUIDE.md`
- `docs/frontend/API_CONTRACT.md`
- `docs/frontend/ACCEPTANCE_CRITERIA.md`
- `docs/frontend/IMPLEMENTATION_PLAN.md`
- `docs/frontend/TASTE_SKILL_SETUP.md`

The AI Agent must inspect existing code, propose a plan, and wait for approval before significant changes unless implementation is explicitly authorized.

Taste Skill can be installed using:

```bash
npx skills add leonxlnx/taste-skill --yes
```

The agent must verify installation and read the actual `SKILL.md` before claiming the skill is active.

## 9. Business Rules

- The Capstone scope is **Single Store**. Do not add multi-store or multi-tenant functionality.
- Do not introduce unrelated roles or features from older project versions.
- Automatic scheduling results remain drafts until an authorized Manager reviews and publishes them.
- Show staffing shortages and scheduling conflicts honestly.
- AI is advisory only and must not independently publish schedules, modify official records, or make HR decisions.
- Separate mock data from real backend data.
- Do not invent API endpoints, response schemas, permissions, or business rules.

## 10. Development Guidelines

- Reuse existing components, dependencies, and project conventions.
- Keep API requests in `src/services/`.
- Keep mock data in `src/mocks/`.
- Handle loading, success, empty, validation-error, and server-error states.
- Ensure buttons and links perform their advertised actions.
- Test responsive layouts and role-based navigation.
- Run the available lint, test, and build scripts before submitting changes.

## 11. Project Status

This README describes the intended project scope and frontend setup. It does not claim that every listed capability or backend integration is already implemented. Verify implementation status in the source code, approved SRS, Figma, and backend API documentation.

## Team

- **Project code:** C1SE.57
- **Project name:** Smart Scheduling — Website for Automated Staff Scheduling and Shift
