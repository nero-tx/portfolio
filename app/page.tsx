"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";

const Scene = dynamic(() => import("@/components/3d/Scene"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

const HIDDEN_SELECTORS = ["#services"] as const;

function SceneLayer({
  hideOnSelectors,
}: {
  hideOnSelectors: readonly string[];
}) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(true);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !wrapperRef.current) return;
    const wrapper = wrapperRef.current;

    const triggers = hideOnSelectors
      .map((selector) => document.querySelector(selector))
      .filter((el): el is Element => Boolean(el))
      .map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 65%",
          end: "bottom 35%",
          onToggle: (self) => {
            gsap.to(wrapper, {
              opacity: self.isActive ? 0 : 1,
              duration: 0.6,
              ease: "power2.out",
              overwrite: true,
              onStart: () => {
                if (!self.isActive) setActive(true);
              },
              onComplete: () => {
                if (self.isActive) setActive(false);
              },
            });
          },
        }),
      );

    return () => triggers.forEach((t) => t.kill());
  }, [mounted, hideOnSelectors]);

  if (!mounted) return null;

  return createPortal(
    <div ref={wrapperRef} className="fixed inset-0 -z-10 pointer-events-none">
      <Scene frameloop={active ? "always" : "never"} />
    </div>,
    document.body,
  );
}

export default function Page() {
  return (
    <>
      <SceneLayer hideOnSelectors={HIDDEN_SELECTORS} />

      <div className="relative z-10">
        <Hero />
        <About />

        <Services />

        <Work />

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
