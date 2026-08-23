"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AsciiGlitchRipple } from "./text-motions";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const PILLARS = [
  {
    index: "01",
    title: "Backend Engineering",
    body: "Design reliable backend systems with strong architecture, transactional data flows, background processing, and APIs built to scale without sacrificing clarity.",
  },

  {
    index: "02",
    title: "Frontend Engineering",
    body: "Build high-performance interfaces with modern React and Next.js — turning complex product requirements into clean, responsive, and maintainable experiences.",
  },

  {
    index: "03",
    title: "Creative Thinking",
    body: "I look beyond the obvious solution — experimenting with ideas, challenging conventions, and finding new ways to make digital products feel distinctive without losing their purpose.",
  },
] as const;

export default function About() {
  const aboutRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const contextSplit = new SplitText(".about-context", {
        type: "lines,words",
      });

      const pillarsIntroSplit = new SplitText(".about-pillars-intro", {
        type: "words",
      });

      gsap.fromTo(
        contextSplit.words,
        { color: "#E8DCC830" },
        {
          color: "#E8DCC8",
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-context",
            start: "top 80%",
            end: "bottom 55%",
            scrub: 1.4,
          },
        },
      );

      gsap.fromTo(
        ".about-label",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".about-divider",
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".about-stat",
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-stats",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".about-pillar",
        { yPercent: 24, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.14,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-pillars",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        pillarsIntroSplit.words,
        {
          opacity: 0,
          y: 18,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.045,
          duration: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-pillars-intro",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: aboutRef },
  );

  return (
    <section
      ref={aboutRef}
      id="about"
      className="relative w-full py-28 md:py-40"
    >
      <div className="mx-auto flex container px-6 md:px-12">
        <div className="about-label flex items-center gap-4">
          <span className="h-px w-8 bg-[#D98C4A]/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D98C4A]">
            The Engineer Behind the Interface
          </span>
        </div>
      </div>

      <div className="about-divider mx-auto my-16 h-px container bg-linear-to-r from-[#D98C4A]/40 via-white/8 to-transparent px-6 md:px-12" />

      <div data-cursor="text" className="mx-auto container px-6 md:px-12 mb-20">
        <h2 className="about-context font-robert-medium text-[clamp(2rem,3.8vw,4.5rem)] leading-[1.05] text-[#E8DCC830]">
          <span className="w-1/12 inline-block" /> Good code. Sharp ideas. Zero
          boring interfaces. Building digital experiences that look good, work
          fast, and Making complex things feel simple
        </h2>
      </div>

      {/* pillars intro */}
      <div className="mx-auto container px-6 md:px-12">
        <div className="about-pillars-intro mb-10 container flex items-center justify-center text-center">
          <div className="flex max-w-2xl flex-col gap-3">
            <span className="font-general font-semibold text-lg leading-7 uppercase text-[#D98C4A]/70">
              What I bring to the table
            </span>

            <p className="font-general text-xs text-[#A6998A] md:text-sm">
              Three principles shape the way I approach every project — from the
              systems beneath the product to the experience people see and feel.
            </p>
          </div>
        </div>

        <div className="about-pillars  grid grid-cols-1 gap-4 md:grid-cols-3">
          {PILLARS.map(({ index, title, body }) => (
            <div
              key={index}
              className="about-pillar group relative overflow-hidden rounded-sm border border-[#E8DCC8]/8 bg-[#0d0a07]/60 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-[#D98C4A]/40"
            >
              {/* Hover amber bleed */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#D98C4A]/0 to-[#D98C4A]/0 transition-all duration-500 group-hover:from-[#D98C4A]/5" />

              {/* Corner accent lines */}
              <div className="absolute left-0 top-0 h-4 w-px bg-[#D98C4A]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute left-0 top-0 h-px w-4 bg-[#D98C4A]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="mb-4 block font-mono text-[9px] tracking-[0.3em] text-[#D98C4A]/70">
                {index} //
              </span>

              <AsciiGlitchRipple
                as="h2"
                className="mb-4 font-robert-medium text-xl text-[#E8DCC8] transition-colors duration-300 group-hover:text-white md:text-2xl whitespace-nowrap"
              >
                {title}
              </AsciiGlitchRipple>

              <p className="font-general text-sm leading-7 text-[#A6998A] transition-colors duration-300 group-hover:text-[#c4b9ab]">
                {body}
              </p>

              <div className="mt-6 h-px w-0 bg-[#D98C4A]/50 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
