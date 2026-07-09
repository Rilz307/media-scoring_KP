# PROJECT_CONTEXT.md

# Media Scoring System

**Project Kerja Praktik (KP)**

Instansi:
Dinas Komunikasi dan Informatika (Kominfo) Kota Kendari

---

# Project Overview

Media Scoring System adalah aplikasi desktop Windows (.exe) berbasis Electron yang digunakan oleh Tim Verifikator Kominfo Kota Kendari untuk melakukan proses verifikasi dan penilaian media kerja sama.

Aplikasi ini menggantikan proses penilaian manual menjadi sistem digital yang:

- melakukan input data media
- menghitung skor otomatis
- menentukan grade hasil verifikasi
- menyimpan data secara aman di cloud
- mendukung multi-user
- menghasilkan dokumen PDF

Target utama adalah aplikasi production-ready yang benar-benar dapat digunakan pegawai Kominfo.

---

# Current Development Status

Current Version

v1.0.0

Current Milestone

Milestone 9 (Testing & UAT) - Active (Release Candidate stage)

Project Progress

Feature Complete (Release Candidate)

## Current Project Status

- Core Features: Completed
- PDF Detail: Completed
- PDF Rekapitulasi: Functional (minor layout refinement may remain)
- Electron Packaging: Implemented
- Documentation: Updated
- Repository Cleanup: Ongoing
- User Acceptance Testing (UAT): Pending
- Production Release: Pending

## Known Limitations

- Layout PDF Rekapitulasi belum sepenuhnya identik dengan template DOCX.
- Belum terdapat mekanisme auto update aplikasi.
- Belum dilakukan User Acceptance Testing (UAT) pada lingkungan pengguna akhir.

---

# Milestone Progress

## Milestone 1 — Project Initialization

Status

✅ COMPLETED

Completed

- Electron Vite Project Created
- React (JavaScript)
- Electron 39
- Electron Vite 5
- React 19
- Vite 7
- Electron Builder 26
- ESLint 9
- Prettier 3
- Hot Reload Working
- Electron Window Running
- Production Build Ready

Notes

Project uses the official Electron Vite template.

No manual Electron configuration.

---

## Milestone 2 — Frontend Foundation

Status

✅ COMPLETED

Completed

- Tailwind CSS v4 installed
- React Router configured
- Project folder structure completed
- MainLayout implemented
- Sidebar implemented
- Topbar implemented
- Dashboard MVP completed
- Search UI completed
- Filter UI completed
- Media table with dummy data completed
- Action buttons prepared (Detail, Edit, Delete)
- Rekapitulasi button prepared

---

## Milestone 3 — MongoDB Integration

Status

✅ COMPLETED

Target

Electron Main Process

↓

IPC

↓

Repository

↓

MongoDB Atlas

Renderer MUST NEVER communicate directly with MongoDB.

---

## Milestone 4 — CRUD

Status

✅ COMPLETED

Features

- Create Media
- Read Media
- Update Media
- Delete Media

---

## Milestone 5 — Dynamic Form Engine

Status

✅ COMPLETED

Goal

Single Dynamic Form

Media Type

↓

Load Configuration

↓

Generate Form Automatically

There must NOT be three separate hardcoded forms.

---

## Milestone 6 — Auto Scoring

Status

✅ COMPLETED

Responsibilities

- Calculate score
- Calculate total score
- Calculate grade

---

## Milestone 7 — PDF

Status

✅ COMPLETED

Features

- Detail PDF
- Rekapitulasi PDF

---

## Milestone 8 — EXE Packaging

Status

✅ COMPLETED

Target

Generate production-ready Windows installer (.exe)

---

# Technology Stack

Desktop

Electron 39

Electron Vite 5

Frontend

React 19

JavaScript

Tailwind CSS v4

React Router DOM

Database

MongoDB Atlas

Official mongodb Driver

Desktop Packaging

Electron Builder

PDF

Electron Native printToPDF() (HTML-to-PDF)

Environment

dotenv

---

# Architecture

Renderer

↓

Services

↓

window.api

↓

Preload

↓

IPC Handler

↓

Repository

↓

MongoDB Atlas

Important

Renderer MUST NEVER access MongoDB directly.

Only Main Process may communicate with MongoDB.

---

# Folder Structure

Current

src/
main/
config/
ConfigRepository.js
ConfigService.js
database/
connection.js
ipc/
database.js
media.js
pdf.js
repositories/
MediaRepository.js
index.js

    preload/
        index.js

    renderer/
        index.html
        src/
            App.jsx
            main.jsx
            assets/
            components/
                dashboard/
                form/
                layout/
                startup/
                ui/
            context/
                ConnectionContext.js
            documents/
                builders/
                renderer/
                templates/
            pages/
                DashboardPage.jsx
                MediaDetailPage.jsx
                MediaFormPage.jsx
                NotFoundPage.jsx
                StartupPage.jsx
            pdf/
                config/
                constants/
                services/
            services/
                MediaService.js
            styles/
            utils/
                ReportBuilder.js
                ScoreCalculator.js
                GradeCalculator.js
                MongoErrorTranslator.js

