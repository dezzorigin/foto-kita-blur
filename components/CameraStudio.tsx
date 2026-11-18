"use client";

import { useEffect, useRef, useState } from "react";
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";
import { Camera, ArrowLeft, Download } from "lucide-react";

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function CameraStudio({ onBack }: { onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captures, setCaptures] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [fps, setFps] = useState(0);
  const [latencyMs, setLatencyMs] = useState(0);
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const requestRef = useRef<number | null>(null);
  const isBlurRef = useRef(false);
  const lastFrameRef = useRef(0);
  const fpsEmaRef = useRef(0);
  const latencyEmaRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    isBlurRef.current = isBlur;
  }, [isBlur]);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          startedAtRef.current = Date.now();
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error accessing camera", err);
          setError("Izinkan akses kamera (webcam) untuk menggunakan fitur ini.");
        }
      }
    };

    const initializeGestureRecognizer = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });

        if (!isMounted) {
          recognizer.close();
          return;
        }

        recognizerRef.current = recognizer;
        setIsLoaded(true);
      } catch (err: any) {
        if (isMounted) {
          console.error("Error initializing gesture recognizer", err);
          setError("Gagal memuat AI model. Pastikan koneksi internet stabil.");
        }
      }
    };

    startCamera();
    if (!recognizerRef.current) {
      initializeGestureRecognizer();
    }

    const meter = window.setInterval(() => {
      if (startedAtRef.current) {
        setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }
      setFps(Math.round(fpsEmaRef.current * 10) / 10);
      setLatencyMs(Math.round(latencyEmaRef.current * 10) / 10);
    }, 500);

    return () => {
      isMounted = false;
      window.clearInterval(meter);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (recognizerRef.current) {
        recognizerRef.current.close();
        recognizerRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const predictWebcam = () => {
    const video = videoRef.current;
    if (video && recognizerRef.current && video.readyState >= 2) {
      const now = performance.now();
      if (lastFrameRef.current > 0) {
        const delta = now - lastFrameRef.current;
        if (delta > 0) {
          const inst = 1000 / delta;
          fpsEmaRef.current = fpsEmaRef.current === 0 ? inst : fpsEmaRef.current * 0.9 + inst * 0.1;
        }
      }
      lastFrameRef.current = now;

      const t0 = performance.now();
      const results = recognizerRef.current.recognizeForVideo(video, now);
      const dt = performance.now() - t0;
      latencyEmaRef.current = latencyEmaRef.current === 0 ? dt : latencyEmaRef.current * 0.9 + dt * 0.1;

      let peaceSignDetected = false;

      if (results.gestures.length > 0) {
        for (let i = 0; i < results.gestures.length; i++) {
          const categoryName = results.gestures[i][0].categoryName;
          const categoryScore = results.gestures[i][0].score;
          if (categoryName === "Victory" && categoryScore > 0.55) {
            peaceSignDetected = true;
          }
        }
      }

      setIsBlur(peaceSignDetected);
    }
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  const snap = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Gambar ditampilkan mirror (scaleX(-1)) — samakan hasil jepretan.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    if (isBlurRef.current) {
      ctx.filter = "blur(12px)";
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setCaptures((prev) => [dataUrl, ...prev].slice(0, 6));
    const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `foto-kita-blur-${stamp}.png`;
    a.click();
  };

  return (
    <div className="w-full h-screen bg-[#080808] text-white flex flex-col font-sans overflow-hidden">
      {/* Header Section */}
      <header className="p-6 md:p-8 flex justify-between items-baseline border-b border-white/10 shrink-0">
        <div className="flex flex-col">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-2">
            BLUR<span className="text-[#00F0FF]">.</span>TRND
          </h1>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-50 font-medium mt-2">
            Trend Foto Kita Blur ✌️
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs md:text-sm font-bold border border-white/20 rounded-full px-4 py-2 hover:border-white/50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </button>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-[#00F0FF]">001</div>
            <div className="text-[10px] uppercase opacity-40 mt-1">Version v1.1.0</div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Sidebar Left: Controls */}
        <div className="hidden lg:flex w-24 border-r border-white/10 flex-col items-center py-12 gap-12 shrink-0">
          <div className="rotate-90 origin-center whitespace-nowrap text-[10px] tracking-[0.5em] opacity-40 font-bold uppercase mt-12">
            Camera Parameters
          </div>
          <div className="flex flex-col gap-6 mt-16">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold">F1.8</div>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold">60</div>
            <div className="w-10 h-10 rounded-full bg-[#00F0FF] text-black flex items-center justify-center text-xs font-black">AF</div>
          </div>
        </div>

        {/* Central Viewfinder Area */}
        <div className="flex-1 relative p-4 md:p-6 flex flex-col items-center justify-center min-h-0 overflow-y-auto overflow-x-hidden">
          {error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl max-w-md text-center font-medium">
              {error}
            </div>
          ) : (
            <div className="w-full h-full max-w-5xl border border-white/10 relative overflow-hidden flex items-center justify-center bg-zinc-900 mx-auto">
              {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#080808]/90 backdrop-blur-md">
                  <Camera className="w-12 h-12 animate-pulse text-[#00F0FF] mb-4" />
                  <p className="text-zinc-300 animate-pulse font-medium text-xs uppercase tracking-widest text-center px-4">
                    Memuat Kamera &amp; AI Model...
                  </p>
                </div>
              )}

              <video
                ref={videoRef}
                onLoadedData={predictWebcam}
                className={`w-full h-full object-cover transition-all duration-150 ease-out ${
                  isBlur ? "blur-md scale-105 opacity-90" : "blur-0 scale-100 opacity-100"
                }`}
                style={{ transform: "scaleX(-1)" }}
                playsInline
                muted
              />

              {/* Viewfinder Brackets */}
              <div className="absolute top-4 left-4 md:top-10 md:left-10 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-[#00F0FF] z-10"></div>
              <div className="absolute top-4 right-4 md:top-10 md:right-10 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-white/20 z-10"></div>
              <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-white/20 z-10"></div>
              <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-white/20 z-10"></div>

              {/* Dynamic Status */}
              <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 md:px-6 py-2.5 rounded-full border border-white/10 z-10 whitespace-nowrap">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  isBlur ? 'bg-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.8)]' : 'bg-red-600 animate-pulse'
                }`}></div>
                <div className="text-[10px] md:text-xs font-mono tracking-tighter uppercase text-white/90">
                  {isBlur ? 'BLUR ACTIVE' : `REC ${formatElapsed(elapsed)}`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Right: Gallery */}
        <div className="hidden lg:flex w-64 bg-[#0A0A0A] border-l border-white/10 p-6 flex-col shrink-0">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">Recent Captures</div>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {captures.length === 0 ? (
              <div className="border border-dashed border-white/15 rounded-xl p-4 text-xs text-white/40 leading-relaxed">
                Belum ada jepretan — tekan SNAP untuk menyimpan fotomu sebagai PNG.
              </div>
            ) : (
              captures.map((src, i) => (
                <a
                  key={`${i}-${src.slice(-16)}`}
                  href={src}
                  download={`foto-kita-blur-capture-${captures.length - i}.png`}
                  title="Klik untuk unduh ulang"
                  className="block aspect-square bg-zinc-800 border border-white/5 rounded relative overflow-hidden group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Jepretan ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[8px] font-bold opacity-0 group-hover:opacity-100 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
                    <Download className="w-3 h-3" /> UNDUH
                  </span>
                </a>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={snap}
            disabled={!!error || !isLoaded}
            className="mt-6 w-full py-6 bg-white text-black font-black uppercase tracking-tighter text-2xl hover:bg-[#00F0FF] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            SNAP
          </button>
        </div>
      </main>

      {/* Footer Ticker */}
      <footer className="h-10 md:h-12 border-t border-white/10 flex items-center px-4 md:px-8 bg-black shrink-0">
        <div className="flex gap-4 md:gap-8 text-[8px] md:text-[10px] font-mono tracking-widest opacity-60 w-full overflow-hidden whitespace-nowrap items-center">
          <div><span className="text-[#00F0FF]">INSTRUCTION:</span> POSE ✌️ TO TRIGGER BLUR</div>
          <div className="hidden sm:block ml-auto">FPS: {fps > 0 ? fps.toFixed(1) : "—"}</div>
          <div className="hidden sm:block">LATENCY: {latencyMs ? `${latencyMs}ms` : "—"}</div>
          <div className="hidden sm:block">MODEL: GESTURE V1</div>
        </div>
      </footer>
    </div>
  );
}
