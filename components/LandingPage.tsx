import { Camera, Hand, ShieldCheck, Zap, Download, Github, ArrowRight, Eye, Lock, Sparkles } from "lucide-react";
import GitHubIcon from "./GitHubIcon";

const REPO_URL = "https://github.com/dezzorigin/foto-kita-blur";

const FEATURES = [
  {
    icon: Hand,
    title: "Deteksi Gesture Real-Time",
    desc: "MediaPipe Gesture Recognizer membaca tanganmu tiap frame. Peace sign (Victory) dengan skor di atas 0,55 langsung memicu blur.",
  },
  {
    icon: ShieldCheck,
    title: "Privasi Penuh, On-Device",
    desc: "Frame kamera tidak pernah keluar dari perangkatmu. Tidak ada upload, tidak ada server, tidak ada akun.",
  },
  {
    icon: Zap,
    title: "Auto-Blur Instan",
    desc: "Begitu ✌️ terdeteksi, gambar langsung blur — dan kembali tajam saat tanganmu turun. Tanpa tombol, tanpa jeda.",
  },
  {
    icon: Download,
    title: "Jepret & Simpan",
    desc: "Tekan SNAP untuk mengunduh fotomu sebagai PNG — apa yang kamu lihat di layar, itu yang tersimpan, blur-nya ikut.",
  },
  {
    icon: Eye,
    title: "Dua Tangan Sekaligus",
    desc: "Mendeteksi sampai dua tangan dalam satu frame. Cukup satu peace sign dari tangan mana pun untuk memicu blur.",
  },
  {
    icon: Github,
    title: "Gratis & Open Source",
    desc: "Kode terbuka di GitHub di bawah lisensi MIT. Pakai, pelajari, dan modifikasi sesukamu.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Buka kamera",
    desc: "Klik tombol Buka Kamera dan izinkan akses webcam saat browser meminta.",
  },
  {
    n: "02",
    title: "Tunjuk peace sign ✌️",
    desc: "Angkat tanganmu dan tunjukkan peace sign ke kamera. Model AI memuat sekali di awal.",
  },
  {
    n: "03",
    title: "Foto auto-blur",
    desc: "Gambar langsung blur selagi ✌️ terlihat. Tekan SNAP untuk menyimpan fotonya.",
  },
];

export default function LandingPage({ onOpenCamera }: { onOpenCamera: () => void }) {
  return (
    <div className="w-full min-h-screen bg-[#080808] text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center gap-6">
          <a href="#" className="text-xl font-black tracking-tighter leading-none">
            BLUR<span className="text-[#00F0FF]">.</span>TRND
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lihat di GitHub"
              className="p-2 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/40 transition-colors"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={onOpenCamera}
              className="bg-white text-black font-bold text-sm px-4 py-2 rounded-full hover:bg-[#00F0FF] transition-colors cursor-pointer"
            >
              Buka Kamera
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="max-w-6xl mx-auto px-4 md:px-8 pt-14 md:pt-24 pb-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest border border-[#00F0FF]/40 text-[#00F0FF] rounded-full px-3 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Next.js + MediaPipe · 100% On-Device
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
              Tunjuk ✌️, fotomu langsung <span className="text-[#00F0FF]">blur.</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl mb-8">
              Foto Kita Blur menyalakan kameramu dan otomatis mem-blur gambar begitu kamu
              menunjukkan peace sign. Tanpa upload, tanpa akun, tanpa server — semua
              diproses di perangkatmu.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                type="button"
                onClick={onOpenCamera}
                className="bg-white text-black font-bold px-6 py-3.5 rounded-full hover:bg-[#00F0FF] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Buka Kamera
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#cara-kerja"
                className="border border-white/20 font-bold px-6 py-3.5 rounded-full hover:border-white/50 transition-colors"
              >
                Lihat Cara Kerja ↓
              </a>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="font-black text-lg">100%</span>
                <span className="text-white/50 block text-xs mt-0.5">diproses di perangkat</span>
              </div>
              <div>
                <span className="font-black text-lg">0 byte</span>
                <span className="text-white/50 block text-xs mt-0.5">foto di-upload</span>
              </div>
              <div>
                <span className="font-black text-lg">2 tangan</span>
                <span className="text-white/50 block text-xs mt-0.5">dideteksi sekaligus</span>
              </div>
            </div>
          </div>

          {/* Preview mockup */}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-black/60 border-b border-white/10">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-white/40 font-mono">foto-kita-blur — kamera</span>
              </div>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-md bg-white/5" />
                <div className="text-8xl blur-md select-none" aria-hidden="true">✌️</div>
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00F0FF]" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/20" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/20" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/20" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">Blur Active</span>
                </div>
              </div>
              <div className="px-4 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/50">
                <span><span className="text-[#00F0FF]">INSTRUCTION:</span> POSE ✌️ TO TRIGGER BLUR</span>
                <span className="hidden sm:block">REC ●</span>
              </div>
            </div>
            <p className="text-center text-xs text-white/40 mt-4">
              Contoh tampilan kamera — gambar blur saat peace sign terdeteksi.
            </p>
          </div>
        </section>

        {/* Fitur */}
        <section id="fitur" className="max-w-6xl mx-auto px-4 md:px-8 py-16 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Kenapa Foto Kita Blur?</h2>
          <p className="text-white/50 mb-10 max-w-2xl">
            Kamera biasa merekam apa adanya. Yang ini mengerti gesturmu — dan menjaga
            privasimu tanpa perlu menutup lensa.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <f.icon className="w-7 h-7 text-[#00F0FF] mb-4" />
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cara kerja */}
        <section id="cara-kerja" className="max-w-6xl mx-auto px-4 md:px-8 py-16 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-10">Cara Kerja</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-4xl font-black text-[#00F0FF] mb-4">{s.n}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-[#00F0FF]/25 bg-[#00F0FF]/5 p-6 flex gap-4">
            <Lock className="w-6 h-6 text-[#00F0FF] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold mb-1">Kameramu tetap milikmu</h3>
              <p className="text-sm text-white/55 leading-relaxed">
                Video diproses langsung di browser dengan MediaPipe — tidak ada satu frame
                pun yang dikirim ke mana-mana. Model AI diunduh sekali dari CDN publik
                (jsDelivr &amp; Google Storage) saat pertama kali kamera dibuka, lalu
                berjalan sepenuhnya offline dari perangkatmu.
              </p>
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
          <div className="rounded-3xl bg-white text-black px-6 py-12 md:p-14 text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Siap coba? Tunjuk ✌️.
            </h2>
            <p className="text-black/60 mb-8 max-w-xl mx-auto">
              Tidak perlu daftar, tidak perlu install. Buka kamera dan langsung coba.
            </p>
            <button
              type="button"
              onClick={onOpenCamera}
              className="bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-[#00F0FF] hover:text-black transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Buka Kamera
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col sm:flex-row items-center gap-4 text-sm text-white/50">
          <span className="font-black tracking-tighter text-white text-base">
            BLUR<span className="text-[#00F0FF]">.</span>TRND
          </span>
          <span className="sm:ml-2">Foto Kita Blur — kamera auto-blur saat peace sign.</span>
          <div className="sm:ml-auto flex items-center gap-5">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <GitHubIcon className="w-4 h-4" />
              GitHub
            </a>
            <span>MIT License</span>
            <span>oleh dezzorigin</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
