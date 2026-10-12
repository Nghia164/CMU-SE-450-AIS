# AI Agent — Project Source Index

This file tells the coding agent which project documents to read. Update the paths below to match the actual filenames in this repository. Do not create fake source files just to match these examples.

## 1. Approved requirements

Place the approved documents under `docs/requirements/` if practical, or keep their current location and update the paths here.

- **Proposal:** `docs/requirements/C1SE.57_PROPOSAL_Smart_Scheduling_v1.3.docx`
  - Original DOCX may also be kept beside the PDF.
  - Use for scope, goals, architecture, stack, project boundaries, and planned capabilities.
- **SRS:** `docs/requirements/C1SE.57_SRS_Smart_Scheduling_v1.1.docx`
  - Original DOCX may also be kept beside the PDF.
  - Use for functional requirements, actors, permissions, business rules, workflows, and validation.
- **User Stories:** `docs/requirements/C1SE.57_Smart_Scheduling_UserStory_v1.1.docx`
- **Product Backlog:** `docs/requirements/C1SE.57_PRODUCT_BACKLOG_Smart_Scheduling_v1.1.docx`
- **Use Case Specifications:** add the actual approved files/folder paths here.
- **Architecture/API documentation:** add the actual approved files/folder paths here.

If the files currently have different names or are stored directly in `docs/`, update this index to the real paths. Do not assume an example path exists.

## 2. Figma design

- Read `docs/design/FIGMA_REFERENCE.md`.
- Inspect the live Figma file if the agent has authorized Figma access.
- If the agent cannot inspect Figma directly, use the exported PDF/PNG files in `docs/design/figma-exports/`.
- Export complete relevant frames, not only small cropped fragments. Include the page/navigation, key tables/forms, modal states, and responsive variants when those are part of the design.
- Record each frame name and its corresponding requirement/screen in `FIGMA_REFERENCE.md`.

## 3. Existing frontend

- Repository: `frontend/`
- Dependencies and scripts: `frontend/package.json`
- Existing code: `frontend/src/`
- Read `frontend/README.md` if present.
- Preserve the current React + Vite scaffold and conventions.

## 4. Database reference

- SQL scripts: `database/sql/`
- `00_check_sqlserver2022.sql`
- `01_schema.sql`
- `02_seed_reference.sql`

Use these to understand entity/field names when necessary. The database schema does not define the complete UI workflow or user permissions; use the SRS for those.

## 5. Conflict resolution

- Proposal defines the approved scope and architecture.
- SRS defines detailed system behavior and business rules.
- User Stories/Use Cases provide traceable implementation details.
- Figma defines the visual presentation and screen interactions.
- Database scripts help verify data entities and fields.
- If any sources disagree, list the exact conflict and request a decision instead of guessing.
