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

Aplikasi berada pada tahap **Release Candidate (RC)**.

- Core Features: **Completed**
- PDF Detail & Rekapitulasi: **Functional** (minor layout refinement may remain)
- Attachments (GridFS): **Implemented**
- Electron Packaging: **Implemented** (configuration)
- Dokumentasi: **Updated**
- User Acceptance Testing (UAT): **Pending**
- Production Release: **Pending**

### Known Limitations

- Layout PDF Rekapitulasi belum sepenuhnya identik dengan template DOCX.
- Belum terdapat mekanisme _auto-update_ aplikasi.
- Belum dilakukan UAT pada lingkungan komputer pengguna akhir secara meluas.

---

## Deskripsi

**Media Scoring System** menggantikan proses verifikasi dan penilaian media kerja sama yang sebelumnya dilakukan manual oleh Tim Verifikator Kominfo Kota Kendari. Sistem mendigitalisasi seluruh alur: input data media, kalkulasi skor otomatis, penetapan grade, unggah dokumen pendukung, ekspor PDF sesuai format resmi, dan penyimpanan cloud via MongoDB Atlas (multi-user).

---

## Fitur Utama

| Fitur                   | Keterangan                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Manajemen Data Media    | Input, edit, hapus data media Cetak / Elektronik / Siber                                  |
| Kalkulasi Skor Otomatis | Skor dihitung real-time dari kriteria yang dikonfigurasi                                  |
| Grade Determination     | Grade ditetapkan dari threshold & label predikat yang dikonfigurasi                       |
| Form Dinamis            | Form penilaian beradaptasi sesuai jenis media (satu engine, tanpa form hardcoded)         |
| Attachment Pendukung    | Unggah/preview/unduh/hapus dokumen pendukung (GridFS), dengan indikator kuota penyimpanan |
| PDF Detail Verifikasi   | Laporan individual sesuai format DOCX resmi Kominfo                                       |
| PDF Rekapitulasi        | Dokumen "Persetujuan Tim Verifikator" semua media dengan predikat grade aktual            |
| PDF Preview System      | Pratinjau dalam aplikasi (iframe), unduh hanya jika diinginkan                            |
| Signature Bottom Anchor | Tanda tangan menempel di bawah halaman terakhir                                           |
| Pagination Engine       | Page break otomatis + reserved signature zone (80mm)                                      |
| Portrait-Only Mode      | Semua dokumen portrait sesuai standar surat pemerintah                                    |
| Zero-Setup Execution    | Double-click `.exe` langsung berjalan, tanpa instalasi tambahan                           |

---

## Tech Stack

| Teknologi             | Versi    | Fungsi                          |
| --------------------- | -------- | ------------------------------- |
| Electron              | 39       | Desktop application shell       |
| React                 | 19       | UI framework (renderer process) |
| electron-vite         | 5        | Build tool & dev server         |
| Tailwind CSS          | 4        | Styling                         |
| Electron `printToPDF` | Native   | Headless HTML-to-PDF generation |
| MongoDB (driver)      | 7        | Cloud database via Atlas        |
| React Router          | 7        | Client-side routing             |
| lucide-react          | latest   | Icon library                    |
| Node.js               | ≥ 18 LTS | Runtime (main process)          |
| electron-builder      | 26       | Production packaging            |

Proyek menggunakan **JavaScript murni** (tanpa TypeScript).

---

## Persyaratan Sistem

### Development

| Requirement | Versi Minimum                         |
| ----------- | ------------------------------------- |
| Node.js     | **18.x LTS** (disarankan 20+)         |
| npm         | 9+                                    |
| OS          | Windows 10+, macOS 12+, Ubuntu 20.04+ |
| MongoDB     | Atlas cluster aktif                   |

### End User (Production)

Tidak diperlukan instalasi runtime tambahan. Cukup jalankan file hasil build.

---

## Instalasi

### 1. Clone

```bash
git clone https://github.com/Rilz307/media-scoring_KP.git
cd media-scoring_KP
```

### 2. Install Dependencies

```bash
npm install
```

> Jika terjadi error saat `postinstall` (native modules) di Windows, jalankan sebagai Administrator atau pastikan build tools terpasang.

### 3. Konfigurasi Database (Dynamic In-App Setup)

Aplikasi memakai **Dynamic In-App Configuration**. Anda **tidak perlu** membuat file `.env` untuk menjalankan aplikasi.

Saat startup pertama, aplikasi mendeteksi status koneksi. Jika belum dikonfigurasi, Anda diarahkan ke halaman **Startup / Connection Manager** untuk memasukkan MongoDB Atlas Connection URI lewat GUI. Konfigurasi disimpan otomatis di `config.json` pada folder `userData` Electron.

