# Arsitektur — Foto Kita Blur

## Ringkasan

Aplikasi web statis (Next.js static export) tanpa server. Semua logika berjalan di
browser: kamera via `getUserMedia`, deteksi gesture via MediaPipe Tasks Vision
(WebAssembly + GPU delegate), tampilan via React + Tailwind.

```
Pengguna
  → Landing (statis)
  → "Buka Kamera"
  → CameraStudio
      → getUserMedia (kamera depan)
      → FilesetResolver + GestureRecognizer (CDN)
      → loop requestAnimationFrame
          → recognizeForVideo(frame)
          → Victory skor > 0,55 → blur ON
          → SNAP → canvas → PNG download
```

## Struktur file

| File | Peran |
|---|---|
| `app/layout.tsx` | Metadata, favicon, `<html lang="id">` |
| `app/page.tsx` | Saklar state `landing \| camera` |
| `app/globals.css` | Tailwind |
| `components/LandingPage.tsx` | Navbar, hero, fitur, cara kerja, footer |
| `components/CameraStudio.tsx` | Kamera, MediaPipe, SNAP, galeri, telemetri |
| `components/GitHubIcon.tsx` | Logo GitHub (SVG mark) |
| `next.config.ts` | `output: "export"` untuk Pages statis |

## Alur deteksi

1. `CameraStudio` mount → `getUserMedia({ video: { facingMode: "user" } })`.
2. `FilesetResolver.forVisionTasks` memuat runtime WASM dari jsDelivr.
3. `GestureRecognizer.createFromOptions` memuat model `gesture_recognizer`
   (float16, v1) dari Google Storage, `runningMode: "VIDEO"`, `numHands: 2`,
   delegate GPU.
4. `video.onLoadedData` → `predictWebcam()` → loop `requestAnimationFrame`:
   - hitung FPS dari delta frame,
   - ukur durasi `recognizeForVideo` sebagai latensi,
   - bila gestur `Victory` skor &gt; 0,55 → `isBlur = true`.
5. `isBlur` mengontrol class video (`blur-md scale-105`) dan status pill
   (`BLUR ACTIVE` vs `REC mm:ss`).
6. Unmount → batalkan rAF, tutup recognizer, hentikan track kamera.

## SNAP

`canvas` seukuran frame video → `ctx.translate + scale(-1, 1)` agar hasil sama
dengan tampilan yang di-mirror → bila blur aktif, `ctx.filter = "blur(12px)"` →
`drawImage(video)` → `toDataURL("image/png")` → unduh + simpan ke state galeri
(maksimal 6).

## Telemetri

- **Timer REC**: `Date.now()` saat stream mulai, dihitung tiap 500 ms.
- **FPS**: rata-rata eksponensial dari delta `requestAnimationFrame`.
- **Latensi**: rata-rata eksponensial durasi `recognizeForVideo` (ms).

## Deploy

- `npm run build` → `out/` (static export).
- Cloudflare Pages direct upload dari `out/`.
- CI: dua job terpisah — `typecheck` (`tsc --noEmit`) dan `build` (`next build`).

## Dependensi runtime

| Paket | Alasan |
|---|---|
| `next`, `react`, `react-dom` | Framework |
| `@mediapipe/tasks-vision` | Deteksi gesture |
| `lucide-react` | Ikon |
| `tailwindcss`, `@tailwindcss/postcss`, `autoprefixer`, `postcss` | Styling |

Dependensi template AI Studio yang tidak pernah dipakai (`@google/genai`,
`firebase-tools`, `motion`, dll.) sudah dibuang di v1.1.0.
