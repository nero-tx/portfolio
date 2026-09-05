"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import dynamic from "next/dynamic";
import { ArrowDown, Radio, Sparkles, ArrowUpRight } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import Link from "next/link";

const Scene = dynamic(() => import("@/components/3d/Scene"), {
  ssr: false,
  loading: () => null,
});

gsap.registerPlugin(SplitText);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState<boolean>(true);
  const isMobile = useIsMobile(1024);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      gsap.set(".hero-fade-in", { opacity: 0, y: 20 });
      gsap.set(".hero-hud-line", { scaleX: 0, transformOrigin: "left" });
      gsap.set(".hero-hud-line-r", { scaleX: 0, transformOrigin: "right" });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
      });

      // 1. Subtle HUD framing elements
      tl.to(".hero-hud-line, .hero-hud-line-r", {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
      });

      // 2. Main title typography
      if (!isMobile && !reduce) {
        const titleSplit = new SplitText(".hero-main-title", {
          type: "chars",
        });

        gsap.set(titleSplit.chars, {
          opacity: 0,
          yPercent: 70,
          rotateZ: () => gsap.utils.random(-4, 4),
          filter: "blur(6px)",
        });

        tl.to(
          titleSplit.chars,
          {
            opacity: 1,
            yPercent: 0,
            rotateZ: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.03,
            ease: "power4.out",
          },
          "-=0.7",
        );
      } else {
        tl.fromTo(
          ".hero-main-title",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6",
        );
      }

      // 3. Staggered reveal for top-left narrative and bottom-right info
      tl.to(
        ".hero-fade-in",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.6",
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-transparent select-none text-[#E8DCC8]"
    >
      {!isMobile ? (
        <>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Scene frameloop={isInView ? "always" : "never"} />
          </div>

          <div
            data-cursor="drag"
            data-cursor-label="ORBIT ARTIFACT"
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
            aria-label="3D Interactive Drone Viewport"
          />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <div className="absolute size-72 sm:size-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,140,74,0.15),transparent_70%)] blur-3xl" />
          <div className="relative size-60 sm:size-80 rounded-full border border-dashed border-[#D98C4A]/30 animate-[spin_35s_linear_infinite]" />
          <div className="absolute size-44 sm:size-56 rounded-full border border-[#5FB8C9]/20 animate-[spin_20s_linear_infinite_reverse]" />
          <div className="absolute size-2.5 rounded-full bg-[#D98C4A] shadow-[0_0_16px_#D98C4A]" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(217,140,74,0.06),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(180,120,55,0.04),transparent_50%)]" />
      </div>

      <div className="hero-hud-line pointer-events-none absolute left-[5vw] right-[5vw] top-20 z-20 h-px bg-linear-to-r from-[#D98C4A]/40 via-white/10 to-transparent" />
      <div className="hero-hud-line-r pointer-events-none absolute left-[5vw] right-[5vw] bottom-20 z-20 hidden md:block h-px bg-linear-to-l from-[#D98C4A]/40 via-white/10 to-transparent" />

      <div className="relative z-20 flex min-h-screen flex-col justify-between px-6 pt-28 pb-12 sm:px-10 md:px-16 md:pt-32 md:pb-14">
        <div className="flex flex-col items-start max-w-xl">
          <div className="hero-fade-in mb-4 flex items-center gap-3">
            <span className="flex size-2 rounded-full bg-[#D98C4A] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#D98C4A]">
              CAREER // 2026 EDITION
            </span>
          </div>

          <h1 className="hero-main-title font-circular-web text-[clamp(2.8rem,7.5vw,7.8rem)] font-light leading-[0.88] tracking-tight text-[#EFE6D4]">
            TAREK <br className="hidden sm:block" />
            <span className="text-[#D98C4A]">FAWZY.</span>
          </h1>

          <div className="hero-fade-in mt-6 sm:mt-8 space-y-3 max-w-md">
            <div className="flex items-center gap-2 text-[#D98C4A]">
              <Sparkles className="size-3.5 shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#E8DCC8] font-medium">
                What Makes It Work!
              </span>
            </div>
            <p className="font-general text-sm sm:text-[15px] leading-relaxed text-[#A6998A]">
              Full-Stack Engineer, building from database to browser. I care
              about how systems are structured, how products behave under real
              use, and how the final experience feels in your hands.
            </p>

            <div className="pt-2">
              <Link
                href="/whoami"
                data-cursor="link"
                className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#D98C4A] transition-colors hover:text-[#EFE6D4] border-b"
              >
                <span>Read Full Story</span>
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 md:pt-0">
          <div className="hero-fade-in flex flex-wrap items-center gap-5 order-2 md:order-1">
            <div className="flex items-center gap-4">
              <div
                aria-label="Scroll to about section"
                className="flex shrink-0 size-9 items-center justify-center rounded-full border border-[#D98C4A]/40 bg-[#0e0a07]/80 backdrop-blur-sm transition-all duration-300 hover:border-[#D98C4A] hover:scale-105"
              >
                <ArrowDown className="size-4 animate-bounce text-[#D98C4A]" />
              </div>

              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/70">
                  SCROLL TO EXPLORE
                </div>
                <div className="font-mono text-[8px] hidden md:inline-flex uppercase tracking-[0.25em] text-[#D98C4A]/70">
                  ARCHITECTURE // MOTION // WORK
                </div>
              </div>
            </div>

            {!isMobile && (
              <div className="hidden lg:flex items-center gap-2.5 rounded-full border border-[#D98C4A]/25 bg-[#070503]/80 px-4 py-1.5 backdrop-blur-md">
                <Radio className="size-3 animate-pulse text-[#D98C4A]" />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#E8DCC8]/80">
                  Click & Drag to Orbit 3D Artifact
                </span>
              </div>
            )}
          </div>

          {/* Bottom-Right: Systems Engineering Statement */}
          <div className="hero-fade-in flex flex-col items-start md:items-end text-left md:text-right max-w-md order-1 md:order-2">
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-xs border border-white/10 bg-white/5 px-2.5 py-1">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-400/90">
                PRODUCTION ECOSYSTEMS
              </span>
            </div>

            <p className="font-general text-sm leading-relaxed text-[#B8AA98]">
              Architecting scalable full-stack applications with Next.js,
              Node.js, and PostgreSQL — with a focus on solid systems, clean
              architecture, and experiences that feel as good as they work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
