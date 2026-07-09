# DEVELOPMENT_ROADMAP.md

# Media Scoring System

Development Roadmap

Project

Kerja Praktik

Dinas Komunikasi dan Informatika Kota Kendari

Current Version

1.0.0

Current Milestone

Milestone 9 (Testing & UAT) - Active (Release Candidate stage)

Project Progress

Feature Complete (Release Candidate ready)

---

# Development Philosophy

This project follows an incremental milestone-based development process.

Each milestone must be fully completed before moving to the next.

Every milestone must produce a working application.

Never leave partially implemented features.

---

# Overall Development Flow

Milestone 1

↓

Foundation

↓

Milestone 2

↓

Frontend Foundation

↓

Milestone 3

↓

MongoDB Integration

↓

Milestone 4

↓

CRUD

↓

Milestone 5

↓

Dynamic Form Engine

↓

Milestone 6

↓

Auto Scoring

↓

Milestone 7

↓

Dashboard Features

↓

Milestone 8

↓

PDF Export

↓

Milestone 9

↓

Testing

↓

Milestone 10

↓

Production Build

---

===========================================================
MILESTONE 1
PROJECT INITIALIZATION
===========================================================

STATUS

✅ COMPLETED

Objectives

Create modern Electron project.

Tasks

[x] Electron Vite

[x] React

[x] JavaScript

[x] Electron Builder

[x] Hot Reload

[x] Production Build

Definition of Done

Application starts successfully.

Electron window appears.

Hot reload works.

---

===========================================================
MILESTONE 2
FRONTEND FOUNDATION
===========================================================

STATUS

✅ COMPLETED

Goal

Build frontend architecture.

---

Task 2.1

Tailwind Setup

Status

✅ Completed

Tasks

[x] Install Tailwind

[x] Configure Tailwind

[x] Test utility classes

---

Task 2.2

Folder Structure

Status

✅ Completed

Tasks

[x] Components

[x] Pages

[x] Services

[x] Constants

[x] Utils

[x] Layouts

[x] Hooks

[x] Styles

---

Task 2.3

Routing

Status

✅ Completed

Tasks

[x] React Router

[x] MainLayout

[x] Topbar

[x] Dashboard Route

[x] Rekap Route

---

Task 2.4

Dashboard UI

Status

✅ Completed

Tasks

[x] Statistics Cards

[x] Search Bar

[x] Filter Panel

[x] Add Media Button

[x] Rekap Button

[x] Media Table

[x] Empty State

---

Task 2.5

Reusable Components

Status

✅ Completed

Tasks

[x] Button

[x] Card

[x] Modal

[x] Badge

[x] Loading

[x] Empty Data

Definition of Done

Dashboard completely navigable.

No mockup remaining.

---

===========================================================
MILESTONE 3
DATABASE
===========================================================

STATUS

✅ COMPLETED

Goal

Connect Electron to MongoDB Atlas.

---

Task 3.1

MongoDB

[x]

Install mongodb

[x]

Install dotenv

[x]

Create .env

---

Task 3.2

Database Layer

[x]

database/

connection.js

[x]

database/client.js

---

Task 3.3

Repository Layer

[x]

MediaRepository

Methods

getAll()

getById()

create()

update()

delete()

search()

filter()

---

Task 3.4

IPC

[x]

ipc/media.js

[x]

ipc/report.js

---

Task 3.5

Preload

Expose

window.api.media

window.api.report

---

Task 3.6

Testing

Insert

Read

Update

Delete

Definition of Done

Dashboard successfully loads data from MongoDB.

---

===========================================================
MILESTONE 4
CRUD
===========================================================

STATUS

✅ COMPLETED

---

Task

Media Form

[x]

Create Media

[x]

Edit Media

[x]

Delete Media

[x]

Detail Page

[x]

Validation

Definition of Done

CRUD completely functional.

---

===========================================================
MILESTONE 5
DYNAMIC FORM ENGINE
===========================================================

STATUS

✅ COMPLETED

Goal

One form engine for all media.

---

Tasks

[x]

Load mediaCriteria.js

[x]

Generate Form

[x]

Generate Radio Button

[x]

Score Preview

[x]

Validation

Definition of Done

Changing media type changes form automatically.

No duplicated forms.

---

===========================================================
MILESTONE 6
AUTO SCORING
===========================================================

