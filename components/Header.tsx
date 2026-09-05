"use client";

import { useState } from "react";
import Link from "next/link";
import { Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import { useAudio } from "@/context/AudioProvider";
import NavigationDrawer from "./NavigationDrawer";

export default function Header() {
  const { isPlaying, toggle } = useAudio();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
        <div className="mx-auto flex container items-center justify-between px-6 py-5 sm:px-10 md:px-14">
          
          <Link href="/" className="group relative flex flex-col items-start" data-cursor="link">
            <span className="font-circular-web text-[1.35rem] font-light tracking-[0.38em] text-[#E8DCC8] transition-colors duration-400 group-hover:text-[#D98C4A]">
              NERO<span className="text-[#D98C4A]">.</span>
            </span>
            <span className="relative mt-0.5 h-px w-full bg-[#E8DCC8]/20 overflow-hidden">
              <span className="absolute inset-0 -translate-x-full bg-[#D98C4A] transition-transform duration-500 group-hover:translate-x-0" />
            </span>
          </Link>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            
            {/* Audio Ambient Sound Toggle */}
            <button
              onClick={toggle}
              title={isPlaying ? "Mute Ambient Sound" : "Play Ambient Sound"}
              className={`flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-400 ${
                isPlaying
                  ? "border-[#D98C4A]/50 bg-[#D98C4A]/15 text-[#D98C4A] shadow-[0_0_12px_rgba(217,140,74,0.25)]"
                  : "border-white/10 bg-white/5 text-[#E8DCC8]/50 hover:border-white/25 hover:text-[#E8DCC8]"
              }`}
              data-cursor="drag"
            >
              {isPlaying ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>

            <Link
              data-cursor="link"
              href="mailto:tf5234045@gmail.com"
              className="hidden sm:inline-flex group relative h-9 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 font-mono text-xs uppercase tracking-[0.2em] text-[#E8DCC8] transition-all duration-400 hover:border-[#D98C4A]/60 hover:text-[#EFE6D4]"
            >
              <div className="relative overflow-hidden">
                <span className="block transition-transform duration-400 group-hover:-translate-y-full">
                  Get In Touch
                </span>
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 block translate-y-full text-[#D98C4A] transition-transform duration-400 group-hover:translate-y-0"
                >
                  Get In Touch
                </span>
              </div>
              <ArrowUpRight className="ml-2 size-3.5 text-[#D98C4A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* ── Animated SVG Menu Button ── */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-cursor="link"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              className={`group relative flex h-9 items-center gap-2.5 rounded-full border px-3.5 sm:px-4 backdrop-blur-md transition-all duration-400 ${
                isMenuOpen
                  ? "border-[#D98C4A] bg-[#140e0a] text-[#D98C4A] shadow-[0_0_18px_rgba(217,140,74,0.3)]"
                  : "border-white/15 bg-[#0a0806]/80 text-[#E8DCC8] hover:border-[#D98C4A]/60 hover:text-[#EFE6D4]"
              }`}
            >
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium">
                {isMenuOpen ? "CLOSE" : "MENU"}
              </span>

              {/* Kinetic SVG Morphing Icon */}
              <svg
                viewBox="0 0 24 24"
                className="size-4.5 overflow-visible transition-transform duration-500 group-hover:scale-110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Top Line */}
                <line
                  x1="3"
                  y1="7"
                  x2="21"
                  y2="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className={`origin-center transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                    isMenuOpen
                      ? "translate-y-1.25 rotate-45 stroke-[#D98C4A]"
                      : "group-hover:translate-x-0.5 group-hover:stroke-[#D98C4A]"
                  }`}
                />

                {/* Center Tactical Dot */}
                <circle
                  cx="12"
                  cy="12"
                  r="1.5"
                  fill="currentColor"
                  className={`transition-all duration-400 ${
                    isMenuOpen ? "scale-0 opacity-0" : "opacity-75 group-hover:fill-[#D98C4A] group-hover:scale-125"
                  }`}
                />

                {/* Bottom Line */}
                <line
                  x1="3"
                  y1="17"
                  x2="21"
                  y2="17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className={`origin-center transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                    isMenuOpen
                      ? "-translate-y-1.25 -rotate-45 stroke-[#D98C4A]"
                      : "group-hover:-translate-x-0.5 group-hover:stroke-[#D98C4A]"
                  }`}
                />
              </svg>
            </button>

          </div>
        </div>
      </header>

      {/* ── Sliding Navigation Drawer ── */}
      <NavigationDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
