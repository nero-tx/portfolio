"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Chapter = {
  number: string;
  heading: string;
  lines: string[];
};

const CHAPTERS: Chapter[] = [
  {
    number: "01",
    heading: "I Changed The Field.",
    lines: [
      "Three years ago, I made a decision that changed the direction of my career.",
      "I was studying Agriculture at Alexandria University when I realized that technology was where my curiosity was taking me.",
      "Not just using software.",
      "Understanding how it works.",
      "So I made the decision to leave that path and dedicate my time to software engineering.",
      "I wanted to find out what I could build if I took it seriously.",
    ],
  },

  {
    number: "02",
    heading: "Three Years Of Building.",
    lines: [
      "There was no predefined roadmap.",
      "I had to figure out what to learn, what to build, and where to go next.",
      "I started with the fundamentals and gradually moved deeper into:",
      "APIs. Databases. Authentication. Architecture. Transactions. Performance. Frontend systems.",
      "Over time, I became less interested in simply making things work.",
      "I wanted to understand why they work — and what happens when they don't.",
      "That shift changed the way I approached engineering.",
    ],
  },

  {
    number: "03",
    heading: "From Code To Systems.",
    lines: [
      "Today, I don't see software as a collection of functions.",
      "I see systems.",
      "How data moves.",
      "How services communicate.",
      "Where failures happen.",
      "How state changes.",
      "How databases behave under load.",
      "How systems can grow without becoming difficult to maintain.",
      "Backend engineering became where my curiosity naturally went deeper.",
      "But I also care about the other side of software — interfaces, interaction, motion, and the experience a product creates.",
      "Engineering and creativity don't have to compete.",
      "For me, they are part of the same work.",
    ],
  },

  {
    number: "04",
    heading: "A Different Route.",
    lines: [
      "I didn't take the usual path into software.",
      "And I don't think taking a different path is an achievement by itself.",
      "What matters is what you do with it.",
      "For the past three years, I've chosen to learn independently, build continuously, and keep going deeper without a predefined curriculum.",
      "That experience taught me something more valuable than following a roadmap:",
      "how to create my own.",
      "I'm still learning.",
      "And I intend to stay that way.",
    ],
  },

  {
    number: "05",
    heading: "What's Next.",
    lines: [
      "I'm not looking for a title just to have one.",
      "I'm looking for the right environment.",
      "Real problems.",
      "Real systems.",
      "People I can learn from.",
      "Challenges that push me further.",
      "The path I took was different.",
      "But it gave me the ability to learn independently, stay curious, go deep, and keep building when the answer isn't obvious.",
      "I don't need an opportunity because of my story.",
      "I need one to show what I can build.",
      "And I'm ready for it.",
    ],
  },
];

function pointOnArc(t: number) {
  const angle = Math.PI * (1 - t);
  const cx = 800;
  const cy = 500;
  const rx = 660;
  const ry = 380;
  return {
    x: cx + rx * Math.cos(angle),
    y: cy - ry * Math.sin(angle) - 30,
  };
}

