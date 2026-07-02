# DEVELOPMENT_ROADMAP.md

# Media Scoring System

Development Roadmap

Project

Kerja Praktik

Dinas Komunikasi dan Informatika Kota Kendari

Current Version

0.2.0

Current Milestone

Milestone 3

Project Progress

≈30%

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

🟡 In Progress

Tasks

[x] React Router

[x] MainLayout

[x] Sidebar

[x] Topbar

[x] Dashboard Route

[x] Rekap Route

---

Task 2.4

Dashboard UI

Status

Not Started

Tasks

[ ] Statistics Cards

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

Not Started

Tasks

[ ] Button

[ ] Card

[ ] Modal

[ ] Badge

[ ] Loading

[ ] Empty Data

Definition of Done

Dashboard completely navigable.

No mockup remaining.

---

===========================================================
MILESTONE 3
DATABASE
===========================================================

STATUS

NOT STARTED

Goal

Connect Electron to MongoDB Atlas.

---

Task 3.1

MongoDB

[ ]

Install mongodb

[ ]

Install dotenv

[ ]

Create .env

---

Task 3.2

Database Layer

[ ]

database/

connection.js

[ ]

database/client.js

---

Task 3.3

Repository Layer

[ ]

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

[ ]

ipc/media.js

[ ]

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

NOT STARTED

---

Task

Media Form

[ ]

Create Media

[ ]

Edit Media

[ ]

Delete Media

[ ]

Detail Page

[ ]

Validation

Definition of Done

CRUD completely functional.

---

===========================================================
MILESTONE 5
DYNAMIC FORM ENGINE
===========================================================

STATUS

NOT STARTED

Goal

One form engine for all media.

---

Tasks

[ ]

Load mediaCriteria.js

[ ]

Generate Form

[ ]

Generate Radio Button

[ ]

Score Preview

[ ]

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

NOT STARTED

---

Tasks

[ ]

ScoreCalculator

[ ]

GradeCalculator

[ ]

Live Total Score

[ ]

Live Grade

[ ]

Store Score

Definition of Done

Score calculated automatically.

---

===========================================================
MILESTONE 7
DASHBOARD FEATURES
===========================================================

STATUS

NOT STARTED

Tasks

[ ]

Dashboard Cards

[ ]

Search

[ ]

Filter

[ ]

Sorting

[ ]

Pagination

[ ]

Detail Drawer

Definition of Done

Dashboard fully interactive.

---

===========================================================
MILESTONE 8
PDF EXPORT
===========================================================

STATUS

NOT STARTED

Tasks

[ ]

Install jsPDF

[ ]

Install AutoTable

[ ]

Detail PDF

[ ]

Rekap PDF

[ ]

Official Header

[ ]

Kominfo Signature

Definition of Done

Generated PDF matches official document.

---

===========================================================
MILESTONE 9
TESTING
===========================================================

STATUS

NOT STARTED

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

NOT STARTED

Tasks

[ ]

Build EXE

[ ]

Installer

[ ]

Icons

[ ]

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

[ ] Sidebar

[ ] Topbar

Dashboard

[ ] MediaTable

[ ] SearchBar

[ ] FilterPanel

[ ] ScoreBadge

[ ] GradeBadge

Form

[ ] DynamicForm

[ ] CriteriaCard

[ ] RadioGroup

[ ] ScoreSummary

PDF

[ ] DetailReport

[ ] RekapReport

---

# Planned Services

MediaService

[ ] getAll

[ ] getById

[ ] create

[ ] update

[ ] delete

[ ] search

[ ] filter

ReportService

[ ] detail

[ ] rekap

---

# Planned Utilities

ScoreCalculator

GradeCalculator

PDFHelper

ValidationHelper

DateHelper

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

Complete MongoDB Atlas Integration

Current Tasks

1.

Install mongodb

↓

2.

Create MongoDB Connection

↓

3.

Create Repository Layer

↓

4.

Create IPC Handlers

↓

5.

Connect Dashboard to MongoDB

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
