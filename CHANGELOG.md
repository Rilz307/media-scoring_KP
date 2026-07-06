# Changelog

All notable changes to this project will be documented in this file.

This project follows a milestone-based development process.

# [1.0.0] - 2024-XX-XX

## Milestone 8 - Production Packaging

### Added

- **Electron Builder Configuration**: Implemented `.electron-builder.yml` to support multi-platform packaging (Windows, macOS, Linux).
- **Zero-Setup Execution**: Configured `package.json` build scripts for creating self-contained executables that require no end-user installation.
- **Resource Management**: Bundled necessary assets including application icon (`resources/icon.png`).
- **Production Build Target**: Finalized Vite and Electron compilation targets for production readiness.

## Milestone 7 - Official Document Generation (Strict Template Engine)

### Added

- **PDF Configuration Layer**: Created `src/renderer/src/pdf/constants/pdfConfig.js` holding base typography, margin metrics, and formal government styling configurations.
- **Presentation Mapping Config**: Implemented `src/renderer/src/pdf/config/pdfTemplateMap.js` to decouple document-specific terminology mappings (e.g., `pdfSubUraian`, `pdfStatus`) from the assessment domain (`mediaCriteria.js`).
- **Template Mappers**: Added `MediaSiberTemplate.js`, `MediaCetakTemplate.js`, `MediaElektronikTemplate.js`, and `PersetujuanTemplate.js` to translate the canonical `ReportBuilder` object into structural drawing rows.
- **PDF Document Builder**: Built `PdfDocumentBuilder.js` applying pure drawing APIs (`jspdf`, `jspdf-autotable`) to visually replicate the official DOCX layouts exactly, including dynamic row spanning.
- **Export Service Orchestrator**: Established `PdfExportService.js` to orchestrate data translation (from `ReportBuilder` through the selected Template Mapper) into PDF generation.
- **Media Detail UI Integration**: Integrated the "Export PDF" button to trigger official document generation with graceful error handling states.

## Milestone 6 - Scoring Workflow & Assessment Engine Refinement (Revised)

### Added

- **ReportBuilder Normalization Layer**: Created `src/renderer/src/utils/ReportBuilder.js` as the single reusable normalization layer that maps raw database media objects to structured assessment configurations for details, print reports, and future export operations.
- **Dynamic Score Breakdown**: Integrated section subtotals and individual question evaluations dynamically on the Media Detail page using the `ReportBuilder` layer.
- **Dynamic Dashboard Statistics Header**: Implemented a responsive statistics block displaying total media, average scores, extreme scores (highest/lowest), and dynamic counts aggregated by media type, protected against empty database states.
- **Form Progress Metrics**: Added real-time answered counts, unanswered counts, and fill-rate percentage displays inside the `ScoreSummary` component.
- **Integrity Validation Checks**: Enforced payload integrity validations checking for finite scores, valid answers object shape, and complete mandatory evaluations before submission.

### Refactored

- **Single Source of Truth Scoring**: Moved section evaluation sub-calculations to `ScoreCalculator.js` as a public API (`calculateSectionScore`) to keep scoring rules strictly contained within the scoring module and isolated from the presentation layers.

## Milestone 5 - Dynamic Assessment Engine Infrastructure

### Added

- **Configuration Layer**:
  - Populated `src/renderer/src/constants/mediaCriteria.js` with structured configuration criteria lists for SIBER, CETAK, and ELEKTRONIK media.
  - Populated `src/renderer/src/constants/gradeRules.js` with an enabled status toggle and default thresholds.
- **Calculators**:
  - Created `src/renderer/src/utils/ScoreCalculator.js` to dynamically compute points from selected answers and the loaded configuration list.
  - Created `src/renderer/src/utils/GradeCalculator.js` to map total scores to grade designations if enabled.
- **UI Components**:
  - Created `src/renderer/src/components/form/RadioGroup.jsx` as a reusable custom selector with option point badges.
  - Created `src/renderer/src/components/form/CriteriaCard.jsx` to wrap individual questions, details, and selection options.
  - Created `src/renderer/src/components/form/ScoreSummary.jsx` to render a live preview card showing computed total score and grade.
  - Created `src/renderer/src/components/form/DynamicForm.jsx` to render sections, titles, and criteria cards dynamically based on media categories.