---

# Planned Components

Layout

Sidebar.jsx

Topbar.jsx

Dashboard

MediaTable.jsx

SearchBar.jsx

FilterPanel.jsx

ScoreBadge.jsx

GradeBadge.jsx

Form

DynamicForm.jsx

CriteriaCard.jsx

RadioGroup.jsx

ScoreSummary.jsx

PDF

DetailReport.jsx

RekapReport.jsx

---

# Business Flow

Pegawai Kominfo membuka aplikasi.

↓

Dashboard tampil.

↓

Melihat seluruh media yang pernah diverifikasi.

↓

Tambah media baru.

↓

Pilih jenis media.

↓

Dynamic Form muncul.

↓

Mengisi seluruh kriteria.

↓

Sistem menghitung skor otomatis.

↓

Sistem menentukan grade.

↓

Data disimpan ke MongoDB Atlas.

↓

Media muncul pada Dashboard.

↓

Pegawai dapat:

- edit
- delete
- search
- filter
- export PDF
- cetak rekap

---

# Database

Database

media_scoring

Collection

media

Document Example

{
"_id": "...",

    "nama_media": "",

    "perusahaan": "",

    "jenis": "SIBER",

    "answers": {},

    "totalScore": 0,

    "grade": "",

    "createdAt": "",

    "updatedAt": ""

}

---

# Dynamic Form Concept

There must only be ONE Dynamic Form Engine.

Workflow

Choose Media Type

↓

Load mediaCriteria.js

↓

Render Components Automatically

↓

Calculate Score

↓

Save

No duplicated forms.

---

# Scoring Rules

There are three media types:

- SIBER
- ELEKTRONIK
- CETAK

Each media type has different criteria.

Criteria are stored inside:

constants/mediaCriteria.js

Scoring follows predefined score values.

Total score determines the grade. The system maps the final score to configured grade labels and thresholds (for example, predikat such as "Tingkat I" to "Tingkat IV"). The file constants/gradeRules.js serves as the single source of truth for these grade rules and thresholds.

---

# Planned Services

MediaService

Responsible for

- Get All Media
- Get By Id
- Insert
- Update
- Delete
- Search
- Filter

PdfExportService (Implemented under src/renderer/src/pdf/services/)

Responsible for

- Detail PDF
- Rekap PDF

---

# Implemented Utilities

ScoreCalculator

- Calculate total score and section sub-scores.

GradeCalculator

- Determine grade based on rules configuration.

ReportBuilder

- Normalize raw MongoDB documents for presentation (Single Source of Truth).

MongoErrorTranslator

- Translate database and network error messages into friendly Indonesian messages.

(Note: Legacy helpers PDFHelper, ValidationHelper, and DateHelper were bypassed or replaced by inline/native operations).

---

# Coding Principles

Use JavaScript only.

Do NOT use TypeScript.

Follow official documentation.

Avoid deprecated packages.

Prefer modular architecture.

Keep components small.

Separate UI from Business Logic.

Separate Business Logic from Database.

React components should only render UI.

---

# Current Decisions

Chosen Stack

Electron Vite

Reason

Modern official architecture.

React

Reason

Suitable for dynamic UI.

MongoDB Atlas

Reason

Cloud database

Multi-user

Safe from local computer failure

Tailwind CSS

Reason

Fast UI development

Electron Builder

Reason

Windows installer generation

---

# Packages Installed

Electron

Electron Builder

Electron Vite

React

React DOM

Tailwind CSS v4

React Router DOM

ESLint

Prettier

---

# Packages Installed

Semua paket utama yang direncanakan (`mongodb`, `dotenv`, dll.) telah terinstal dan terkonfigurasi secara aktif dalam berkas `package.json` untuk mendukung alur operasi penuh. Paket `jspdf` dan `jspdf-autotable` telah dihapus sepenuhnya dari dependencies karena migrasi ke native HTML-to-PDF.

---

# Future Features

Dashboard Statistics

Search

Advanced Filter

Sorting

CRUD

Dynamic Form

Auto Scoring

Auto Grade

PDF Detail

PDF Rekap

Cloud Database

Multi-user

---

# Design Philosophy

Desktop-first.

Zero setup for users.

Single EXE installer.

Modern architecture.

Minimal dependencies.

Production-ready code.

Maintainable folder structure.

---

# Current Next Task

Prepare for Milestone 9 (Testing & UAT). Ensure packaging validation and testing is completed successfully before final release.

---

# Instructions for Any AI Assistant

When continuing this project:

- Do not recreate the project.
- Use the existing Electron Vite structure.
- Do not replace the architecture.
- Do not migrate to TypeScript.
- Do not use Redux.
- Do not use Zustand.
- Do not introduce Express.js.
- Do not access MongoDB from React.
- All database operations must go through Electron IPC.
- Always follow the latest official documentation for Electron, Electron Vite, React, Tailwind CSS, and MongoDB.

Continue from the current milestone instead of restarting.
