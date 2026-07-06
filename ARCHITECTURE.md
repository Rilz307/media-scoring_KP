# ARCHITECTURE.md

# Media Scoring System

Software Architecture Documentation

Version

1.0.0

Project

Kerja Praktik (KP)

Client

Dinas Komunikasi dan Informatika Kota Kendari

---

# 1. System Overview

Media Scoring System adalah aplikasi desktop Windows (.exe) berbasis Electron yang digunakan oleh Tim Verifikator Kominfo Kota Kendari untuk melakukan proses penilaian media kerja sama.

Aplikasi menggunakan arsitektur Hybrid Desktop.

Frontend berjalan secara lokal di komputer pengguna.

Data disimpan di MongoDB Atlas sehingga:

- aman dari kerusakan perangkat
- mendukung multi-user
- dapat diakses dari banyak komputer kantor
- tidak memerlukan sinkronisasi manual

---

# 2. High Level Architecture

                     +-----------------------+
                     |   MongoDB Atlas       |
                     +-----------▲-----------+
                                 |
                                 |
                         Repository Layer
                                 ▲
                                 |
                           IPC Handlers
                                 ▲
                                 |
                           Preload API
                                 ▲
                                 |
                        React Services Layer
                                 ▲
                                 |
                          React Components
                                 ▲
                                 |
                             Electron UI

---

# 3. Electron Architecture

Electron terdiri dari tiga proses utama.

Main Process

Bertanggung jawab terhadap:

- membuka window
- database
- filesystem
- IPC
- keamanan

Renderer Process

Bertanggung jawab terhadap:

- seluruh tampilan
- dashboard
- form
- tabel
- PDF

Preload Process

Menjadi jembatan aman antara Renderer dan Main Process.

Renderer tidak boleh mengakses Node.js secara langsung.

---

# 4. Folder Structure

src/

    main/

        index.js

        ipc/

        database/

        repositories/

    preload/

        index.js

    renderer/

        index.html

        src/

            assets/

            components/

            constants/

            hooks/

            layouts/

            pages/

            services/

            styles/

            utils/

---

# 5. Responsibility

main/

Electron backend.

database/

MongoDB connection.

repositories/

CRUD MongoDB.

ipc/

Seluruh komunikasi IPC.

preload/

Expose API ke Renderer.

renderer/

Frontend React.

services/

Wrapper komunikasi IPC.

components/

Reusable UI Components.

pages/

Halaman aplikasi.

constants/

Static configuration.

utils/

Business Logic.

---

# 6. Data Flow

User

↓

React Component

↓

Service

↓

window.api

↓

Preload

↓

IPC

↓

Repository

↓

MongoDB Atlas

↓

Repository

↓

IPC

↓

Preload

↓

Service

↓

React

↓

UI Update

---

# 7. Database Architecture

Database

media_scoring

Collections

media

---

Document

{
"_id": "...",

    "nama_media": "",

    "perusahaan": "",

    "jenis": "",

    "answers": {},

    "totalScore": 0,

    "grade": "",

    "createdAt": "",

    "updatedAt": ""

}

---

# 8. Business Flow

Pegawai membuka aplikasi

↓

Dashboard tampil

↓

Melihat daftar media

↓

Tambah Media

↓

Pilih jenis media

↓

Dynamic Form dibuat otomatis

↓

Input seluruh kriteria

↓

Auto Score

↓

Auto Grade

↓

Save

↓

MongoDB Atlas

↓

Dashboard Update

↓

Export PDF

---

# 9. Dynamic Form Architecture

Media Type

↓

Load mediaCriteria.js

↓

Generate Criteria

↓

Generate Radio Group

↓

Hitung Score

↓

Hitung Grade

↓

Preview

↓

Save

Tidak boleh membuat tiga form berbeda.

Harus menggunakan satu Dynamic Form Engine.

---

# 10. Scoring Architecture

Media Criteria

↓

Selected Answers

↓

Score Calculator

↓

Total Score

↓

Grade Calculator

↓

Grade

Seluruh perhitungan dilakukan pada utilitas.

Komponen React hanya menampilkan hasil.

---

# 11. Search Flow

Dashboard

↓

Search Bar

↓

Service

↓