- **Integrated CRUD & Details**:
  - Integrated `DynamicForm` and `ScoreSummary` inside `MediaForm.jsx`.
  - Added required text input field for "Nama Perusahaan" inside `MediaForm.jsx`.
  - Updated form validation to enforce completion of all questions marked as `required`.
  - Updated `MediaDetailPage.jsx` to dynamically render assessment categories, questions, selected answers, points, and total score/grade indicators.
  - Updated `DashboardPage.jsx` to gracefully render fallback symbols if grading rules are disabled.

## Milestone 4 - CRUD Operations

### Completed

- **Phase A: Backend CRUD Foundation**:
  - Repository: Added `create()`, `update()`, and `delete()` functions in `MediaRepository.js` with validation and automatic timestamping (`createdAt` and `updatedAt`).
  - IPC Layer: Registered namespaced IPC channels `media:create`, `media:update`, and `media:delete` inside `src/main/ipc/media.js`.
  - Preload: Exposed `create()`, `update()`, and `delete()` methods in `src/preload/index.js` securely.
  - Service Layer: Exposed wrapper methods `create()`, `update()`, and `delete()` inside `src/renderer/src/services/MediaService.js`.
- **Phase B: Frontend CRUD Integration**:
  - Components: Created `MediaForm.jsx` supporting form layouts and field validation (required name, email format, website URL, valid phone characters). Created reusable `ConfirmDialog.jsx` for delete confirmations.
  - Detail Page: Updated `MediaDetailPage.jsx` to render media fields in read-only mode, and format timestamps in Indonesian locale (e.g., WITA timezone).
  - Form Page: Configured `MediaFormPage.jsx` to handle both Create and Edit actions, page loading states, saving status disabled locks, and failure alerts with retries.
  - Routing: Adjusted `App.jsx` to map the editing path (`/media/:id/edit`).
  - Dashboard: Mapped action clicks to page routes, binded delete actions to the confirm modal, and resolved success toast notifications using React Router location states.

## Milestone 3 - MongoDB Integration

### Completed

- **Phase A: Backend Foundation**:
  - Sprint 3.0: Created main process project directories (`config/`, `database/`, `repositories/`, `ipc/`).
  - Sprint 3.1: Installed runtime dependencies `mongodb` and `dotenv`.
  - Sprint 3.2: Integrated environment loader/validator in `src/main/config/env.js` and created `.env.example`.
  - Sprint 3.3: Built MongoDB Atlas connection manager in `src/main/database/connection.js` and integrated with app launch/quit lifecycle.
  - Sprint 3.4: Designed read-only data access repository `src/main/repositories/MediaRepository.js` (implementing `getAll` and `getById`).
- **Phase B: IPC and Renderer Integration**:
  - Sprint 3.5: Registered namespaced IPC handlers (`media:getAll` and `media:getById`) in `src/main/ipc/media.js` and exposed them securely in `src/preload/index.js`.
  - Sprint 3.6: Created React-facing service manager `src/renderer/src/services/MediaService.js` to encapsulate IPC window calls.
  - Sprint 3.7: Integrated database data fetching into `DashboardPage.jsx` complete with loading indicators, empty tables, and network failure fallback states.
  - Architecture Improvement: Decoupled connection tear-down from the window-level scope to the application-level lifecycle by migrating logic to the `before-quit` event.
- **UI/UX Refinements (Pre-Milestone 4)**:
  - Part 1: Replaced sidebar with a dark, modern top header navigation panel incorporating NavLink routing for Dashboard and Rekapitulasi. Deleted Sidebar component.
  - Part 2: Restructured Dashboard Page header to focus on single primary "+ Tambah Media" action.
  - Part 3 & 4: Upgraded Dashboard Table layout to feature structured column headers including "Terakhir Dimodifikasi" bound to MongoDB `updatedAt`/`createdAt` timestamps with clean Date parsing.
  - Part 5: Implemented frontend Sort By dropdown (supporting name A-Z/Z-A, highest/lowest scores, grade, and modification times).
  - Part 6 & 7: Redesigned Empty and Error states to display prominent Lucide icons (FileText / AlertTriangle) and structured guidelines for database connectivity issues.
  - Part 8: Added lightweight pulsing row skeletons to replace simple loading text.

---

### Milestone 4 - Dashboard

