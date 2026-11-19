import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://blurkita.pages.dev"),
  title: "Foto Kita Blur — Kamera Auto-Blur saat Peace Sign",
  description:
    "Kamera web yang otomatis mem-blur gambar begitu kamu menunjukkan peace sign (✌️). Deteksi gesture real-time dengan MediaPipe, 100% diproses di perangkatmu — tanpa upload, tanpa akun.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Foto Kita Blur — Kamera Auto-Blur saat Peace Sign",
    description:
      "Kamera web yang otomatis mem-blur gambar begitu kamu menunjukkan peace sign (✌️). Deteksi gesture real-time dengan MediaPipe, 100% diproses di perangkatmu — tanpa upload, tanpa akun.",
    type: "website",
    url: "https://blurkita.pages.dev",
    images: [
      {
        url: "https://blurkita.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foto Kita Blur — kamera auto-blur saat peace sign",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foto Kita Blur — Kamera Auto-Blur saat Peace Sign",
    description:
      "Kamera web yang otomatis mem-blur gambar begitu kamu menunjukkan peace sign (✌️). Deteksi gesture real-time dengan MediaPipe, 100% diproses di perangkatmu — tanpa upload, tanpa akun.",
    images: ["https://blurkita.pages.dev/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
