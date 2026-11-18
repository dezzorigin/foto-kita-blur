# PRD — Foto Kita Blur v2.0

## 1. Informasi Proyek

| Field | Nilai |
|---|---|
| Nama Proyek | Foto Kita Blur |
| Deskripsi | Kamera web yang otomatis mem-blur gambar saat pengguna menunjukkan peace sign (✌️) |
| Tech Stack | Next.js 15 (static export), React 19, TypeScript, MediaPipe Tasks Vision, Tailwind CSS 4 |
| Live Demo | https://blurkita.pages.dev |
| Repo | https://github.com/dezzorigin/foto-kita-blur |
| Lisensi | MIT |
| Versi Dokumen | 2.0 (18 Nov 2026) |

## 2. Latar Belakang

Foto blur saat peace sign adalah gestur visual yang populer di foto kasual — menutup
wajah sebagian dengan efek blur sambil tetap menunjukkan ekspresi. Foto Kita Blur
membuat efek itu terjadi otomatis dan real-time: pengguna cukup menunjukkan ✌️ ke
kamera, tanpa perlu edit foto manual.

## 3. Tujuan

- Kamera web yang mendeteksi peace sign secara real-time dan mem-blur gambar secara otomatis.
- Semua pemrosesan di perangkat pengguna (privasi penuh, tanpa server).
- Pengalaman ala produk jadi: landing page yang menjelaskan produk, lalu masuk ke kamera.

## 4. Fitur

### 4.1 Landing page (baru di v1.1.0)

- Navbar sticky: logo, tautan Fitur / Cara Kerja, ikon GitHub (ke repo), CTA "Buka Kamera".
- Hero dua kolom: headline, subcopy, 2 CTA, mockup preview kamera.
- Grid 6 fitur, cara kerja 3 langkah, catatan privasi, CTA band, footer.

### 4.2 Kamera & deteksi gesture

- `getUserMedia` (kamera depan) dimulai hanya saat pengguna masuk ke tampilan kamera.
- MediaPipe `GestureRecognizer` (`runningMode: VIDEO`, `numHands: 2`, delegate GPU).
  Model diunduh dari CDN saat pertama dibuka:
  `storage.googleapis.com/mediapipe-models/.../gesture_recognizer/float16/1/gesture_recognizer.task`.
- Kategori `Victory` dengan skor &gt; 0,55 → `isBlur = true` → video diberi efek
  `blur-md` (12px). Saat gestur hilang, blur mati.
- Loop prediksi via `requestAnimationFrame`, dimulai saat video `loadeddata`.

### 4.3 SNAP — jepret & simpan (diperbaiki di v1.1.0)

- Menggambar frame video saat ini ke `<canvas>` (di-mirror agar sama dengan tampilan),
  menerapkan filter blur 12px bila blur sedang aktif, lalu mengunduh sebagai PNG.
- Jepretan masuk ke galeri "Recent Captures" (maksimal 6, terbaru dulu) dan bisa
  diunduh ulang dengan klik.

### 4.4 Telemetri asli (diperbaiki di v1.1.0)

- Timer REC: waktu berjalan sejak kamera menyala (`mm:ss`).
- FPS: diukur dari delta `requestAnimationFrame` (rata-rata eksponensial).
- Latensi: waktu eksekusi `recognizeForVideo` per frame (rata-rata eksponensial, ms).
- Versi lama menampilkan angka hardcode (`REC 00:14:21:05`, `FPS: 60`, `LATENCY: 12ms`,
  `BUFFER: 4.2GB`) — sudah diganti dengan pengukuran nyata; `BUFFER` dihapus.

### 4.5 Yang sengaja tidak ada

- Tidak ada akun, login, atau penyimpanan server. Tidak ada upload foto.
- Tidak ada integrasi AI generatif (klaim Gemini di template lama sudah dihapus —
  aplikasi ini tidak pernah memanggil API Gemini).

## 5. Arsitektur

Lihat `docs/architecture.md`. Ringkasnya:

- `app/page.tsx` — saklar state `landing | camera`.
- `components/LandingPage.tsx` — seluruh landing (statis, tanpa kamera).
- `components/CameraStudio.tsx` — kamera, MediaPipe, SNAP, telemetri.
- Build: `next build` dengan `output: "export"` → folder `out/` statis,
  di-deploy ke Cloudflare Pages.

## 6. Persyaratan Non-Fungsional

- **Performa:** deteksi tiap frame video; blur diterapkan via CSS agar murah.
- **Privasi:** frame tidak pernah keluar dari perangkat; tidak ada cookie pelacak.
- **Keamanan:** tidak ada secret (`.env.example` hanya berisi komentar).
- **Kompatibilitas:** butuh browser dengan `getUserMedia` + WebGL/WASM untuk MediaPipe
  (Chrome/Edge/Firefox modern, HTTPS).
- **Aksesibilitas:** tombol punya `type="button"`, viewport mengizinkan zoom,
  kontras teks di atas ambang baca.

## 7. Keterbatasan yang diketahui (jujur)

- Model AI diunduh dari CDN saat pertama dibuka — butuh internet di awal;
  tanpa internet, kamera tetap jalan tapi deteksi gagal dengan pesan error.
- Deteksi butuh cahaya cukup dan tangan terlihat jelas di frame.
- Di perangkat tanpa kamera (atau bila izin ditolak), aplikasi menampilkan pesan
  error dan tidak bisa dipakai — itu memang syarat fitur ini.
- Video demo direkam headless dengan kamera simulasi: feed-nya adalah foto peace
  sign yang diumpankan sebagai kamera palsu (headless tidak punya kamera asli),
  sehingga video menampilkan blur yang terpicu oleh deteksi MediaPipe sungguhan.
  Di perangkat nyata, latensi inferensi jauh lebih rendah (di VM headless tanpa
  GPU, satu inferensi bisa ~10 detik karena delegate GPU jatuh ke SwiftShader).

## 8. Milestone

| Fase | Status |
|---|---|
| Inisialisasi & scaffolding | ✅ (template lama) |
| Fitur inti kamera + deteksi | ✅ |
| Landing page SaaS | ✅ (v1.1.0) |
| SNAP berfungsi + galeri nyata | ✅ (v1.1.0) |
| Telemetri asli | ✅ (v1.1.0) |
| CI (typecheck + build) | ✅ (v1.1.0) |
| Deploy Cloudflare Pages | ✅ (v1.1.0) |
| Dokumentasi lengkap | ✅ (v1.1.0) |

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| CDN model tidak terjangkau | Pesan error jelas; kamera tetap menampilkan video |
| Izin kamera ditolak | Pesan error jelas + tombol kembali ke beranda |
| Dependensi usang | Audit berkala; dependensi tak terpakai sudah dibuang |

## 10. Kriteria Keberhasilan

- Landing tampil, CTA masuk ke kamera, kamera menyala, model dimuat.
- Peace sign memicu blur; tangan turun mematikan blur.
- SNAP mengunduh PNG yang sama dengan tampilan layar.
- `npm run typecheck` dan `npm run build` lolos; CI hijau.
- Live di Cloudflare Pages, HTTP 200.

## 11. Lisensi

MIT (LICENSE)