- Dashboard statistics
- Dashboard cards
- Media table
- Search media
- Filter media
- Sorting
- Pagination

---

### Milestone 5 - Dynamic Form Engine

- Dynamic form rendering
- Media type selector
- Criteria engine
- Auto rendering based on configuration
- Score preview
- Validation

---

### Milestone 6 - CRUD

- Insert media
- Update media
- Delete media
- Detail page
- Confirmation dialog

---

### Milestone 7 - PDF

- Detail PDF
- Rekapitulasi PDF
- Official Kominfo template
- Auto download

---

### Milestone 8 - Production Build

- Windows EXE
- Installer
- Production configuration
- Environment configuration
- Final testing

---

# 0.2.0 - Completed

## Milestone 2 - Frontend Foundation

### Added

- Tailwind CSS v4
- React Router DOM
- Frontend architecture planning
- Modular folder structure

Created folders

- assets
- components
- constants
- hooks
- layouts
- pages
- services
- styles
- utils

Created page placeholders

- DashboardPage
- MediaFormPage
- MediaDetailPage
- NotFoundPage

Created layout placeholder

- MainLayout

Created constants

- mediaCriteria
- gradeRules

Created services

- MediaService
- ReportService

Created utilities

- ScoreCalculator
- GradeCalculator
- PDFHelper

Created component categories

Layout

- Sidebar
- Topbar

Dashboard

- MediaTable
- SearchBar
- FilterPanel
- ScoreBadge
- GradeBadge

Form

- DynamicForm
- CriteriaCard
- RadioGroup
- ScoreSummary

PDF

- DetailReport
- RekapReport

Completed Dashboard MVP

- MainLayout
- Sidebar
- Topbar
- Dashboard UI
- Search UI
- Filter UI
- Media Table
- Dummy Media Data
- Action Buttons

### Changed

Project architecture redesigned.

Instead of manual Electron structure:

Electron

↓

main.js

↓

preload.js

Project now follows Electron Vite official structure.

src/

main/

preload/

renderer/

Renderer architecture changed.

Old concept

React

↓

window.api

↓

MongoDB

New concept

React

↓

Services

↓

window.api

↓

Preload

↓

IPC

↓

Repository

↓

MongoDB

### Decisions

Use Electron Vite official template.

Do not manually configure Electron.

Follow latest official documentation.

Install dependencies only when needed.

Avoid deprecated packages.

---

# [0.1.0] - Completed

## Milestone 1 - Project Initialization

### Added

Created Electron Vite project.

Installed

- Electron 39
- Electron Vite 5
- React 19
- Vite 7
- Electron Builder 26
- ESLint 9
- Prettier 3

Configured

- React (JavaScript)
- Electron Main Process
- Electron Preload
- Renderer Process
- Hot Reload
- Build System

### Verified

Electron Window launches successfully.

React renders correctly.

Tailwind integration prepared.

Build scripts available.

Development server working.

### Decisions

Use JavaScript only.

Do not use TypeScript.

Use Electron Builder.

Use React.

Use Tailwind CSS.

Target Windows desktop application.

---

# Development Notes

## Architecture Principles

- Desktop-first
- Modular architecture
- Production-ready code
- Cloud database
- Multi-user support
- Zero setup for users

---

## Technology Decisions

Chosen

- Electron
- Electron Vite
- React
- Tailwind CSS
- MongoDB Atlas
- Electron Builder
- jsPDF

Rejected

- TypeScript
- Redux
- Zustand
- Express.js
- Next.js
- Local database

---

## Current Status

Current Version

1.0.0

Current Milestone

Milestone 8 (Packaging) - Completed, Milestone 9/10 (UAT & Release) - Pending

Progress

Feature Complete (Release Candidate)

Current Focus

Testing, Bug Fixes, and Final Preparation for Release.

Next Immediate Goal

Conduct User Acceptance Testing (UAT) at Dinas Kominfo Kota Kendari.

Next Major Goal

---

## Release Goal

Version 1.0.0

Production-ready desktop application for Dinas Kominfo Kota Kendari.

Features

- Dashboard
- CRUD
- Dynamic Form
- Auto Scoring
- Auto Grade
- Search
- Filter
- PDF Export
- Rekapitulasi
- MongoDB Atlas
- Windows EXE
