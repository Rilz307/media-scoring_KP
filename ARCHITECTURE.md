# Architecture

Media Scoring System — Dinas Komunikasi dan Informatika (Kominfo) Kota Kendari.

Dokumen ini adalah sumber arsitektur yang berlaku. Status fitur ada di `README.md`, riwayat perubahan di `CHANGELOG.md`, dan panduan untuk AI agent di `AGENTS.md`.

---

## 1. Overview

Aplikasi desktop berbasis Electron yang menggantikan proses verifikasi dan penilaian media kerja sama (Cetak, Elektronik, Siber) yang sebelumnya manual. Aplikasi menghitung skor otomatis, menetapkan grade, menyimpan data di MongoDB Atlas (multi-user), dan mengekspor dokumen PDF sesuai format resmi Dinas.

Arsitektur **hybrid desktop**: frontend React berjalan lokal, data tersimpan di cloud.

---

## 2. Tech Stack

| Teknologi             | Versi  | Fungsi                                    |
| --------------------- | ------ | ----------------------------------------- |
| Electron              | 39     | Application shell (main + preload)        |
| React                 | 19     | UI framework (renderer) — JavaScript saja |
| electron-vite         | 5      | Build tool & dev server                   |
| Tailwind CSS          | 4      | Styling                                   |
| React Router DOM      | 7      | Client-side routing (`HashRouter`)        |
| lucide-react          | 1      | Ikon                                      |
| mongodb (driver)      | 7      | MongoDB Atlas                             |
| Electron `printToPDF` | native | HTML-to-PDF                               |
| electron-builder      | 26     | Packaging installer                       |

Proyek **JavaScript murni — tanpa TypeScript**.

---

## 3. Process Model & Security

| Proses   | Lokasi         | Tanggung jawab                                           |
| -------- | -------------- | -------------------------------------------------------- |
| Main     | `src/main`     | Membuka window, koneksi database, filesystem, IPC, PDF   |
| Preload  | `src/preload`  | Jembatan aman `contextBridge` → `window.api`             |
| Renderer | `src/renderer` | Seluruh tampilan React (dashboard, form, tabel, preview) |

Aturan keamanan:

- **Renderer tidak boleh mengakses MongoDB atau Node.js secara langsung.** Semua lewat `window.api`.
- URI MongoDB hanya diketahui Main Process; tidak pernah dikirim ke renderer.
- `contextIsolation` aktif; window PDF dibuat dengan `nodeIntegration: false`.

---

## 4. Folder Structure

```
src/
├── main/                              # Electron Main Process (Node.js)
│   ├── index.js                       # Entry point aplikasi
│   ├── config/
│   │   ├── ConfigRepository.js        # Baca/tulis config.json di userData
│   │   ├── ConfigService.js           # Manajemen konfigurasi aplikasi
│   │   └── attachmentConfig.js        # Batas ukuran/jumlah attachment
│   ├── database/
│   │   └── connection.js              # Koneksi & state machine MongoDB Atlas
│   ├── ipc/
│   │   ├── media.js                   # Handler CRUD media
│   │   ├── database.js                # Handler koneksi & konfigurasi DB
│   │   ├── pdf.js                     # Handler printToPDF
│   │   └── attachments.js             # Handler upload/download GridFS
│   └── repositories/
│       ├── MediaRepository.js              # Query collection `media`
│       ├── AttachmentRepository.js         # Provider wrapper (indirection)
│       └── GridFsAttachmentRepository.js   # Implementasi GridFS
│
├── preload/
│   └── index.js                       # contextBridge → window.api
│
└── renderer/
    ├── index.html
    └── src/
        ├── App.jsx                    # Root router (HashRouter)
        ├── main.jsx                   # Entry React
        ├── layouts/MainLayout.jsx
        ├── pages/                     # Dashboard, MediaForm, MediaDetail, Startup, NotFound
        ├── context/                   # ConnectionContext, StorageStatsContext
        ├── services/                  # MediaService, AttachmentService (wrapper IPC)
        ├── utils/                     # ReportBuilder, ScoreCalculator, GradeCalculator,
        │                              #   MongoErrorTranslator, imageCompressor
        ├── constants/                 # mediaCriteria.js, gradeRules.js
        ├── config/documentSettings.js # Identitas instansi & pejabat dokumen resmi
        ├── documents/                 # ── PDF Engine ──
        │   ├── builders/              # MediaDetailViewModel, RekapitulasiViewModel
        │   ├── renderer/HtmlPdfRenderer.js
        │   └── templates/             # media-detail.html, rekapitulasi.html
        ├── pdf/                       # ── PDF Configuration Layer ──
        │   ├── config/pdfTemplateMap.js
        │   ├── constants/pdfConfig.js
        │   └── services/PdfExportService.js
        ├── components/
        │   ├── dashboard/  form/  layout/  startup/  ui/
        └── assets/                    # main.css
```

Direktori non-kode di root:

- `Documents/` — template DOCX resmi & Perwali sebagai acuan layout PDF (referensi saja).
- `build/` — aset electron-builder (ikon, entitlements macOS).
- `resources/` — ikon window.

---

## 5. Data Flow

