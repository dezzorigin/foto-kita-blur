"use client";

import { useState } from "react";
import LandingPage from "../components/LandingPage";
import CameraStudio from "../components/CameraStudio";

export default function Home() {
  const [view, setView] = useState<"landing" | "camera">("landing");

  if (view === "camera") {
    return <CameraStudio onBack={() => setView("landing")} />;
  }

  return <LandingPage onOpenCamera={() => setView("camera")} />;
}
