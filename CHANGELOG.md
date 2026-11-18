# Changelog

## [1.1.0] — 2026-11-18

Rebuild total menjadi produk proper.

### Ditambahkan

- Landing page ala SaaS: navbar sticky + logo GitHub di kanan (ke repo), hero dua
  kolom dengan mockup preview kamera, grid 6 fitur, cara kerja 3 langkah, catatan
  privasi, CTA band, footer.
- CI GitHub Actions (`.github/workflows/ci.yml`): job `typecheck` dan `build`
  terpisah, Node 22.
- Dokumentasi: `docs/architecture.md`, diagram alur `docs/diagrams/app-flow.svg`,
  screenshot tampilan asli, video demo.
- Favicon sendiri (`public/favicon.svg`).
- Metadata halaman yang benar (dulu judulnya masih "My Google AI Studio App").

### Diperbaiki

- **Tombol SNAP kini berfungsi.** Sebelumnya tombol tidak punya aksi sama sekali.
  Sekarang mengunduh frame saat ini sebagai PNG (di-mirror seperti tampilan, blur
  ikut tersimpan bila aktif) dan masuk ke galeri "Recent Captures".
- **Galeri "Recent Captures" kini nyata.** Sebelumnya tiga kotak placeholder palsu.
  Sekarang menampilkan jepretan sungguhan (klik untuk unduh ulang), atau pesan
  jujur bila belum ada jepretan.
- **Telemetri kini diukur, bukan hardcode.** `REC` menampilkan timer berjalan sejak
  kamera menyala; `FPS` dan `LATENCY` diukur dari loop kamera. Angka lama
  (`REC 00:14:21:05`, `FPS: 60`, `LATENCY: 12ms`, `BUFFER: 4.2GB`) adalah angka
  tetap yang tidak pernah berubah — `BUFFER` dihapus.
- **Kamera baru menyala saat masuk tampilan kamera.** Sebelumnya kamera + izin
  diminta begitu halaman dibuka (padahal pengguna baru sampai di landing).
- **Judul metadata** diperbaiki dari "My Google AI Studio App".
- **Deploy statis.** `next.config.ts` kini `output: "export"` agar bisa di-deploy
  ke Cloudflare Pages sebagai situs statis (sebelumnya `standalone`, butuh server).

### Dihapus (jujur)

- Klaim integrasi Gemini dihapus: `metadata.json` menyatakan kemampuan
  `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` dan `.env.example` meminta
  `GEMINI_API_KEY`, padahal aplikasi ini tidak pernah memanggil API Gemini.
  Dependensi `@google/genai` tidak pernah diimpor — dibuang.
- Dependensi tak terpakai dibuang: `@hookform/resolvers`, `class-variance-authority`,
  `clsx`, `motion`, `tailwind-merge`, `@tailwindcss/typography`, `tw-animate-css`,
  `firebase-tools`.
- File mati dibuang: `hooks/use-mobile.ts`, `lib/utils.ts` (tidak pernah diimpor),
  `.eslintrc.json` (legacy, ESLint 9 memakai `eslint.config.mjs`).

### Dicatat

- README/PRD lama adalah template generik (mengklaim struktur `.wrangler/`,
  "Untuk project HTML statis, cukup buka index.html", dan status fiktif) —
  ditulis ulang dari kode yang sebenarnya.

## [1.0.0] — 2026-11-04

- Rilis awal: kamera + deteksi peace sign (MediaPipe) dengan tampilan viewfinder.