STATUS

✅ COMPLETED

---

Tasks

[x]

ScoreCalculator

[x]

GradeCalculator

[x]

Live Total Score

[x]

Live Grade

[x]

Store Score

Definition of Done

Score calculated automatically.

---

===========================================================
MILESTONE 7
DASHBOARD FEATURES
===========================================================

STATUS

✅ COMPLETED

Tasks

[x]

Dashboard Cards

[x]

Search

[x]

Filter

[x]

Sorting

[x]

Pagination

[x]

Detail Drawer

Definition of Done

Dashboard fully interactive.

---

===========================================================
MILESTONE 8
PDF EXPORT
===========================================================

STATUS

✅ COMPLETED

Tasks

[x]

Install jsPDF

[x]

Install AutoTable

[x]

Detail PDF

[x]

Rekap PDF

[x]

Official Header

[x]

Kominfo Signature

Definition of Done

Generated PDF matches official document.

---

===========================================================
MILESTONE 9
TESTING & UAT
===========================================================

STATUS

🟡 IN PROGRESS (Release Candidate validation stage)

Tasks

[ ]

CRUD Test

[ ]

Filter Test

[ ]

Search Test

[ ]

Scoring Test

[ ]

PDF Test

[ ]

Stress Test

[ ]

Multi User Test

Definition of Done

No critical bugs.

---

===========================================================
MILESTONE 10
PRODUCTION BUILD
===========================================================

STATUS

🟢 IMPLEMENTED (Configuration ready, final compilation pending UAT sign-off)

Tasks

[x]

Build EXE

[x]

Installer

[x]

Icons

[x]

Metadata

[ ]

Test Clean Windows

Definition of Done

Application installable on another PC.

---

# Project Directory Checklist

src/

[✓] renderer

[✓] main

[✓] preload

renderer/

[✓] pages

[✓] layouts

[✓] services

[✓] constants

[✓] components

[✓] utils

[✓] hooks

[✓] styles

---

# Planned Components

Layout

[x] Sidebar

[x] Topbar

Dashboard

[x] MediaTable

[x] SearchBar

[x] FilterPanel

[x] ScoreBadge

[x] GradeBadge

Form

[x] DynamicForm

[x] CriteriaCard

[x] RadioGroup

[x] ScoreSummary

PDF

[x] DetailReport

[x] RekapReport

---

# Planned Services

MediaService

[x] getAll

[x] getById

[x] create

[x] update

[x] delete

[x] search

[x] filter

PdfExportService (Implemented under src/renderer/src/pdf/services/)

[x] detail

[x] rekap

---

# Utilities Implemented

[x] ScoreCalculator (computes scores)

[x] GradeCalculator (determines grades)

[x] ReportBuilder (normalizes raw data for presentation)

[x] MongoErrorTranslator (translates database/network errors)

(Note: PDFHelper, ValidationHelper, and DateHelper were bypassed or replaced by inline/native operations).

---

# Planned Constants

mediaCriteria

gradeRules

appConfig

---

# Planned Database Collections

media

Future

users

audit_logs

settings

---

# Quality Rules

✓ Small reusable components

✓ No duplicated code

✓ One responsibility per file

✓ UI separated from business logic

✓ Business logic separated from database

✓ MongoDB only through IPC

✓ Latest official documentation

✓ No deprecated packages

✓ Production-ready architecture

---

# Current Sprint

Sprint Goal

Testing & UAT Preparation

Current Tasks

1.

Lakukan pengujian manual awal untuk alur CRUD & dynamic forms

↓

2.

Validasi hasil ekspor HTML-to-PDF terhadap format dokumen pemerintah

↓

3.

Selaraskan seluruh dokumentasi Markdown (.md) dengan kode aktual

---

# Blocking Issues

None

---

# Definition of Project Completion

Application can:

✓ Open directly from Windows.

✓ No localhost setup.

✓ Connect to MongoDB Atlas.

✓ Support multiple office computers.

✓ Input media.

✓ Edit media.

✓ Delete media.

✓ Search media.

✓ Filter media.

✓ Calculate score automatically.

✓ Determine grade automatically.

✓ Export Detail PDF.

✓ Export Rekap PDF.

✓ Generate Windows Installer.

✓ Ready for deployment at Dinas Kominfo Kota Kendari.
