"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Terminal, ChevronRight, GitBranch } from "lucide-react";
import { AsciiGlitchRipple } from "./text-motions";
import { ARCHITECTURE_BRANCHES, TECH_TELEMETRY } from "@/utils/main-data";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function About() {
  const aboutRef = useRef<HTMLElement>(null);
  const [activeBranch, setActiveBranch] = useState<number>(0);

  useGSAP(
    () => {
      const contextSplit = new SplitText(".about-context-manifesto", {
        type: "lines,words",
      });

      gsap.fromTo(
        contextSplit.words,
        { color: "rgba(232, 220, 200, 0.15)", filter: "blur(2px)" },
        {
          color: "#E8DCC8",
          filter: "blur(0px)",
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-context-manifesto",
            start: "top 80%",
            end: "bottom 50%",
            scrub: 1.2,
          },
        },
      );

      gsap.fromTo(
        ".about-main-divider",
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 75%",
          },
        },
      );

      // Animate the tree circuit lines
      gsap.fromTo(
        ".tree-path-stem",
        { strokeDashoffset: 400, strokeDasharray: 400 },
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".about-tree-section",
            start: "top 75%",
          },
        },
      );

      // Animate Branch Cards
      gsap.fromTo(
        ".tree-branch-card",
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.14,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-tree-section",
            start: "top 70%",
          },
        },
      );

      // Animate Tech Telemetry Chips
      gsap.fromTo(
        ".tech-chip",
        { opacity: 0, scale: 0.9, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".tech-telemetry-grid",
            start: "top 85%",
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
      className="relative w-full bg-transparent py-32 md:py-44 text-[#E8DCC8] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 -left-40 size-96 rounded-full bg-[#D98C4A]/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 size-96 rounded-full bg-[#5FB8C9]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto container px-6 md:px-12">
        {/* Kinetic Philosophy Statement */}
        <div className="my-20 max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[#D98C4A]">
            <Terminal className="size-3.5" />
            <span>DISCIPLINE STATEMENT</span>
          </div>

          <h2
            data-cursor="text"
            className="about-context-manifesto font-robert-medium text-[clamp(2.2rem,4.4vw,4.6rem)] leading-[1.1] tracking-tight text-[#E8DCC8]/20"
          >
            I engineer where heavy systems architecture, tactile real-time
            motion, and brutalist aesthetics collide — turning complex
            distributed logic into seamless, high-velocity products that scale
            without compromise.
          </h2>
        </div>

        <div className="about-main-divider my-16 h-px w-full bg-linear-to-r from-[#D98C4A]/60 via-white/10 to-transparent" />

        <div className="about-tree-section mt-24">
          {/* Tree Intro Header */}
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <GitBranch className="size-4 text-[#D98C4A]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#D98C4A]">
                  ARCHITECTURE NODES // TREE MATRIX
                </span>
              </div>
              <h3 className="font-robert-medium text-3xl md:text-4xl text-[#EFE6D4]">
                The Three Pillars of Execution
              </h3>
            </div>
            <p className="max-w-md font-general text-xs text-[#A6998A] md:text-sm leading-relaxed">
              Every production system is forged across three interconnected
              branches — ensuring structural endurance, visual mastery, and
              autonomous intelligence.
            </p>
          </div>

          <div className="relative mb-12 hidden w-full justify-center md:flex">
            <svg
              className="h-16 w-full max-w-4xl"
              viewBox="0 0 800 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="400"
                cy="10"
                r="5"
                fill="#D98C4A"
                className="animate-pulse"
              />
              <circle
                cx="400"
                cy="10"
                r="12"
                stroke="#D98C4A"
                strokeWidth="1"
                strokeOpacity="0.4"
              />

              <path
                className="tree-path-stem"
                d="M 400 10 L 400 30 L 133 30 L 133 55"
                stroke="#D98C4A"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              <circle cx="133" cy="55" r="3" fill="#D98C4A" />

              <path
                className="tree-path-stem"
                d="M 400 10 L 400 55"
                stroke="#5FB8C9"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              <circle cx="400" cy="55" r="3" fill="#5FB8C9" />

              <path
                className="tree-path-stem"
                d="M 400 10 L 400 30 L 666 30 L 666 55"
                stroke="#E8DCC8"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              <circle cx="666" cy="55" r="3" fill="#E8DCC8" />
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {ARCHITECTURE_BRANCHES.map((branch, idx) => {
              const Icon = branch.icon;
              const isSelected = activeBranch === idx;

              return (
                <div
                  key={branch.code}
                  onMouseEnter={() => setActiveBranch(idx)}
                  className={`tree-branch-card group relative rounded-xs border p-4 md:p-7 backdrop-blur-md transition-all duration-500 cursor-pointer overflow-hidden ${
                    isSelected
                      ? "border-[#D98C4A]/60 bg-[#140e0a]/90 shadow-[0_0_30px_rgba(217,140,74,0.12)] -translate-y-1.5"
                      : "border-white/10 bg-[#0d0a07]/80 hover:border-white/20 hover:bg-[#110d0a]/90"
                  }`}
                >
                  <div className="absolute top-0 left-0 size-3 border-t border-l border-[#D98C4A]/60" />
                  <div className="absolute top-0 right-0 size-3 border-t border-r border-[#D98C4A]/60" />
                  <div className="absolute bottom-0 left-0 size-3 border-b border-l border-[#D98C4A]/60" />
                  <div className="absolute bottom-0 right-0 size-3 border-b border-r border-[#D98C4A]/60" />

                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#D98C4A]" />
                      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#D98C4A]">
                        {branch.role}
                      </span>
                    </div>

                    <div className="flex size-8 items-center justify-center rounded-xs border border-white/10 bg-[#16110d]">
                      <Icon className="size-4 text-[#D98C4A]" />
                    </div>
                  </div>

                  {/* Branch Title */}
                  <AsciiGlitchRipple
                    as="h4"
                    className="mb-4 font-robert-medium text-lg text-[#EFE6D4] transition-colors duration-300 group-hover:text-white whitespace-nowrap font-semibold"
                  >
                    {branch.branch}
                  </AsciiGlitchRipple>

                  <p className="font-general text-xs leading-relaxed text-[#A6998A] mb-6">
                    {branch.summary}
                  </p>

                  <div className="space-y-2 border-t border-white/5 pt-5">
                    {branch.specs.map((spec) => (
                      <div
                        key={spec}
                        className="flex items-center gap-2 font-mono text-[10px] text-[#C2B5A5]"
                      >
                        <ChevronRight className="size-3 text-[#D98C4A]" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
                    {Object.entries(branch.telemetry).map(([key, val]) => (
                      <div
                        key={key}
                        className="rounded-xs border border-white/5 bg-[#090705] p-2"
                      >
                        <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#D98C4A]/70">
                          {key}
                        </div>
                        <div className="font-mono text-[10px] font-semibold text-[#E8DCC8]">
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="tech-telemetry-grid mt-28 rounded-xs border border-white/10 bg-[#0d0a07]/60 p-6 md:p-10 backdrop-blur-xl">
          <div className="mb-8 gap-4 sm:flex-row sm:items-center border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <Layers className="size-4 text-[#D98C4A]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#E8DCC8]">
                VERIFIED PRODUCTION TOOLCHAIN & RUNTIMES
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TECH_TELEMETRY.map((item) => (
              <div
                key={item.name}
                className="tech-chip group relative rounded-xs border border-white/5 bg-[#120e0b]/80 p-3.5 transition-all duration-300 hover:border-[#D98C4A]/40 hover:bg-[#18120e]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#D98C4A]">
                    {item.cat}
                  </span>
                  <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-white/40">
                    {item.level}
                  </span>
                </div>
                <div className="mt-1 font-robert-medium text-xs font-semibold text-[#E9DFC8] transition-colors group-hover:text-white">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