> Catatan: `.env` **tidak dibaca** oleh aplikasi (`dotenv` tidak digunakan di source). `.env.example` hanya acuan format connection string.

### 4. Development

```bash
npm run dev
```

### 5. Build

```bash
npm run build
```

Kompilasi main & renderer ke folder `out/`.

### 6. Packaging

```bash
npm run build:win     # Windows installer (.exe / portable)
npm run build:mac     # macOS (.dmg)
npm run build:linux   # Linux (AppImage / snap / deb)
```

Output tersimpan di folder `dist/`.

### 7. Menjalankan Hasil Build

Setelah packaging selesai, jalankan file di `dist/` (mis. `.exe` untuk Windows). Tidak ada langkah pra-syarat tambahan.

---

## Perintah Tersedia

| Perintah              | Fungsi                                        |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Development server (hot reload)               |
| `npm run build`       | Build main + renderer ke `out/`               |
| `npm start`           | Preview hasil build (`electron-vite preview`) |
| `npm run lint`        | ESLint (`eslint --cache .`)                   |
| `npm run format`      | Prettier (`prettier --write .`)               |
| `npm run build:win`   | Build + packaging Windows                     |
| `npm run build:mac`   | Build + packaging macOS                       |
| `npm run build:linux` | Build + packaging Linux                       |
| `npm run dist`        | Build + packaging Windows (alias)             |

> Belum ada test runner otomatis. Verifikasi dilakukan manual.

---

## Troubleshooting

| Masalah                              | Solusi                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| `MongoServerError: bad auth`         | Perbaiki URI lewat Connection Manager di aplikasi (bukan `.env`)             |
| `ERR_ELECTRON_BUILDER_NOT_INSTALLED` | Jalankan `npm install` ulang                                                 |
| Blank screen saat dev                | Tunggu Vite dev server siap, reload dengan `Ctrl+R`                          |
| PDF tidak muncul di preview          | Pastikan renderer mendukung `<iframe srcDoc>`                                |
| Gagal unggah attachment              | Periksa batas ukuran (lihat `src/main/config/attachmentConfig.js`) dan kuota |

---

## Cara Penggunaan

### Input Data Media

1. Dashboard menampilkan daftar media tersimpan.
2. Klik **"Tambah Media"**, isi nama, perusahaan, jenis (Cetak / Elektronik / Siber), dan alamat.
3. Isi kriteria penilaian — skor kalkulasi otomatis.
4. (Opsional) Unggah dokumen pendukung pada bagian attachment.
5. Klik **"Simpan"** → data tersimpan ke MongoDB Atlas.

### Edit & Hapus

- Klik ikon **Edit** pada baris media.
- Klik ikon **Hapus** → dialog konfirmasi → data (dan attachment terkait) dihapus permanen.

### Generate & Preview PDF (Per Media)

1. Klik ikon **Detail** pada baris media.
2. Halaman detail menampilkan skor, grade, dan breakdown verifikasi.
3. Klik **"Export PDF"** → pratinjau terbuka dalam modal.
4. **"Download PDF"** untuk menyimpan, atau **"Tutup Preview"** untuk kembali.

### Generate & Preview Rekapitulasi

1. Di Dashboard, klik **"Export Rekapitulasi"**.
2. Pratinjau PDF "Persetujuan Tim Verifikator" terbuka; dokumen mengelompokkan media berdasarkan jenis.
3. **"Download PDF"** atau **"Tutup Preview"**.

---

## Aturan Sistem PDF

- **Portrait-only.** Semua dokumen portrait (F4/Legal), dikontrol via `@page` di template HTML. Landscape tidak diizinkan.
- **CSS page-break handling.** Baris tabel memakai `page-break-inside: avoid;` agar tidak terpotong di tengah halaman.
- **Signature placement.** Tanda tangan ditata di bawah dokumen (reserved zone 80mm).

### PDF Preview & Download Contract

| Langkah          | Perilaku                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| User klik Export | ViewModel memetakan record ke representasi HTML                                                             |
| Render HTML      | Penggabungan ViewModel ke template (`media-detail.html` / `rekapitulasi.html`)                              |
| Preview terbuka  | String HTML dimuat ke `iframe` dengan `srcDoc`                                                              |
| Download         | String HTML dikirim ke Main Process via IPC `pdf:printHtml` → hidden window memanggil `printToPDF()` native |

---

## Konfigurasi Dokumen Pemerintah

Edit `src/renderer/src/config/documentSettings.js` untuk menyesuaikan data instansi, nomor surat, daftar verifikator, dan kepala dinas. Contoh struktur (nilai contoh):