```
React Component
  → Service (MediaService / AttachmentService / PdfExportService)
  → window.api (preload bridge)
  → IPC handler (src/main/ipc/*)
  → Repository (src/main/repositories/*)
  → MongoDB Atlas
```

Kebalikannya untuk hasil. Renderer **hanya** memakai `window.api`; tidak ada akses langsung ke database.

---

## 6. Database

Database: **`media_scoring`**.

Collection **`media`** — dokumen:

```json
{
  "_id": "ObjectId",
  "nama_media": "",
  "perusahaan": "",
  "jenis": "SIBER | ELEKTRONIK | CETAK",
  "answers": {},
  "totalScore": 0,
  "grade": "",
  "attachments": [{ "fileId": "", "originalName": "", "mimeType": "", "size": 0 }],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Penyimpanan berkas: **GridFS bucket `attachments`** (`attachments.files`, `attachments.chunks`), metadata `mimeType`. Batas di `src/main/config/attachmentConfig.js`:

- Maks 10 MB per berkas
- Maks 10 berkas per media
- Maks 30 MB total per media
- Kuota penyimpanan 512 MB (Atlas Free Tier)

Menghapus media otomatis menghapus berkas GridFS terkait (`MediaRepository.delete`). Semua `_id` diserialisasi menjadi string saat menyeberang IPC.

---

## 7. Configuration Storage

Konfigurasi koneksi **tidak** dibaca dari `.env`. Disimpan sebagai `config.json` di folder `userData` Electron (`app.getPath('userData')`) melalui `ConfigService` + `ConfigRepository`, dan diisi lewat GUI (StartupPage → ConnectionManager).

- `dotenv` terdaftar di `package.json` tetapi **tidak dipakai** di source. `.env.example` hanya acuan format connection string.
- **Dev vs produksi memakai userData berbeda.** Saat `!app.isPackaged`, `src/main/index.js` memanggil `app.setPath('userData', <appData>/media-scoring-system-dev)`. Build terpaket tetap memakai `media-scoring-system`. Path config dihitung lazy oleh `ConfigRepository`. Ini mencegah `config.json` dev bocor ke aplikasi hasil build (yang membuat build terlihat "sudah login").
- State machine koneksi: `NOT_CONFIGURED` → `CONNECTING` → `CONNECTED` / `FAILED`; `DISCONNECTED`.
- Perubahan state dikirim ke renderer lewat event `db:connection-state-changed`.

---

## 8. IPC Contract

Semua channel didaftarkan di `src/main/ipc/*` dan diekspos di `src/preload/index.js`. Untuk menambah IPC: buat handler di ipc, daftarkan di `src/main/index.js`, lalu tambahkan ke `window.api`.

| Grup          | Channel                                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `media`       | `media:getAll`, `media:getById`, `media:create`, `media:update`, `media:delete`                                                                                               |
| `db`          | `db:getConnectionStatus`, `db:retryConnection`, `db:testConnection`, `db:getConfig`, `db:saveConfig`, `db:disconnect`, `db:forgetConfig`, event `db:connection-state-changed` |
| `pdf`         | `pdf:printHtml`                                                                                                                                                               |
| `attachments` | `attachment:upload`, `attachment:download`, `attachment:getBuffer`, `attachment:openNative`, `attachment:delete`, `attachment:getStorageStats`                                |

Handler melempar error ke renderer; pesan ramah pengguna dihasilkan `MongoErrorTranslator`.

---

## 9. Scoring & Grade

- `constants/mediaCriteria.js` — definisi kriteria per jenis media (SIBER / ELEKTRONIK / CETAK).
- `utils/ScoreCalculator.js` — menghitung skor per section dan total.
- `constants/gradeRules.js` — **single source of truth** threshold & label grade (predikat). Komponen React tidak boleh hardcode grade.
- `utils/GradeCalculator.js` — menentukan grade dari total skor.
- `utils/ReportBuilder.js` — normalisasi dokumen MongoDB untuk presentasi (UI & dokumen).

Dynamic form engine tunggal berdasarkan `mediaCriteria.js`; tidak boleh ada form hardcoded per jenis media.

---

## 10. PDF Engine (HTML-to-PDF)

Alur:

```
Data record
  → ViewModel (documents/builders)
  → kompilasi HTML (documents/templates)
  → HtmlPdfRenderer.render(...)
  → preview: iframe srcDoc
  → download: IPC pdf:printHtml
  → Main Process: hidden BrowserWindow.printToPDF({ preferCSSPageSize, printBackground, landscape: false })
  → PDF buffer disimpan
```

Aturan: **portrait-only** (F4/Legal) via `@page` pada CSS template; jangan ubah layout/font/margin template tanpa alasan kuat karena harus identik dengan format resmi Dinas (`Documents/*.docx`).

---

## 11. Design Principles

- Single Responsibility & Separation of Concerns.
- Business logic hanya di `utils/`; tidak ada query DB di sana.
- Logic database hanya di `repositories/`; tidak ada UI di sana.
- IPC dipisah per fitur.
- Data-driven UI; komponen React hanya menampilkan.

---

## 12. Status

Release Candidate (v1.0.0). Core features, PDF detail & rekapitulasi, dan packaging selesai. UAT dan rilis produksi masih tertunda. Lihat `README.md` untuk daftar known limitations.
