"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Hero from "@/components/Hero";
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("@/components/3d/Scene"), {
  ssr: false,
});

function SceneLayer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Scene />
    </div>,
    document.body,
  );
}

export default function Page() {
  return (
    <>
      <SceneLayer />

      <div className="relative z-10">
        <Hero />
        <section
          id="about"
          className="h-screen flex flex-col justify-center px-8 md:px-16"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#D98C4A] mb-4">
            01 — About
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-[#E8DCC8] max-w-2xl">
            Every facet catches the light differently.
          </h2>
        </section>

        <section
          id="work"
          className="min-h-[150vh] flex flex-col justify-center px-8 md:px-16"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#D98C4A] mb-4">
            02 — Work
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-[#E8DCC8] max-w-2xl">
            Beneath the surface, something keeps burning.
          </h2>
        </section>

        <section
          id="contact"
          className="h-screen flex flex-col justify-center px-8 md:px-16"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#D98C4A] mb-4">
            03 — Contact
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-[#E8DCC8] max-w-2xl">
            Let's build something that feels alive.
          </h2>
        </section>
      </div>
    </>
  );
}