```js
export default {
  government: {
    region: 'PEMERINTAH KOTA KENDARI',
    department: 'DINAS KOMUNIKASI DAN INFORMATIKA',
    address: 'Jl. ...',
    city: 'Kendari'
  },
  decree: {
    title: 'SURAT PERSETUJUAN ...',
    reference: 'Berdasarkan Surat Keputusan ...',
    opening: '...',
    closing: ['...']
  },
  head: {
    title: 'KEPALA DINAS ...',
    name: 'NAMA KEPALA DINAS',
    rank: 'Pembina ...',
    nip: 'NIP. ...'
  },
  verifiers: [
    { role: 'Ketua', title: 'KETUA', name: 'NAMA KETUA', position: 'Jabatan' },
    { role: 'Sekertaris', title: 'SEKERTARIS', name: 'NAMA SEKRETARIS', position: 'Jabatan' }
  ]
}
```

---

## Struktur Proyek

```
media-scoring-system/
├── src/
│   ├── main/                  # Electron Main Process (Node.js)
│   │   ├── config/            # ConfigRepository, ConfigService, attachmentConfig
│   │   ├── database/          # connection.js
│   │   ├── ipc/               # media.js, database.js, pdf.js, attachments.js
│   │   ├── repositories/      # MediaRepository, AttachmentRepository, GridFsAttachmentRepository
│   │   └── index.js           # Entry point
│   ├── preload/index.js       # contextBridge API (window.api)
│   └── renderer/src/          # React renderer
│       ├── App.jsx, main.jsx
│       ├── pages/             # Dashboard, MediaForm, MediaDetail, Startup, NotFound
│       ├── components/        # dashboard/, form/, layout/, startup/, ui/
│       ├── context/           # ConnectionContext, StorageStatsContext
│       ├── services/          # MediaService, AttachmentService
│       ├── utils/             # ReportBuilder, ScoreCalculator, GradeCalculator, MongoErrorTranslator
│       ├── constants/         # mediaCriteria.js, gradeRules.js
│       ├── config/            # documentSettings.js
│       ├── documents/         # PDF engine (builders/, renderer/, templates/)
│       └── pdf/               # PDF config/constants/services
├── Documents/                 # Template DOCX resmi & Perwali (referensi layout PDF)
├── build/                     # Aset electron-builder (ikon, entitlements)
├── resources/                 # Ikon window
├── electron-builder.yml       # Konfigurasi packaging
├── electron.vite.config.mjs   # Konfigurasi Vite + Electron
└── package.json
```

---

## Separation of Concerns

| Layer              | Tanggung jawab                                     | Tidak boleh ada     |
| ------------------ | -------------------------------------------------- | ------------------- |
| `ReportBuilder`    | Normalisasi & mapping data, kalkulasi skor         | Layout, HTML markup |
| `ViewModel`        | Pemetaan data normalized ke format presentasi HTML | Database query      |
| HTML Templates     | Layout, font styling, susunan tabel resmi          | Business logic      |
| `HtmlPdfRenderer`  | Merender template HTML & trigger print IPC         | Styling, DB query   |
| `PdfExportService` | Orchestration builder ViewModel & template         | UI rendering logic  |
| React UI           | Input data, trigger preview, download              | PDF buffer printing |
| Main Process       | Database CRUD & native PDF conversion via IPC      | UI, HTML generation |

---

## Roadmap

- [ ] Dynamic Settings UI (konfigurasi instansi & pejabat on-the-fly)
- [ ] Multi-Template Engine untuk jenis media baru
- [ ] Batch Export laporan
- [ ] Audit Log riwayat perubahan data
- [ ] Manajemen Role (Admin, Verifikator, Pimpinan)
- [ ] Mode offline fallback saat MongoDB tidak dapat diakses
- [ ] GitHub Action keep-alive agar MongoDB Atlas tidak auto-pause

---

## Kontribusi

1. Fork repositori ini.
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`).
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`).
4. Push ke branch (`git push origin feature/AmazingFeature`).
5. Buka Pull Request.

> **Catatan:** Logika penilaian dan gradasi merujuk pada aturan baku Dinas Kominfo. Perubahan aturan _scoring_ wajib didiskusikan dan disetujui terlebih dahulu.

---

## License

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE`.

---

## Acknowledgements

- **Dinas Komunikasi dan Informatika Kota Kendari** atas dukungan operasional.
- Seluruh tim _open source_ di balik [Electron](https://electronjs.org), [React](https://react.dev), dan ekosistem modern web development.

---

<p align="center">
  Dikembangkan untuk Dinas Komunikasi dan Informatika Kota Kendari
</p>
