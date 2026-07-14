<h1 align="center">Media Scoring System</h1>

<p align="center">
  <strong>Sistem Verifikasi &amp; Penilaian Media Kerja Sama</strong><br/>
  Aplikasi desktop Electron untuk Dinas Komunikasi dan Informatika (Kominfo) Kota Kendari
</p>

  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version"/>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?logo=electron" alt="Platform"/>
  <img src="https://img.shields.io/badge/Electron-39-47848F?logo=electron" alt="Electron"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
</p>

---

## Status Proyek

Aplikasi saat ini berada pada tahap **Release Candidate (RC)**.

- Core Features: **Completed**
- PDF Detail & Rekapitulasi: **Functional** (Minor layout refinement may remain)
- Electron Packaging: **Implemented** (Configuration)
- Documentation: **Updated**
- Repository Cleanup: **Ongoing**
- User Acceptance Testing (UAT): **Pending**
- Production Release: **Pending**

### Known Limitations

- Layout PDF Rekapitulasi belum sepenuhnya identik dengan template DOCX.
- Belum terdapat mekanisme _auto-update_ aplikasi.
- Belum dilakukan UAT (User Acceptance Testing) pada lingkungan komputer pengguna akhir secara meluas.

---

---

## Deskripsi

**Media Scoring System** adalah aplikasi desktop berbasis Electron yang menggantikan proses verifikasi dan penilaian media kerja sama yang sebelumnya dilakukan secara manual oleh Tim Verifikator Kominfo Kota Kendari.

Sistem ini mendigitalisasi seluruh alur penilaian:

- **Input data media** (Cetak, Elektronik, Siber/Online)
- **Kalkulasi skor otomatis** berdasarkan kriteria baku per jenis media
- **Penetapan grade** secara deterministik
- **Ekspor dokumen PDF** yang sesuai format resmi DOCX Kominfo
- **Penyimpanan cloud** via MongoDB Atlas — data aman dan mendukung penggunaan multi-user

---

## Screenshots

_(Belum ada tangkapan layar yang ditambahkan. Anda dapat menambahkan *screenshot* setelah rilis final UI selesai disusun)._

---

## Fitur Utama

| Fitur                   | Keterangan                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Manajemen Data Media    | Input, edit, hapus data media Cetak / Elektronik / Siber                                                               |
| Kalkulasi Skor Otomatis | Skor dihitung real-time dari kriteria yang dikonfigurasi                                                               |
| Grade Determination     | Grade ditetapkan otomatis dari threshold skor yang dikonfigurasi dan label predikat (misalnya Tingkat I–IV)            |
| Form Dinamis            | Form penilaian beradaptasi sesuai jenis media yang dipilih                                                             |
| PDF Detail Verifikasi   | Laporan individual sesuai format DOCX resmi Kominfo                                                                    |
| PDF Rekapitulasi        | Dokumen "Persetujuan Tim Verifikator" semua media sekaligus yang menampilkan predikat grade aktual masing-masing media |
| PDF Preview System      | Pratinjau dalam aplikasi, download hanya jika diinginkan                                                               |
| Signature Bottom Anchor | Tanda tangan selalu menempel di bawah halaman terakhir                                                                 |
| Pagination Engine       | Page break otomatis + reserved signature zone (80mm)                                                                   |
| Portrait-Only Mode      | Semua dokumen dipaksa portrait sesuai standar surat pemerintah                                                         |
| Zero-Setup Execution    | Double-click `.exe` langsung berjalan, tanpa instalasi tambahan                                                        |

---

## Tech Stack

