"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Volume2, VolumeX, X } from "lucide-react";
import { useAudio } from "@/context/AudioProvider";

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { num: "01", label: "Home", href: "/", tag: "IDENT" },
  { num: "02", label: "Selected Work", href: "/work", tag: "ARCHIVE" },
  { num: "03", label: "My Story", href: "/whoami", tag: "Story" },
  {
    num: "04",
    label: "Contact",
    href: "mailto:tf5234045@gmail.com",
    tag: "TRANSMIT",
  },
];

const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com/nero-tx", code: "GH" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/tarek-fawzy-773466323",
    code: "LI",
  },
  { name: "X / Twitter", href: "https://x.com/n3rotx", code: "TW" },
];

export default function NavigationDrawer({ isOpen, onClose }: NavDrawerProps) {
  const pathname = usePathname();
  const { isPlaying, toggle } = useAudio();

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isOpen
          ? "pointer-events-auto visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#070503]/85 backdrop-blur-xl transition-opacity duration-700 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={drawerRef}
        className={`absolute right-0 top-0 bottom-0 z-10 flex h-full w-full sm:max-w-xl flex-col justify-between border-l border-white/10 bg-[#0b0806]/95 p-6 sm:p-10 md:p-14 shadow-2xl backdrop-blur-2xl transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-[#D98C4A]/08 blur-[120px]" />
        <div className="pointer-events-none absolute top-12 right-12 size-64 rounded-full bg-[#5FB8C9]/04 blur-[100px]" />

        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-[#D98C4A] animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#D98C4A]">
              MENU
            </span>
          </div>

          <div className="flex items-center gap-3">
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
              {isPlaying ? (
                <Volume2 className="size-4" />
              ) : (
                <VolumeX className="size-4" />
              )}
            </button>

            <button
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-400 border-[#D98C4A]/50 bg-[#D98C4A]/15 text-[#D98C4A] shadow-[0_0_12px_rgba(217,140,74,0.25)] hover:border-white/25 hover:text-[#E8DCC8]
              "
              onClick={onClose}
              data-cursor="link"
              aria-label="Close navigation menu"
            >
              <X />
            </button>
          </div>
        </div>

        {/* ── 2. Primary Navigation Links ── */}
        <nav className="relative z-10 my-auto py-6 flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const isExternal = link.href.startsWith("mailto:");
            const isActive = pathname === link.href;

            const LinkContent = (
              <div className="group relative flex items-baseline justify-between py-2 sm:py-3 transition-all duration-300">
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span className="font-mono text-[10px] sm:text-xs text-[#D98C4A]/60 group-hover:text-[#D98C4A] transition-colors">
                    {link.num}
                  </span>
                  <span
                    className={`font-circular-web text-3xl sm:text-4xl md:text-5xl font-light tracking-tight transition-all duration-400 group-hover:translate-x-2 group-hover:text-[#D98C4A] ${
                      isActive ? "text-[#D98C4A]" : "text-[#EFE6D4]"
                    }`}
                  >
                    {link.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#5FB8C9]">
                    {link.tag}
                  </span>
                  <ArrowUpRight className="size-4 text-[#D98C4A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <div className="absolute bottom-0 left-0 h-px w-0 bg-[#D98C4A]/40 transition-all duration-500 group-hover:w-full" />
              </div>
            );

            return isExternal ? (
              <a
                key={link.num}
                href={link.href}
                onClick={onClose}
                data-cursor="link"
                className="block"
              >
                {LinkContent}
              </a>
            ) : (
              <Link
                key={link.num}
                href={link.href}
                onClick={onClose}
                data-cursor="link"
                className="block"
              >
                {LinkContent}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 border-t border-white/10 pt-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid gap-5 font-mono text-xs text-[#E8DCC8]/70">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.code}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative py-1 hover:text-[#EFE6D4] transition-colors flex items-center gap-1.5"
                  data-cursor="link"
                >
                  <span className="text-[#D98C4A] text-[9px]">
                    [{social.code}]
                  </span>
                  <span>{social.name}</span>
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-[#D98C4A] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
