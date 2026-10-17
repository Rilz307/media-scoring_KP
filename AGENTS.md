# AGENTS.md

Panduan untuk AI coding agent (OpenCode, Claude, Gemini, dll.) yang bekerja di repositori ini. **Source code adalah sumber kebenaran.** Lihat `ARCHITECTURE.md` (arsitektur), `README.md` (penggunaan), `CHANGELOG.md` (riwayat).

## Project

- Aplikasi desktop **Electron 39** untuk Dinas Kominfo Kota Kendari: verifikasi & penilaian media kerja sama.
- React 19 + **JavaScript murni (JANGAN TypeScript)**, electron-vite 5, Tailwind CSS 4, MongoDB Atlas (driver resmi), electron-builder 26.
- Deliverable utama: installer Windows `.exe`, zero-setup untuk staf non-teknis.
- Package manager: **npm**. Node ≥ 18 (CI memakai Node 20).

## Batas arsitektur (jangan dilanggar)

- Tiga lapis: `src/main` (Node/MongoDB) ⇄ `src/preload/index.js` (`window.api`) ⇄ `src/renderer/src` (React).
- Renderer **TIDAK BOLEH** mengakses MongoDB/Node langsung — hanya lewat `window.api`. URI MongoDB tetap di main process.
- Menambah IPC: handler di `src/main/ipc/*.js` → didaftarkan di `src/main/index.js` → diekspos di `src/preload/index.js`. Logic DB hanya di `src/main/repositories/*`. `_id` selalu diserialisasi jadi string.
- Business logic (scoring/grade/normalisasi) hanya di `src/renderer/src/utils/*`. `constants/mediaCriteria.js` + `constants/gradeRules.js` = single source of truth. Hanya **satu** dynamic form engine.
- PDF: `documents/builders` (ViewModel) + `documents/templates` (HTML) + `pdf/services/PdfExportService`. **Portrait-only** (F4/Legal) dan harus cocok dengan `Documents/*.docx`. Jangan ubah layout template tanpa alasan kuat.
- Alias `@renderer` → `src/renderer/src`. Router memakai `HashRouter` (wajib untuk `file://`).

## Perintah

| Perintah                          | Fungsi                                   |
| --------------------------------- | ---------------------------------------- |
| `npm run dev`                     | Dev server (hot reload)                  |
| `npm run build`                   | Build main + renderer → `out/`           |
| `npm start`                       | Preview hasil build (butuh `build` dulu) |
| `npm run lint`                    | ESLint (`eslint --cache .`)              |
| `npm run format`                  | Prettier (`prettier --write .`)          |
| `npm run build:win\|:mac\|:linux` | Build + packaging → `dist/`              |
| `npm run dist`                    | Build + packaging Windows (alias)        |

- **Tidak ada test runner dan tidak ada typecheck.** Verifikasi = `npm run lint` + jalankan manual. Jangan mengarang perintah test.

## Gotcha

- URI database **bukan** dari `.env` (`dotenv` terdaftar tapi tidak dipakai). Disimpan di `config.json` pada `userData` Electron via `ConfigService`/`ConfigRepository`, diisi lewat GUI Connection Manager. `.env.example` hanya acuan format.
- Dev & build terpaket memakai **userData berbeda**: dev → `media-scoring-system-dev`, terpaket → `media-scoring-system` (diatur di `src/main/index.js` saat `!app.isPackaged`). Path config dihitung lazy di `ConfigRepository`. Ini mencegah `config.json` dev bocor ke build (yang membuat build tampak "sudah login").
- Database `media_scoring`; collection `media` + GridFS bucket `attachments` (`attachments.files`/`.chunks`). Hapus media ikut menghapus berkas GridFS. Batas di `src/main/config/attachmentConfig.js`.
- PDF memakai `printToPDF` via IPC `pdf:printHtml`; preview memakai `iframe` `srcDoc`.
- **Jangan commit `.env`** (berisi kredensial). Update `ARCHITECTURE.md`/`README.md`/`CHANGELOG.md` saat perilaku berubah.

## Style

- Prettier: `singleQuote: true`, `semi: false`, `printWidth: 100`, `trailingComma: none` (tanpa semicolon).
- Modul ESM. Tulis JSDoc pada method publik (repositories/services) mengikuti pola yang ada.
- ESLint mengabaikan `node_modules`, `dist`, `out`.

## Hard constraints

- Dilarang: TypeScript; Next.js/Express/Firebase/Supabase/Prisma; Redux/Zustand; mengganti MongoDB Atlas.
- Dilarang redesign UX atau refactor/memindahkan/mengganti nama tanpa persetujuan eksplisit. Utamakan perubahan terkecil; **extend over rewrite**.
- Dilarang menghapus file hanya karena "kelihatan tak terpakai". Jangan buat file temp/debug/test/sample.
- Pertahankan kontrak IPC, CRUD, dynamic form, scoring, grade, dan perilaku PDF.
- **Evidence first:** jangan klaim "fixed/verified/tested" tanpa bukti; jangan mengaku sudah mengetes jika belum.
- Kerjakan per-fase, lalu berhenti menunggu persetujuan.

## CI

- `.github/workflows/mongodb-keepalive.yml` melakukan ping Atlas tiap 3 hari (secret `MONGODB_URI`) agar Free cluster (M0) tidak auto-pause, sekaligus menjalankan `liskin/gh-workflow-keepalive` untuk mencegah workflow terjadwal dinonaktifkan GitHub setelah 60 hari tanpa aktivitas.
- `.github/workflows/release.yml` membangun paket Windows (nsis + portable) dan Linux (AppImage) saat tag `v*` di-push, lalu membuat **draft** GitHub Release berisi file terlampir. `workflow_dispatch` hanya membangun tanpa merilis. Build Windows/Linux dilakukan di runner GitHub (tidak perlu `wine`/`gh` lokal).