| Teknologi                                                                                                | Versi      | Fungsi                          |
| -------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------- |
| [Electron](https://electronjs.org)                                                                       | 39         | Desktop application shell       |
| [React](https://react.dev)                                                                               | 19         | UI framework (renderer process) |
| [electron-vite](https://electron-vite.org)                                                               | 5          | Build tool & dev server         |
| [Tailwind CSS](https://tailwindcss.com)                                                                  | 4          | Styling                         |
| [Electron PrintToPDF](https://www.electronjs.org/docs/latest/api/web-contents#contentsprinttopdfoptions) | Native     | Headless HTML-to-PDF generation |
| [MongoDB](https://mongodb.com)                                                                           | 7 (driver) | Cloud database via Atlas        |
| [React Router](https://reactrouter.com)                                                                  | 7          | Client-side routing             |
| [lucide-react](https://lucide.dev)                                                                       | latest     | Icon library                    |
| [Node.js](https://nodejs.org)                                                                            | ≥ 18 LTS   | Runtime (main process)          |
| [electron-builder](https://www.electron.build)                                                           | 26         | Production packaging            |

---

## Persyaratan Sistem

### Development

| Requirement | Versi Minimum                         |
| ----------- | ------------------------------------- |
| Node.js     | **18.x LTS**                          |
| npm         | 9+                                    |
| OS          | Windows 10+, macOS 12+, Ubuntu 20.04+ |
| MongoDB     | Atlas cluster aktif                   |

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

### 3. Konfigurasi Database (Dynamic In-App Setup)

Aplikasi ini menggunakan **Dynamic In-App Configuration Settings**. Anda tidak wajib mengonfigurasi file `.env` di lingkungan produksi maupun pengembangan.

Pada startup pertama kali, aplikasi akan mendeteksi status koneksi database. Jika belum dikonfigurasi, Anda akan diarahkan secara otomatis ke halaman **Startup / Connection Manager** untuk memasukkan MongoDB Atlas Connection URI Anda melalui GUI.

Konfigurasi ini disimpan secara otomatis dalam file `config.json` pada folder data pengguna (`userData`).

Untuk lingkungan pengembangan (development) atau sebagai acuan baseline, Anda dapat membuat file `.env` dari `.env.example` sebagai referensi format URI.

### 4. Development

Menjalankan environment development dengan Hot Reloading Vite:

```bash
npm run dev
```

### 5. Build

Perintah build dasar akan melakukan kompilasi dari kode React (renderer) dan Electron (main):

```bash
npm run build
```

### 6. Packaging

Untuk membuat installer yang siap didistribusikan, jalankan perintah berikut:

```bash
# Windows installer (.exe)
npm run build:win

# macOS (.dmg)
npm run build:mac

# Linux (.AppImage)
npm run build:linux
```

Output tersimpan di dalam folder `dist/`.

### 7. Cara Menjalankan Hasil Build

Navigasikan ke folder `dist/` (setelah proses _packaging_ selesai), cari file yang berekstensi `.exe` (untuk Windows), kemudian lakukan instalasi atau jalankan aplikasinya secara langsung. Tidak dibutuhkan langkah pra-syarat tambahan.

---

### Troubleshooting

| Masalah                              | Solusi                                                               |
| ------------------------------------ | -------------------------------------------------------------------- |
| `MongoServerError: bad auth`         | Periksa `MONGODB_URI` di `.env`                                      |
| `ERR_ELECTRON_BUILDER_NOT_INSTALLED` | Jalankan `npm install` ulang                                         |
| Blank screen saat dev                | Tunggu Vite dev server siap, reload dengan `Ctrl+R`                  |
| PDF tidak muncul di preview          | Pastikan browser/Electron mendukung `<embed type="application/pdf">` |

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
│   │   ├── config/
│   │   │   ├── ConfigRepository.js    # Local JSON config reader/writer
│   │   │   └── ConfigService.js       # App configuration manager
│   │   ├── database/connection.js     # MongoDB Atlas connection pool
│   │   ├── ipc/
│   │   │   ├── database.js            # DB settings IPC listeners
│   │   │   ├── media.js               # CRUD IPC channel handlers
│   │   │   └── pdf.js                 # Headless HTML-to-PDF printing IPC
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
│       │   ├── NotFoundPage.jsx       # 404 fallback
│       │   └── StartupPage.jsx        # DB status indicator / setup fallback
│       │
│       ├── context/
│       │   └── ConnectionContext.js   # DB connection React Context
│       │
│       ├── components/
│       │   ├── dashboard/             # Dashboard-specific components
│       │   │   ├── ActionBar.jsx
│       │   │   ├── FilterPanel.jsx
│       │   │   ├── GradeBadge.jsx
│       │   │   ├── MediaTable.jsx
│       │   │   ├── ScoreBadge.jsx
│       │   │   ├── SearchBar.jsx
│       │   │   └── SearchFilter.jsx
│       │   ├── form/                  # Dynamic scoring form components
│       │   │   ├── CriteriaCard.jsx
│       │   │   ├── DynamicForm.jsx
│       │   │   ├── MediaForm.jsx
│       │   │   ├── RadioGroup.jsx
│       │   │   └── ScoreSummary.jsx
│       │   ├── layout/
│       │   │   ├── ConnectionGuard.jsx  # Route gate for DB connection status
│       │   │   └── Topbar.jsx
│       │   ├── startup/
│       │   │   └── ConnectionManager.jsx # On-the-fly database settings form
│       │   └── ui/                    # Reusable primitives
│       │       ├── Badge.jsx
│       │       ├── Button.jsx
│       │       ├── Card.jsx
│       │       ├── ConfirmDialog.jsx
│       │       ├── Input.jsx
│       │       ├── PdfPreviewModal.jsx  # In-app HTML preview modal (iframe)
│       │       ├── Select.jsx
│       │       └── Table.jsx
│       │
│       ├── documents/                 # ── PDF HTML-to-PDF Engine ──
│       │   ├── builders/
│       │   │   ├── MediaDetailViewModel.js  # Prepares media detail presentation data
│       │   │   └── RekapitulasiViewModel.js # Prepares print summary list data
│       │   ├── renderer/
│       │   │   └── HtmlPdfRenderer.js  # Injects data to HTML & handles print IPC
│       │   └── templates/
│       │       ├── media-detail.html   # HTML layout for single assessment sheet
│       │       └── rekapitulasi.html   # HTML layout for summary sheet
│       │
│       ├── pdf/                       # ── PDF Configuration Layer ──
│       │   ├── services/
│       │   │   └── PdfExportService.js     # Orchestration (no layout logic)
│       │   ├── constants/
│       │   │   └── pdfConfig.js            # Base typography & symbol config
│       │   └── config/
│       │       └── pdfTemplateMap.js       # Presentation mapping for CETAK layout
│       │
│       │   ├── ReportBuilder.js       # Data normalization — Single Source of Truth
│       │   ├── ScoreCalculator.js     # Score computation per criteria
│       │   ├── GradeCalculator.js     # Grade determination from total score
│       │   └── MongoErrorTranslator.js # Translate database errors to user-friendly messages
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

Semua dokumen PDF menggunakan orientasi **portrait**. Landscape tidak diizinkan dalam kondisi apapun. Ini dikontrol via CSS di dalam file template menggunakan aturan `@page { size: F4 portrait; }` atau `size: Legal portrait;`.

### CSS Page-Break Handling

Tabel dan baris tabel diatur menggunakan CSS agar menghindari pemisahan baris di tengah-tengah halaman secara buruk (`page-break-inside: avoid;`).

### Signature Placement

Tanda tangan diposisikan secara teratur di bawah dokumen cetak menggunakan flexbox layouting dan margin atas yang disesuaikan dalam HTML template.

### PDF Preview & Download Contract

| Langkah          | Perilaku                                                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User klik Export | ViewModel memetakan record data media ke representasi HTML                                                                                               |
| Render HTML      | Penggabungan data ViewModel ke template HTML (`media-detail.html` atau `rekapitulasi.html`)                                                              |
| Preview terbuka  | String HTML dimuat ke dalam `iframe` dengan attribute `srcDoc` secara cepat dan aman                                                                     |
| Download         | Mengirim string HTML ke Main Process via IPC handler `pdf:printHtml` yang memicu browser window tersembunyi untuk memanggil `printToPDF()` secara native |

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

| Layer              | Tanggung Jawab                                      | Tidak Boleh Ada     |
| ------------------ | --------------------------------------------------- | ------------------- |
| `ReportBuilder`    | Normalisasi & mapping data, kalkulasi skor          | Layout, HTML markup |
| `ViewModel`        | Pemetaan data normalized ke format presentasi HTML  | Database query      |
| `HTML Templates`   | Layout, font styling, dan susunan tabel resmi       | Business logic      |
| `HtmlPdfRenderer`  | Merender template HTML & trigger print IPC          | Styling, DB query   |
| `PdfExportService` | Orchestration: panggil builder ViewModel & template | UI Rendering logic  |
| `React UI`         | Input data, trigger preview (iframe), download      | PDF buffer printing |
| `Main Process`     | Database CRUD & Native PDF conversion via IPC       | UI, HTML generation |

---

## Roadmap

Aplikasi saat ini sudah mencapai tahapan **Release Candidate (RC)**. Pengembangan lanjutan akan berfokus pada fitur berikut:

- [ ] Dynamic Settings UI (konfigurasi nama instansi dan pejabat secara _on-the-fly_)
- [ ] Multi-Template Engine untuk jenis media baru
- [ ] Fitur Batch Export laporan
- [ ] Sistem Audit Log untuk riwayat perubahan data
- [ ] Manajemen Role (Admin, Verifikator, Pimpinan)
- [ ] Mode _offline fallback_ ketika MongoDB tidak dapat diakses

---

## Kontribusi

Kami sangat menghargai kontribusi dalam bentuk pull requests, laporan bug, atau saran fitur.

1. Fork repositori ini.
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

> **Catatan:** Logika penilaian dan gradasi merujuk pada aturan baku Dinas Kominfo. Perubahan terhadap aturan _scoring_ wajib didiskusikan dan disetujui terlebih dahulu.

---

## License

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

---

## Acknowledgements

- **Dinas Komunikasi dan Informatika Kota Kendari** atas dukungan operasional.
- Seluruh tim _open source_ di balik [Electron](https://electronjs.org), [React](https://react.dev), dan ekosistem modern web development.

---

<p align="center">
  Dikembangkan untuk Dinas Komunikasi dan Informatika Kota Kendari &mdash; 2025
</p>
