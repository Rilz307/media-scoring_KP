<h1 align="center">Media Scoring System</h1>

<p align="center">
  <strong>Sistem Verifikasi &amp; Penilaian Media Kerja Sama</strong><br/>
  Aplikasi desktop Electron untuk Dinas Komunikasi dan Informatika (Kominfo) Kota Kendari
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version"/>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?logo=electron" alt="Platform"/>
  <img src="https://img.shields.io/badge/Electron-39-47848F?logo=electron" alt="Electron"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
</p>

---

## Deskripsi

**Media Scoring System** adalah aplikasi desktop berbasis Electron yang menggantikan proses verifikasi dan penilaian media kerja sama yang sebelumnya dilakukan secara manual oleh Tim Verifikator Kominfo Kota Kendari.

Sistem ini mendigitalisasi seluruh alur penilaian:

- **Input data media** (Cetak, Elektronik, Siber/Online)
- **Kalkulasi skor otomatis** berdasarkan 30+ kriteria baku per jenis media
- **Penetapan grade** (A / B / C / Tidak Memenuhi Syarat) secara deterministik
- **Ekspor dokumen PDF** yang sesuai format resmi DOCX Kominfo
- **Pratinjau PDF** di dalam aplikasi sebelum download
- **Penyimpanan cloud** via MongoDB Atlas — data aman dan multi-user

---

## Fitur Utama

| Fitur | Keterangan |
|---|---|
| Manajemen Data Media | Input, edit, hapus data media Cetak / Elektronik / Siber |
| Kalkulasi Skor Otomatis | Skor dihitung real-time dari kriteria yang dikonfigurasi |
| Grade Determination | Grade ditetapkan otomatis dari threshold yang eksplisit |
| Form Dinamis | Form penilaian beradaptasi sesuai jenis media yang dipilih |
| PDF Detail Verifikasi | Laporan individual sesuai format DOCX resmi Kominfo |
| PDF Rekapitulasi | Dokumen "Persetujuan Tim Verifikator" semua media sekaligus |
| PDF Preview System | Pratinjau dalam aplikasi, download hanya jika diinginkan |
| Signature Bottom Anchor | Tanda tangan selalu menempel di bawah halaman terakhir |
| Pagination Engine | Page break otomatis + reserved signature zone (80mm) |
| Portrait-Only Mode | Semua dokumen dipaksa portrait sesuai standar surat pemerintah |
| Zero-Setup Execution | Double-click `.exe` langsung berjalan, tanpa instalasi tambahan |

---

## Tech Stack