export default function WhoAmI() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sunGroupRef = useRef<SVGGElement>(null);
  const dawnLayerRef = useRef<HTMLDivElement>(null);
  const duskLayerRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const markerRefs = useRef<(SVGGElement | null)[]>([]);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const fractionsRef = useRef<number[]>(
    CHAPTERS.map((_, i) => i / (CHAPTERS.length - 1)),
  );
  const crossedRef = useRef<boolean[]>(CHAPTERS.map(() => false));

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const positionMarkers = () => {
      const total = wrapperRef.current
        ? wrapperRef.current.scrollHeight - window.innerHeight
        : 1;
      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        const frac = Math.min(
          1,
          Math.max(0, el.offsetTop / Math.max(total, 1)),
        );
        fractionsRef.current[i] = frac;
        const p = pointOnArc(frac);
        markerRefs.current[i]?.setAttribute(
          "transform",
          `translate(${p.x} ${p.y})`,
        );
        const ring = ringRefs.current[i];
        if (ring) {
          ring.setAttribute("cx", String(p.x));
          ring.setAttribute("cy", String(p.y));
        }
      });
    };

    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      positionMarkers();
      window.addEventListener("resize", positionMarkers);

      // ── Per-line reveals ─────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".story-line").forEach((line) => {
        gsap.set(
          line,
          reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(5px)" },
        );
        gsap.to(line, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: reduce ? 0.4 : 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // ── Chapter heading punch-ups ────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".chapter-heading").forEach((heading) => {
        const split = new SplitText(heading, { type: "chars" });
        splits.push(split);
        gsap.set(
          split.chars,
          reduce ? { opacity: 0 } : { yPercent: 100, opacity: 0 },
        );
        gsap.to(split.chars, {
          yPercent: 0,
          opacity: 1,
          duration: reduce ? 0.5 : 0.9,
          stagger: 0.018,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // ── Continuous backdrop: sun position, color grade, milestones ────
      const setSunX = gsap.quickSetter(sunGroupRef.current, "x", "px");
      const setSunY = gsap.quickSetter(sunGroupRef.current, "y", "px");
      const setDawn = gsap.quickSetter(dawnLayerRef.current, "opacity");
      const setDusk = gsap.quickSetter(duskLayerRef.current, "opacity");
      const start0 = pointOnArc(0);
      gsap.set(sunGroupRef.current, { x: start0.x, y: start0.y });

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const t = self.progress;
          const p = pointOnArc(t);
          setSunX(p.x);
          setSunY(p.y);

          if (!reduce) {
            setDusk(t);
            setDawn(1 - t);
          }

          fractionsRef.current.forEach((frac, i) => {
            const marker = markerRefs.current[i];
            if (!marker) return;
            const lit = t >= frac;
            marker.style.opacity = lit ? "1" : "0.28";
            marker.style.transform = lit ? "scale(1)" : "scale(0.75)";

            if (lit && !crossedRef.current[i]) {
              crossedRef.current[i] = true;
              const ring = ringRefs.current[i];
              if (ring && !reduce) {
                gsap.fromTo(
                  ring,
                  { attr: { r: 6 }, opacity: 0.7 },
                  {
                    attr: { r: 46 },
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                  },
                );
              }
            } else if (!lit && crossedRef.current[i]) {
              crossedRef.current[i] = false;
            }
          });
        },
      });
    }, wrapperRef);

    return () => {
      window.removeEventListener("resize", positionMarkers);
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full bg-[#0A0908]">
      {/* Fixed cinematic backdrop — persists behind every chapter */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          ref={dawnLayerRef}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 65%, rgba(120,140,160,0.14), transparent 60%), linear-gradient(180deg, #11161c 0%, #0A0908 100%)",
            opacity: 1,
          }}
        />
        <div
          ref={duskLayerRef}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 62%, rgba(217,140,74,0.18), transparent 60%), linear-gradient(180deg, #150f0a 0%, #0A0908 100%)",
            opacity: 0,
          }}
        />
        {/* Vignette — keeps line copy legible no matter the grade phase */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.15) 30%, rgba(10,9,8,0.35) 70%, rgba(10,9,8,0.85) 100%)",
          }}
        />

        <svg
          viewBox="0 0 1600 600"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 h-full w-full opacity-70"
        >
          <path
            d="M 140 500 Q 800 40 1460 500"
            fill="none"
            stroke="rgba(232,220,200,0.14)"
            strokeWidth={1.5}
          />
          <path
            d="M 0 470 C 220 430, 380 460, 520 420 S 820 380, 1000 430 S 1300 400, 1600 460"
            fill="none"
            stroke="#D98C4A"
            strokeWidth={2}
            opacity={0.5}
          />

          {CHAPTERS.map((c, i) => (
            <g key={c.number}>
              <circle
                ref={(el) => {
                  ringRefs.current[i] = el;
                }}
                r={6}
                fill="none"
                stroke="#D98C4A"
                strokeWidth={1.5}
                opacity={0}
              />
              <g
                ref={(el) => {
                  markerRefs.current[i] = el;
                }}
                style={{ opacity: 0.28 }}
              >
                <circle r={5} fill="#D98C4A" />
                <circle
                  r={10}
                  fill="none"
                  stroke="#D98C4A"
                  strokeWidth={1}
                  opacity={0.4}
                />
              </g>
            </g>
          ))}

          <g ref={sunGroupRef}>
            <circle r={26} fill="#EFE6D4" opacity={0.95} />
            <circle
              r={40}
              fill="none"
              stroke="#D98C4A"
              strokeWidth={1}
              opacity={0.5}
            />
            <circle
              r={58}
              fill="none"
              stroke="#D98C4A"
              strokeWidth={0.75}
              opacity={0.25}
            />
          </g>
        </svg>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 mt-10">
        <div className="container mx-auto">
          {CHAPTERS.map((chapter, i) => (
            <section
              key={chapter.number}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              className={`mx-auto flex w-full max-w-3xl flex-col justify-center px-6 md:px-0 ${
                i === 0 ? "min-h-screen pt-32" : "min-h-[70vh] py-28"
              }`}
            >
              <span className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-[#D98C4A]">
                Chapter {chapter.number}
              </span>
              <h2 className="chapter-heading special-font mb-8 text-[10vw] leading-[0.95] text-[#efe6d4] sm:text-[6vw] md:text-[3.6vw] tracking-widest">
                {chapter.heading}
              </h2>
              <div className="flex flex-col gap-4">
                {chapter.lines.map((line, li) => (
                  <p
                    key={li}
                    className="story-line max-w-2xl font-general text-base leading-relaxed text-[#C9BEAE] md:text-lg"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
