"use client";

import { useState } from "react";

// Import simplified components
import Background from "./components/Background";
import Hero from "./components/Hero";
import VideoModal from "./components/VideoModal";
import { FloatingNavbar } from "../layout/floating-navbar";

export default function LandingFeature() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Floating Navbar */}
      <FloatingNavbar />

      {/* Background component for animated gradients and grid */}
      <Background />

      {/* Hero section - Properly centered */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <Hero setIsVideoPlaying={setIsVideoPlaying} />
      </div>

      {/* Video Modal that appears when triggered */}
      <VideoModal
        isVideoPlaying={isVideoPlaying}
        setIsVideoPlaying={setIsVideoPlaying}
      />
    </div>
  );
}