| Teknologi | Versi | Fungsi |
|---|---|---|
| [Electron](https://electronjs.org) | 39 | Desktop application shell |
| [React](https://react.dev) | 19 | UI framework (renderer process) |
| [electron-vite](https://electron-vite.org) | 5 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styling |
| [jsPDF](https://github.com/parallax/jsPDF) | 4 | PDF document generation |
| [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) | 5 | Table rendering dalam PDF |
| [MongoDB](https://mongodb.com) | 7 (driver) | Cloud database via Atlas |
| [React Router](https://reactrouter.com) | 7 | Client-side routing |
| [lucide-react](https://lucide.dev) | latest | Icon library |
| [Node.js](https://nodejs.org) | ≥ 18 LTS | Runtime (main process) |
| [electron-builder](https://www.electron.build) | 26 | Production packaging |

---

## Persyaratan Sistem

### Development

| Requirement | Versi Minimum |
|---|---|
| Node.js | **18.x LTS** |
| npm | 9+ |
| OS | Windows 10+, macOS 12+, Ubuntu 20.04+ |
| MongoDB | Atlas cluster aktif |

### End User (Production)

Tidak diperlukan instalasi apapun. Cukup jalankan file `.exe` yang dikompilasi.

---

## Instalasi

### 1. Clone

```bash
git clone https://github.com/your-org/media-scoring-system.git
cd media-scoring-system
```

### 2. Install Dependencies

```bash
npm install
```

> Jika menggunakan Windows dan terjadi error saat `postinstall` (native modules), jalankan sebagai Administrator atau pastikan `windows-build-tools` terpasang.

### 3. Konfigurasi Environment

Salin `.env.example` menjadi `.env` dan isi connection string MongoDB Atlas:

```bash
cp .env.example .env
```

Isi file `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/media_scoring?retryWrites=true&w=majority
```

> **Penting:** Jangan commit file `.env`. File ini sudah masuk `.gitignore`.

### 4. Development

```bash
npm run dev
```

Electron window terbuka otomatis dengan Hot Reload aktif.

### 5. Build Production

```bash
# Windows installer (.exe)
npm run build:win

# macOS (.dmg)
npm run build:mac

# Linux (.AppImage)
npm run build:linux
```

Output tersimpan di `dist/`.

### Troubleshooting

| Masalah | Solusi |
|---|---|
| `MongoServerError: bad auth` | Periksa `MONGODB_URI` di `.env` |
| `ERR_ELECTRON_BUILDER_NOT_INSTALLED` | Jalankan `npm install` ulang |
| Blank screen saat dev | Tunggu Vite dev server siap, reload dengan `Ctrl+R` |
| PDF tidak muncul di preview | Pastikan browser/Electron mendukung `<embed type="application/pdf">` |

---

## Cara Penggunaan

### Input Data Media

1. Buka aplikasi → Dashboard menampilkan daftar media yang tersimpan.
2. Klik **"Tambah Media"**.
3. Isi nama media, perusahaan, jenis (Cetak / Elektronik / Siber), dan alamat.
4. Isi setiap kriteria penilaian — skor kalkulasi otomatis.
5. Klik **"Simpan"** → data tersimpan ke MongoDB Atlas.

### Edit & Hapus

- Klik ikon **Edit** pada baris media di Dashboard.
- Klik ikon **Hapus** → dialog konfirmasi → data dihapus permanen.

### Generate & Preview PDF (Per Media)

1. Klik ikon **Detail** pada baris media.
2. Halaman detail menampilkan skor, grade, dan breakdown verifikasi.
3. Klik **"Export PDF"** → pratinjau terbuka dalam modal.
4. Klik **"Download PDF"** untuk menyimpan, atau **"Tutup Preview"** untuk kembali.

### Generate & Preview Rekapitulasi

1. Di Dashboard, klik **"Export Rekapitulasi"**.
2. Pratinjau PDF "Persetujuan Tim Verifikator" terbuka dalam modal.
3. Dokumen mengelompokkan semua media berdasarkan jenis.
4. Klik **"Download PDF"** atau **"Tutup Preview"**.

---

## Struktur Proyek

```
media-scoring-system/
├── src/
│   ├── main/                          # Electron Main Process (Node.js)
│   │   ├── config/env.js              # Environment variable loader
│   │   ├── database/connection.js     # MongoDB Atlas connection pool
│   │   ├── ipc/media.js               # IPC channel handlers (CRUD)
│   │   ├── repositories/
│   │   │   └── MediaRepository.js     # MongoDB query layer
│   │   └── index.js                   # Electron app entry point
│   │
│   ├── preload/index.js               # contextBridge API (main ↔ renderer bridge)
│   │
│   └── renderer/src/                  # React Renderer Process
│       ├── App.jsx                    # Router root
│       ├── main.jsx                   # React entry point
│       │
│       ├── pages/
│       │   ├── DashboardPage.jsx      # Main page: media table + actions
│       │   ├── MediaDetailPage.jsx    # Detail view + PDF export
│       │   ├── MediaFormPage.jsx      # Add / edit media form
│       │   └── NotFoundPage.jsx       # 404 fallback
│       │
│       ├── components/
│       │   ├── dashboard/             # Dashboard-specific components
│       │   │   ├── ActionBar.jsx
│       │   │   ├── FilterPanel.jsx
│       │   │   ├── GradeBadge.jsx
│       │   │   ├── MediaTable.jsx
│       │   │   ├── ScoreBadge.jsx
│       │   │   └── SearchBar.jsx
│       │   ├── form/                  # Dynamic scoring form components
│       │   │   ├── CriteriaCard.jsx
│       │   │   ├── DynamicForm.jsx
│       │   │   ├── MediaForm.jsx
│       │   │   ├── RadioGroup.jsx
│       │   │   └── ScoreSummary.jsx
│       │   ├── layout/
│       │   │   └── Topbar.jsx
│       │   └── ui/                    # Reusable primitives
│       │       ├── Badge.jsx
│       │       ├── Button.jsx
│       │       ├── Card.jsx
│       │       ├── ConfirmDialog.jsx
│       │       ├── Input.jsx
│       │       ├── PdfPreviewModal.jsx  ← In-app PDF preview modal
│       │       ├── Select.jsx
│       │       └── Table.jsx
│       │
│       ├── pdf/                       # ── PDF Generation System ──
│       │   ├── builders/
│       │   │   └── PdfDocumentBuilder.js   # Layout engine (drawing primitives)
│       │   ├── templates/
│       │   │   ├── MediaSiberTemplate.js   # Siber/online document composer
│       │   │   ├── MediaCetakTemplate.js   # Cetak document composer
│       │   │   ├── MediaElektronikTemplate.js
│       │   │   └── PersetujuanTemplate.js  # Rekapitulasi composer
│       │   ├── services/
│       │   │   └── PdfExportService.js     # Orchestration (no logic here)
│       │   ├── constants/
│       │   │   └── pdfConfig.js            # Font, size, color, margin constants
│       │   ├── config/
│       │   │   └── pdfTemplateMap.js       # Presentation mapping for CETAK layout
│       │   └── fonts/
│       │       └── BookmanOldStyle.js      # Embedded Bookman font (base64 VFS)
│       │
│       ├── utils/
│       │   ├── ReportBuilder.js       # Data normalization — Single Source of Truth
│       │   ├── ScoreCalculator.js     # Score computation per criteria
│       │   └── GradeCalculator.js     # Grade determination from total score
│       │
│       ├── constants/
│       │   ├── mediaCriteria.js       # Criteria definitions per media type
│       │   └── gradeRules.js          # Grade threshold rules
│       │
│       ├── config/
│       │   └── documentSettings.js    # Government entity config (head, verifiers, decree)
│       │
│       └── services/
│           └── MediaService.js        # IPC wrapper (renderer → main process)
│
├── Documents/                         # Official DOCX templates (reference only)
│   ├── format media siber.docx
│   ├── format media cetak.docx
│   ├── format media elektronik.docx
│   └── PERSETUJUAN MEDIA KERJASAMA OLEH TIM VERIFIKATOR.docx
│
├── build/                             # Electron Builder assets
│   ├── icon.ico
│   ├── icon.icns
│   └── icon.png
│
├── resources/icon.png                 # App window icon
├── .env.example                       # Safe environment template
├── .gitignore
├── electron-builder.yml               # Packaging configuration
├── electron.vite.config.mjs           # Vite + Electron config
├── LICENSE
├── package.json
└── README.md
```

---

## Aturan Sistem PDF

### Portrait-Only Rule

Semua dokumen PDF menggunakan orientasi **portrait**. Landscape tidak diizinkan dalam kondisi apapun.

### Cursor Flow System

Semua konten dokumen mengikuti `cursorY` (flow atas-ke-bawah). Setiap fungsi drawing wajib:

1. Memanggil `ensureSpace(height)` sebelum render.
2. Memperbarui `cursorY` setelah render selesai.

### Reserved Signature Zone

Sistem mempertahankan zona cadangan **80mm** (`SIGNATURE_RESERVED_HEIGHT`) dari batas bawah setiap halaman. Tabel dikonfigurasi dengan `margin.bottom` yang diperbesar sehingga tidak dapat masuk ke zona ini.

### Signature Bottom Anchor

Blok tanda tangan selalu menempel di batas bawah halaman terakhir via `pushToBottom()`:

- Simulasi `splitTextToSize` sebelum render → tinggi eksak dihitung.
- `cursorY` dianchor dari bawah: `pageBottom − totalSignatureHeight`.
- Halaman baru dibuat otomatis jika konten sebelumnya tidak memberi cukup ruang.

### PDF Preview Contract

| Langkah | Perilaku |
|---|---|
| User klik Export | Generate PDF di memory (tidak ada file ditulis) |
| Blob URL dibuat | `URL.createObjectURL(blob)` — non-blocking |
| Preview terbuka | `<embed type="application/pdf">` di React Modal |
| Download | `doc.save(filename)` hanya jika user klik tombol |
| Close | `URL.revokeObjectURL(blobUrl)` → state direset → Dashboard utuh |

---

## Konfigurasi Dokumen Pemerintah

Edit `src/renderer/src/config/documentSettings.js` untuk menyesuaikan data instansi:

```js
export default {
  government: {
    region: 'PEMERINTAH KOTA KENDARI',
    department: 'DINAS KOMUNIKASI DAN INFORMATIKA',
    address: 'Jl. ...'
  },
  decree: {
    title: 'PERSETUJUAN MEDIA KERJASAMA ...',
    reference: 'Nomor: ...',
    opening: '...',
    closing: '...'
  },
  verifiers: [
    { title: 'Ketua', name: 'NAMA KETUA', position: 'Jabatan' },
    { title: 'Sekretaris', name: 'NAMA SEKRETARIS', position: 'Jabatan' },
    { title: 'Anggota', name: 'NAMA ANGGOTA', position: 'Jabatan' }
  ],
  head: {
    title: 'Kepala Dinas Komunikasi dan Informatika Kota Kendari',
    name: 'NAMA KEPALA DINAS',
    rank: 'Pembina Utama Muda',
    nip: 'NIP. XXXXXXXXXXXXXXXX'
  }
}
```

---

## Separation of Concerns

| Layer | Tanggung Jawab | Tidak Boleh Ada |
|---|---|---|
| `ReportBuilder` | Normalisasi & mapping data, kalkulasi skor | Layout, PDF drawing |
| `Template Layer` | Urutan section dalam dokumen | Scoring, DB query |
| `PdfDocumentBuilder` | Drawing primitif (teks, tabel, tanda tangan) | Business logic |
| `PdfExportService` | Orchestration: pilih template → builder | Scoring, drawing |
| `React UI` | Input data, trigger export, preview | PDF generation logic |
| `Main Process` | Database CRUD via IPC | UI, PDF |

---

## Pengembangan Lanjutan

| Fitur | Keterangan |
|---|---|
| Dynamic Settings UI | Form untuk ubah `documentSettings` tanpa edit kode |
| Multi-Template Engine | Plugin-style template untuk jenis media baru |
| Batch Export | Export semua laporan dalam satu ZIP |
| Watermark / Stamp | Cap "RAHASIA" atau "SALINAN" pada dokumen |
| Audit Log | Riwayat perubahan data per media + timestamp |
| Role-based Access | Pembatasan akses berdasarkan role pengguna |
| Offline Fallback | Cache lokal saat koneksi Atlas tidak tersedia |

---

## Kontribusi

1. Fork repositori ini.
2. Buat branch: `git checkout -b feat/nama-fitur`
3. Commit: `git commit -m "feat: tambah fitur X"`
4. Push: `git push origin feat/nama-fitur`
5. Buat Pull Request ke `main`.

> Scoring dan grading logic mengikuti aturan baku Kominfo. Perubahan pada logika penilaian harus didiskusikan terlebih dahulu.

---

## Lisensi

Didistribusikan di bawah [MIT License](LICENSE).

---

<p align="center">
  Dikembangkan untuk Dinas Komunikasi dan Informatika Kota Kendari &mdash; 2025
</p>