IPC

↓

Repository

↓

MongoDB

↓

Filtered Result

↓

Dashboard

---

# 12. Filter Flow

Dashboard

↓

Filter Panel

↓

Repository Query

↓

MongoDB

↓

Filtered Data

↓

Dashboard

---

# 13. PDF Flow

Dashboard

↓

Select Media

↓

Report Service

↓

PDF Helper

↓

jsPDF

↓

Download

---

# 14. Rekap Flow

Dashboard

↓

Rekap Button

↓

Load All Media

↓

Generate Table

↓

Official Template

↓

PDF

↓

Download

---

# 15. CRUD Flow

Create

User

↓

Form

↓

Validation

↓

Score

↓

Repository

↓

MongoDB

Read

Dashboard

↓

Repository

↓

MongoDB

Update

Detail

↓

Edit

↓

Repository

↓

MongoDB

Delete

Dashboard

↓

Delete Button

↓

Confirmation

↓

Repository

↓

MongoDB

---

# 16. Service Layer

MediaService

Responsibilities

- getAll()
- getById()
- insert()
- update()
- delete()
- search()
- filter()

ReportService

Responsibilities

- exportDetail()
- exportRekap()

---

# 17. Repository Layer

MediaRepository

Responsibilities

Insert

Update

Delete

Find

Find By Id

Search

Filter

Repository hanya berisi komunikasi database.

Tidak boleh ada UI.

---

# 18. Utility Layer

ScoreCalculator

Menghitung total skor.

GradeCalculator

Menentukan grade.

PDFHelper

Utility PDF.

---

# 19. Constants

mediaCriteria.js

Berisi seluruh kriteria media.

gradeRules.js

Berisi aturan grade.

Komponen React tidak boleh melakukan hardcode.

---

# 20. Security

Renderer tidak boleh mengetahui URI MongoDB.

MongoDB hanya berada pada Main Process.

Renderer hanya menggunakan window.api.

Node Integration tetap disabled.

Context Isolation tetap enabled.

---

# 21. Technology Stack

Desktop

Electron 39

Electron Vite 5

Frontend

React 19

JavaScript

Tailwind CSS v4

Database

MongoDB Atlas

Official mongodb Driver

Packaging

Electron Builder

PDF

jsPDF

Environment

dotenv

---

# 22. Design Principles

Single Responsibility Principle

Separation of Concerns

Component Reusability

Data Driven UI

Modular Architecture

Production Ready

Maintainability

Scalability

---

# 23. Coding Rules

JavaScript only.

Do not use TypeScript.

Do not access MongoDB from React.

Do not duplicate forms.

Business Logic must stay inside utils.

Database Logic must stay inside repositories.

IPC must be separated by feature.

Always follow latest official documentation.

---

# 24. Future Expansion

Authentication

User Management

Audit Log

Export Excel

Dark Mode

Cloud Backup

Image Upload

Statistics Dashboard

Notification

Role Management

---

# 25. Development Workflow

Milestone 1
Foundation
✔ Completed

Milestone 2
Frontend Foundation
✔ Completed

Milestone 3
Database
✔ Completed

Milestone 4
CRUD
✔ Completed

Milestone 5
Dynamic Form Engine
✔ Completed

Milestone 6
Auto Scoring
✔ Completed

Milestone 7
Dashboard Features & PDF Export
✔ Completed

Milestone 8
Production Build (Configuration)
✔ Completed

Milestone 9
Testing & UAT
⚪ Pending

Milestone 10
Production Release
⚪ Pending

Milestone 3

MongoDB Integration

🟡 Current

Milestone 4

CRUD

Milestone 5

Dynamic Form

Milestone 6

Scoring Engine

Milestone 7

PDF

Milestone 8

Production Build

---

# 26. Final Goal

Production-ready Windows desktop application (.exe)

Features

✔ Dashboard

✔ CRUD

✔ Dynamic Form

✔ Auto Score

✔ Auto Grade

✔ Search

✔ Filter

✔ PDF Detail

✔ PDF Rekap

✔ MongoDB Atlas

✔ Multi-user

✔ Electron Desktop

✔ Windows Installer

Designed for real operational use at Dinas Kominfo Kota Kendari.
