# Changelog

All notable changes to this project will be documented in this file.

This project follows a milestone-based development process.

---

# [Unreleased]

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

0.2.0

Current Milestone

Milestone 3

Progress

Approximately 15%

Current Focus

MongoDB Atlas Integration

Next Immediate Goal

Connect Electron Main Process to MongoDB Atlas.

Implement IPC communication.

Create Repository Layer.

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
