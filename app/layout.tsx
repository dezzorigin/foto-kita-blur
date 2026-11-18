import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foto Kita Blur — Kamera Auto-Blur saat Peace Sign",
  description:
    "Kamera web yang otomatis mem-blur gambar begitu kamu menunjukkan peace sign (✌️). Deteksi gesture real-time dengan MediaPipe, 100% diproses di perangkatmu — tanpa upload, tanpa akun.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
