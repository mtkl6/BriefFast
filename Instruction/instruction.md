# Product Requirements Document (PRD)

**Project Name:** BriefFa.st – Automated Briefing Generator  
**Version:** 1.0  
**Last Updated:** March 1, 2025

---

## 1. Overview

**Brieffast** is a Software-as-a-Service (SaaS) platform designed to help freelancers, agencies, and businesses quickly generate structured, detailed project briefings. By walking the user through a guided questionnaire, the system automatically formats the responses into a polished briefing document in Markdown, which can be easily shared or exported.

### 1.1 Key Features

1. ✅ **Dynamic Questionnaire** tailored by project type (e.g., Web Development, Design, Copywriting).
2. ✅ **Automated Briefing Generation** in Markdown.
3. ✅ **Secure Data Storage** using Redis instead of the originally planned [Neon Postgres](https://neon.tech/) and [Drizzle ORM](https://orm.drizzle.team/).
4. ✅ **Preview & Edit** capabilities for final touches.
5. ✅ **Shareable Link** with optional privacy settings.
6. ❌ **PDF Export** with optional branding (logo, color themes, etc.).
7. ❌ **Premium Upgrades** for multi-user collaboration, advanced export formats, and custom branding.

---

## 2. Scope & Objectives

1. ✅ **Primary Goal:** Facilitate quick and frictionless creation of standard briefings across different project categories.
2. ✅ **Key Objective:** Minimize the time and effort required by end-users to generate detailed, structured briefs.
3. ❌ **Success Criterion:** Reduce the average briefing creation time (from scratch) by at least 70%.

---

## 3. Target Users

1. ✅ **Freelancers:** Looking for a simple tool to gather client requirements.
2. ❌ **Agencies:** Need advanced features such as branding and team collaboration.
3. ❌ **Enterprise Teams:** Require role-based access, secure data handling, and integration with existing workflows.

---

## 4. Core Product Flow

1. ✅ **User Selects a Category** (e.g., Web Development).
2. ✅ **Dynamic Questionnaire** adjusts based on the selected category.
3. ✅ **Auto-Save & Data Storage** with UUID-based records in Redis (instead of Neon Postgres).
4. ✅ **Markdown Briefing** automatically generated from the user's inputs.
5. ✅ **Preview & Edit** the briefing.
6. ❌ **Export** to PDF or other formats.
7. ✅ **Share Link** (UUID-based, no login required).

---

## 5. Detailed Functional Requirements

### 5.1 Dynamic Questionnaire System

- **Description:** Guide users through relevant questions based on their chosen project category.
- **Functional Requirements:**

  1. ✅ **Category Selection:**
     - A user must choose a project category from a predefined list (Web Dev, Design, etc.).
  2. ✅ **Conditional Form Fields:**
     - Show or hide form elements based on previous answers.
  3. ✅ **Multi-step Navigation & Validation:**
     - Each step must validate required fields before proceeding.
  4. ✅ **Auto-Save:**
     - Save progress in local storage and to the database (when possible).
  5. ✅ **Responsive Layout:**
     - The step-by-step form must be mobile-friendly.

- **UI/UX Requirements:**
  - ✅ Use [ShadCN UI](https://ui.shadcn.com/) components for consistency.
  - ✅ Progress indicators showing the current step and total steps.
  - ✅ Inline validation messages (e.g., red text or border highlights).

---

### 5.2 Automated Briefing Generation

- **Description:** Convert user responses into a well-structured Markdown document.
- **Functional Requirements:**

  1. ✅ **Template-Based Construction:**
     - Each project category can have a base Markdown template.
     - Example placeholders: `## {ProjectName}`, `### Requirements: {RequirementsList}`, etc.
  2. ✅ **Editable Preview:**
     - Users can view the formatted Markdown and make final edits.
  3. ✅ **Structured JSON Output:** LATER
     - The system should also produce a JSON version for possible API integrations.

- **Example Markdown Snippet:**

  ```markdown
  # Web Development Brief

  **Project Name:** {projectName}
  **Primary Objectives:**

  - {objective1}
  - {objective2}

  ## Scope of Work

  {scopeDetails}

  ## Timeline

  Estimated Start: {startDate}
  Estimated Completion: {endDate}
  ```

- **UI/UX Requirements:**
  - ✅ Toggle to switch between "Markdown View" and "Formatted Preview."
  - ✅ Syntax highlighting for Markdown.

### 5.3 Secure Data Storage (Neon Postgres + Drizzle ORM)

- **Description:** Persist questionnaire answers and generated briefings in a Neon Postgres instance using Drizzle ORM.
- **Functional Requirements:**

  1. ✅ **UUID-based Records:**
     - Each briefing is stored under a unique UUID (e.g., 123e4567-e89b-12d3-a456-426614174000).
  2. ✅ **Data Model:**
     - id (UUID, primary key)
     - category (string)
     - data (JSONB) – holds structured user responses
     - created_at (timestamp)
     - updated_at (timestamp)
  3. ❌ **Row-Level Security:**
     - Ensure that only the requested briefing data is accessible via its UUID.
  4. ❌ **Optional Encryption:**
     - For sensitive data, offer an encryption option.

- **Example Drizzle Schema Snippet (for illustration only):**

```typescript
// db.ts
import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

export const briefings = pgTable("briefings", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category"),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

- **Example Drizzle Usage:**

```typescript
// Insert a new briefing
const newBriefing = await db.insert(briefings).values({
  category: 'Web Development',
  data: {...} // JSON object of user responses
}).returning();
```

### 5.4 Preview, Edit, and Share

- **Description:** Users can edit the final briefing, share via a unique link, and control visibility.
- **Functional Requirements:**

  1. ✅ **UUID-based Public Link:**
     - Anyone with the link can view the briefing (read-only).
  2. ❌ **Optional Expiration Date:**
     - Link can become invalid after a certain date (premium feature).
  3. ❌ **Password Protection:**
     - Optionally require a password to view the briefing (premium feature).
  4. ❌ **Embeddable Links:**
     - Frame or embed the briefing in Notion, Trello, etc.

- **Example Shareable URL Format:**

```
https://brieffa.st/b/<UUID>
```

- **Example JSON Response for a GET Request:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "category": "Web Development",
  "data": {
    "projectName": "My Awesome Web App",
    "requirements": ["Responsive Layout", "User Authentication"],
    "timeline": "Q2 2025"
  },
  "created_at": "2025-03-01T12:34:56.000Z",
  "updated_at": "2025-03-01T12:34:56.000Z"
}
```

### 5.5 PDF Export

- **Description:** Export briefings to a PDF file using either jsPDF or html2pdf.js.
- **Functional Requirements:**

  1. ❌ **One-Click PDF Export:**
     - Optionally include custom branding (logo, fonts, colors).
  2. ❌ **Auto-Pagination:**
     - Long documents split into multiple pages with headers/footers.
  3. ❌ **Selective Sections:**
     - Allow users to exclude certain optional sections before export.
  4. ❌ **Dark Mode Support:**
     - If the user's system is in dark mode, give them the option to preserve dark mode in the PDF.

- **Example Code Snippet (for illustration only):**

```javascript
// Using html2pdf.js
const element = document.getElementById("briefing-preview");
const opt = {
  margin: 1,
  filename: "briefing.pdf",
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: {},
  jsPDF: { orientation: "portrait" },
};
html2pdf().from(element).set(opt).save();
```

### 5.6 Premium Features

- **Description:** Additional paid features to enhance collaboration, branding, and integration.
- **Functional Requirements:**
  1. ❌ **Branding:**
     - Add logos, color schemes, and fonts to PDFs and web views.
  2. ❌ **Collaboration Mode:**
     - Multi-user real-time editing (possible via WebSockets or third-party).
  3. ❌ **Advanced Export Options:**
     - Export to DOCX, HTML, and raw Markdown.
  4. ❌ **API Access:**
     - Webhook or direct API usage for automated briefing generation from external tools.
  5. ❌ **User Roles & Permissions:**
     - Admin can invite team members and set read/write permissions.

---

## 6. Technical Stack

- ✅ **Framework:** Next.js 15
- ✅ **Language:** TypeScript
- ✅ **Styling:** Tailwind CSS
- ✅ **UI Components:** ShadCN UI
- ✅ **State Management:** React Context or Zustand
- ❌ **Database:** Neon Postgres with Drizzle ORM (Using Redis instead)
- ❌ **PDF Generation:** jsPDF or html2pdf.js
- ✅ **Hosting:** Vercel

---

## 7. Minimal Project File Structure

Below is a proposed minimal file structure for the Next.js 15 application with Drizzle and Tailwind. This layout aims to keep the project lean:

```
.
├── app
│   ├── api
│   │   └── briefings
│   │       └── route.ts       # Single serverless route for handling all briefing logic
│   ├── layout.tsx             # Root layout (imports global styles)
│   ├── page.tsx               # Main/landing page
│   └── globals.css            # Global Tailwind styles
├── db.ts                      # Drizzle setup and schema (UUID, categories, etc.)
├── lib
│   └── utils.ts               # Shared utility functions
├── next.config.js             # Next.js configuration
├── package.json               # Project dependencies and scripts
├── postcss.config.js          # PostCSS config (used by Tailwind)
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Setup instructions / high-level documentation
```

### 7.1 Explanation of Key Files

1. ✅ **app/api/briefings/route.ts**
   - All CRUD operations for briefings (create, fetch, update).
   - Interacts directly with db.ts.
2. ✅ **app/layout.tsx**
   - Root layout for Next.js pages.
   - Imports globals.css for Tailwind styles.
3. ✅ **app/page.tsx**
   - Main landing page.
   - Could display the initial category selection or a marketing overview.
4. ✅ **db.ts**
   - Contains Redis configuration and schema definitions instead of Drizzle ORM.
5. ✅ **lib/utils.ts**
   - Helper methods for formatting or data manipulation.
6. ✅ **Config Files (next.config.js, postcss.config.js, tailwind.config.js)**
   - Project-level configurations for Next.js, PostCSS, and Tailwind, respectively.

---

## 8. APIs & Endpoints

### 8.1 POST /api/briefings

- ✅ **Purpose:** Create a new briefing.
- ✅ **Request Body (JSON):**

```json
{
  "category": "Web Development",
  "data": {
    "projectName": "New Website",
    "requirements": ["Mobile-Responsive", "SEO-friendly"]
  }
}
```

- ✅ **Response (JSON):**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "category": "Web Development",
  "data": {
    "projectName": "New Website",
    "requirements": ["Mobile-Responsive", "SEO-friendly"]
  },
  "created_at": "2025-03-01T12:34:56.000Z"
}
```

### 8.2 GET /api/briefings?uuid=<UUID>

- ✅ **Purpose:** Fetch an existing briefing by UUID.
- ✅ **Response (JSON):**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "category": "Web Development",
  "data": { ... },
  "created_at": "2025-03-01T12:34:56.000Z",
  "updated_at": "2025-03-01T12:34:56.000Z"
}
```

### 8.3 PUT /api/briefings?uuid=<UUID>

- ✅ **Purpose:** Update an existing briefing.
- ✅ **Request Body (JSON):**

```json
{
  "data": {
    "projectName": "Updated Project Name",
    "requirements": ["Responsive Layout", "User Authentication"]
  }
}
```

- ✅ **Response (JSON):**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "category": "Web Development",
  "data": {
    "projectName": "Updated Project Name",
    "requirements": ["Responsive Layout", "User Authentication"]
  },
  "updated_at": "2025-03-01T13:45:00.000Z"
}
```

---

## 9. Implementation Guidelines

1. ✅ Use Next.js 15 for the modern App Router features and serverless API routes.
2. ❌ Leverage Drizzle ORM for type-safe, flexible interactions with Neon Postgres.
3. ✅ Keep the UI minimal and intuitive, focusing on a step-by-step questionnaire flow.
4. ✅ Implement robust validation on both client and server to avoid incomplete data.
5. ✅ Deploy to Vercel for fast and reliable hosting, taking advantage of its built-in CI/CD.
6. ❌ Enhance for Premium by adding collaboration, encryption, and more extensive branding capabilities.

---

## 10. Risks & Considerations

1. ❌ **Data Privacy:** Must handle personal or sensitive project details responsibly (encryption, row-level security).
2. ✅ **Scalability:** Potential high concurrency if many users generate PDFs simultaneously (may require optimized serverless function or caching).
3. ❌ **PDF Generation:** Large or media-heavy briefs might require careful pagination and performance checks.
4. ✅ **Questionnaire Logic Complexity:** As the number of categories grows, maintaining dynamic logic for questions might become complex (modular design recommended).

---

## 11. Glossary

- ✅ **UUID:** Universally Unique Identifier, a 128-bit label used for unique records.
- ✅ **Markdown:** Lightweight markup language for formatting text.
- ❌ **Drizzle ORM:** A type-safe, SQL-first ORM for Node.js.
- ❌ **Neon Postgres:** A cloud-native Postgres service.
- ✅ **ShadCN UI:** A design system built on top of Tailwind CSS.

---

## 12. Success Metrics

1. ❌ **User Adoption:** Number of new users who complete at least one briefing within 30 days.
2. ❌ **Time to Complete:** Average time from starting a briefing to generating a final PDF.
3. ❌ **Engagement:** Frequency of returning users creating multiple briefings.
4. ❌ **PDF Export Counts:** How often users export their final briefings.
5. ❌ **Premium Upgrades:** Conversion rate from free to premium features.

---

## 13. Additional References

- ✅ **Next.js Documentation:** https://nextjs.org/docs
- ❌ **Drizzle ORM Documentation:** https://orm.drizzle.team/
- ✅ **Tailwind CSS Docs:** https://tailwindcss.com/docs
- ✅ **ShadCN UI:** https://ui.shadcn.com/
- ❌ **jsPDF:** https://github.com/parallax/jsPDF
- ❌ **html2pdf.js:** https://ekoeryanto.github.io/html2pdf.js/
- ❌ **Neon Postgres:** https://neon.tech/

---

## 14. Conclusion

This PRD outlines the vision, requirements, and implementation details for BriefFa.st, ensuring a common understanding across the development team. By adhering to the minimal file structure and following best practices in Next.js, Drizzle ORM, and Tailwind CSS, we aim to ship a streamlined product that meets the needs of freelancers, agencies, and enterprise clients.

_End of Document_
