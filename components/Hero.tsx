"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { ArrowDown, Radio, Cpu } from "lucide-react";
const Scene = dynamic(() => import("@/components/3d/Scene"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger, SplitText);

type Streak = {
  id: number;
  top: number;
  width: number;
  duration: number;
  delay: number;
  opacity: number;
};

function generateStreaks(count: number): Streak[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 92 + 4, // 4%–96% of the viewport height
    width: Math.random() * 140 + 70, // 70–210px streak length
    duration: Math.random() * 4 + 3, // 3–7s crossing time
    delay: -(Math.random() * 8), // negative delay = already mid-flight on mount
    opacity: Math.random() * 0.22 + 0.1, // 0.10–0.32 peak opacity
  }));
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const gustRef = useRef<HTMLDivElement>(null);
  const [activeBeat, setActiveBeat] = useState<number>(1);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [isInView, setIsInView] = useState<boolean>(true);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduce) {
      const isMobile = window.innerWidth < 768;
      setStreaks(generateStreaks(isMobile ? 6 : 14));
    }
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(heroRef.current, { "--wind-intensity": 1 } as gsap.TweenVars);
      if (!reduce) {
        gsap.to(heroRef.current, {
          "--wind-intensity": 0.35,
          duration: 15,
          ease: "power2.out",
        } as gsap.TweenVars);
      }

      // 1. Initial Intro Animation for Title & Badges
      const split = new SplitText(".hero-main-title", {
        type: "chars",
      });

      if (reduce) {
        gsap.set(split.chars, { opacity: 0 });
      } else {
        gsap.set(split.chars, {
          xPercent: () => gsap.utils.random(-140, -90),
          yPercent: () => gsap.utils.random(-10, 10),
          rotateZ: () => gsap.utils.random(-9, 9),
          skewX: -16,
          opacity: 0,
          filter: isMobile ? "none" : "blur(10px)",
        });
      }

      gsap.set(".hero-frame-h", { scaleX: 0, transformOrigin: "left" });
      gsap.set(".hero-frame-v", { scaleY: 0, transformOrigin: "top" });
      gsap.set(".hero-beat-1-content", { autoAlpha: 0, y: 20 });
      gsap.set(".hero-telemetry-sidebar", { autoAlpha: 0, x: 20 });
      gsap.set(".hero-drag-hint", { autoAlpha: 0, scale: 0.9 });
      gsap.set(".hero-beat-2-group", { autoAlpha: 0 });
      gsap.set(".hero-beat-3-group", { autoAlpha: 0 });
      gsap.set(".hero-beat-4-outro", { autoAlpha: 0 });
      gsap.set(gustRef.current, { xPercent: -160, opacity: 0 });

      const introTl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      introTl
        .to(
          ".hero-frame-h",
          { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
          0.3,
        )
        .to(
          ".hero-frame-v",
          { scaleY: 1, duration: 1.1, ease: "power3.inOut" },
          0.4,
        )
        .to(
          gustRef.current,
          { opacity: 1, duration: 0.35, ease: "power1.out" },
          0.45,
        )
        .to(
          gustRef.current,
          { xPercent: 220, duration: 1.5, ease: "power1.inOut" },
          0.45,
        )
        .to(gustRef.current, { opacity: 0, duration: 0.5 }, 1.35)
        .to(
          split.chars,
          reduce
            ? { opacity: 1, duration: 0.6, ease: "power1.out", stagger: 0.02 }
            : {
                xPercent: 0,
                yPercent: 0,
                rotateZ: 0,
                skewX: 0,
                opacity: 1,
                filter: isMobile ? "none" : "blur(0px)",
                duration: 1.3,
                ease: "power4.out",
                stagger: { each: 0.028, from: "start" },
              },
          0.5,
        )
        .to(".hero-beat-1-content", { autoAlpha: 1, y: 0, duration: 0.9 }, 0.9)
        .to(
          ".hero-telemetry-sidebar",
          { autoAlpha: 1, x: 0, duration: 0.8 },
          1.0,
        )
        .to(".hero-drag-hint", { autoAlpha: 1, scale: 1, duration: 0.8 }, 1.2);

      // ── 2. Scroll-scrubbed beat timeline ──────────────────────────────────
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.0,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.27) setActiveBeat(1);
            else if (p < 0.53) setActiveBeat(2);
            else if (p < 0.78) setActiveBeat(3);
            else setActiveBeat(4);
          },
        },
      });

      // ── Beat 1 exit ──
      scrollTl
        .to(
          ".hero-beat-1-group",
          {
            yPercent: -45,
            autoAlpha: 0,
            scale: 0.95,
            filter: isMobile ? "none" : "blur(6px)",
            duration: 0.09,
            ease: "power2.inOut",
          },
          0.18,
        )
        .to(
          [".hero-drag-hint", ".hero-scroll-indicator"],
          { autoAlpha: 0, y: -10, duration: 0.07 },
          0.18,
        )
        .to(
          ".hero-telemetry-sidebar",
          { autoAlpha: 0, x: 12, duration: 0.08 },
          0.19,
        )

        // ── Beat 2 enter ──
        .fromTo(
          ".hero-beat-2-group",
          {
            autoAlpha: 0,
            yPercent: 45,
            filter: isMobile ? "none" : "blur(8px)",
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: isMobile ? "none" : "blur(0px)",
            duration: 0.12,
            ease: "power3.out",
          },
          0.24,
        )

        // ── Beat 2 exit ──
        .to(
          ".hero-beat-2-group",
          {
            yPercent: -45,
            autoAlpha: 0,
            filter: isMobile ? "none" : "blur(6px)",
            duration: 0.09,
            ease: "power2.inOut",
          },
          0.44,
        )

        // ── Beat 3 enter ──
        .fromTo(
          ".hero-beat-3-group",
          {
            autoAlpha: 0,
            yPercent: 45,
            filter: isMobile ? "none" : "blur(8px)",
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: isMobile ? "none" : "blur(0px)",
            duration: 0.12,
            ease: "power3.out",
          },
          0.5,
        )

        // ── Beat 3 exit ──
        .to(
          ".hero-beat-3-group",
          {
            yPercent: -45,
            autoAlpha: 0,
            filter: isMobile ? "none" : "blur(6px)",
            duration: 0.09,
            ease: "power2.inOut",
          },
          0.7,
        )

        // ── Beat 4 enter ──
        .fromTo(
          ".hero-beat-4-outro",
          {
            autoAlpha: 0,
            yPercent: 35,
            scale: 0.96,
            filter: isMobile ? "none" : "blur(8px)",
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            filter: isMobile ? "none" : "blur(0px)",
            duration: 0.14,
            ease: "power3.out",
          },
          0.75,
        );

      return () => {
        split.revert();
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-[360vh] sm:h-[500vh] md:h-[700vh] w-full bg-transparent"
      style={{ ["--wind-intensity" as string]: 1 }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Scene frameloop={isInView ? "always" : "never"} />
        </div>

        <div
          data-cursor="drag"
          data-cursor-label="DRAG TO ROTATE"
          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
          aria-label="3D Drone Interactive Canvas"
        />

        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(217,140,74,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(180,120,55,0.06),transparent_50%)]" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-6 overflow-hidden">
          {streaks.map((s) => (
            <span
              key={s.id}
              className="wind-streak"
              style={
                {
                  top: `${s.top}%`,
                  width: `${s.width}px`,
                  animationDuration: `${s.duration}s`,
                  animationDelay: `${s.delay}s`,
                  "--opacity-max": s.opacity,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* One-time gust flash that sweeps through as the title assembles */}
        <div
          ref={gustRef}
          className="pointer-events-none absolute inset-y-0 left-0 z-7 w-[45vw] opacity-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(232,220,200,0.12), rgba(217,140,74,0.08), transparent)",
            filter: "blur(28px)",
          }}
        />

        <div className="hero-frame-h pointer-events-none absolute left-[6vw] right-[6vw] top-20 z-20 h-px bg-linear-to-r from-[#D98C4A]/60 via-white/10 to-transparent" />

        <div className="hero-frame-v pointer-events-none absolute left-[6vw] top-20 bottom-20 z-20 hidden w-px bg-linear-to-b from-[#D98C4A]/60 via-white/10 to-transparent md:block" />

        {/* BEAT 1: THE DRONE REVEAL (Hero Intro)                     */}
        <div className="hero-beat-1-group pointer-events-none absolute left-6 top-[22%] z-20 md:left-[10vw] md:top-[24%] max-w-160">
          <div className="hero-eyebrow mb-4 flex items-center gap-3">
            <span className="h-px w-6 bg-[#D98C4A]" />
            <span className="font-general text-[10px] uppercase tracking-[0.3em] text-[#D98C4A]">
              Creative Developer & Systems Architect
            </span>
          </div>

          <h1
            className="hero-main-title special-font text-[18vw] leading-[0.8] tracking-tight text-[#efe6d4] sm:text-[13vw] md:text-[9vw]"
            style={{ perspective: "1200px" }}
          >
            <span className="block">TAREK</span>
            <span className="block">FAWZY</span>
          </h1>

          <div className="hero-beat-1-content mt-8 max-w-110">
            <p className="font-general text-sm leading-relaxed text-[#A6998A] md:text-base">
              Sculpting digital experiences where brutalist aesthetics,
              real-time motion, and robust backend architecture converge.
            </p>
          </div>
        </div>

        {/* Interactive Drag to Rotate Pill (Beat 1) */}
        <div className="hero-drag-hint pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-full border border-[#D98C4A]/30 bg-[#0a0806]/80 px-5 py-2 backdrop-blur-md">
          <Radio className="size-3.5 animate-pulse text-[#D98C4A]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#E8DCC8]">
            Click & Drag to Orbit Drone
          </span>
        </div>

        {/* BEAT 2: TACTICAL SCAN & ARCHITECTURE PHILOSOPHY           */}
        <div className="hero-beat-2-group pointer-events-none absolute inset-x-6 top-[26%] z-20 mx-auto max-w-4xl opacity-0 text-center md:inset-x-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-xs border border-[#D98C4A]/30 bg-[#16100c]/80 px-3 py-1">
            <Cpu className="size-3 text-[#D98C4A]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#D98C4A]">
              TELEMETRY PHASE // SCAN & INSPECTION
            </span>
          </div>

          <h2 className="font-robert-medium text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.08] tracking-tight text-[#E9DFC8]">
            Behind every interface lies an{" "}
            <span className="text-[#D98C4A]">
              experience worth remembering.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl font-general text-sm leading-relaxed text-[#A6998A] md:text-base">
            Engineering is where it starts — building scalable systems and
            thoughtful interfaces, then pushing them a little further with
            cinematic motion, unusual interactions, and ideas that make digital
            products feel less ordinary.
          </p>
        </div>

        {/* BEAT 3: HYPER-DRIVE & MANIFESTO                           */}
        <div className="hero-beat-3-group pointer-events-none absolute left-6 top-[25%] z-20 max-w-2xl opacity-0 md:left-[10vw]">
          <h2 className="font-robert-medium text-[clamp(2.4rem,5.2vw,5.5rem)] leading-none tracking-tight text-[#E9DFC8]">
            From structured systems to <br />{" "}
            <span className="text-[#D98C4A]">cinematic experiences.</span>
          </h2>

          <p className="mt-6 font-general text-sm leading-relaxed text-[#A6998A] md:text-base">
            Building reliable systems and expressive interfaces, with a soft
            spot for cinematic experiences, unusual interactions, and ideas that
            make the web more interesting.
          </p>
        </div>

        {/* BEAT 4: CINEMATIC RECRUITER OUTRO (PRODUCTION PROTOCOL)   */}
        <div className="hero-beat-4-outro pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 z-30 mx-auto max-w-5xl opacity-0 text-center md:inset-x-12">
          <h2 className="font-robert-medium text-[clamp(2.2rem,4.8vw,4.8rem)] leading-[1.05] tracking-tight text-[#EFE6D4]">
            I don&apos;t just build interfaces.
            <br />
            <span className="text-[#D98C4A]">
              I architect production ecosystems.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-general text-sm leading-relaxed text-[#B8AA98] md:text-base">
            Building modern software with a focus on performance, reliability,
            and clean engineering — constantly pushing toward the level of
            systems built to scale.
          </p>
        </div>

        {/* Right Sidebar Telemetry */}
        <div className="hero-telemetry-sidebar pointer-events-none absolute right-[6vw] top-1/2 z-20 -translate-y-1/2 hidden flex-col items-end gap-3 sm:flex">
          <div className="flex -rotate-90 origin-right items-center gap-4">
            <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-[#E8DCC8]/60 whitespace-nowrap">
              SYSTEMS / MOTION / DRONE
            </span>
            <span className="h-px w-12 bg-[#D98C4A]" />
          </div>
        </div>

        {/* Bottom Scroll Indicator & Status */}
        <div className="hero-scroll-indicator pointer-events-none absolute bottom-8 left-[6vw] right-[6vw] z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-9 items-center justify-center rounded-full border border-[#D98C4A]/40 bg-[#0b0806]/80">
              <ArrowDown className="size-4 animate-bounce text-[#D98C4A]" />
            </div>

            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/70">
                Scroll to Descend
              </div>
              <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#D98C4A]/60">
                Storyline Phase 0{activeBeat} // 04
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
