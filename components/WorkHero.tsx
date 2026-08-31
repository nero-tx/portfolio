"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const DUST_LAYERS = [
  { count: 14, size: [1, 2], depth: 0.15, duration: 46 },
  { count: 10, size: [2, 3.5], depth: 0.32, duration: 34 },
  { count: 6, size: [3, 5], depth: 0.55, duration: 26 },
] as const;

export default function WorkHero() {
  const root = useRef<HTMLDivElement>(null);
  const headlineWrap = useRef<HTMLHeadingElement>(null);
  const subline = useRef<HTMLParagraphElement>(null);
  const lineSvg = useRef<SVGSVGElement>(null);
  const linePath = useRef<SVGLineElement>(null);
  const marker = useRef<SVGCircleElement>(null);
  const scrollLabel = useRef<HTMLSpanElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const split = new SplitText(headlineWrap.current, {
        type: "lines",
        linesClass: "wh-line",
      });

      gsap.set(split.lines, {
        clipPath: "inset(0% 0% 100% 0%)",
        filter: "blur(14px)",
        y: 18,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      if (linePath.current) {
        const length = linePath.current.getTotalLength();
        gsap.set(linePath.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.to(linePath.current, {
          strokeDashoffset: 0,
          duration: reduceMotion ? 0.01 : 1.6,
          ease: "power2.inOut",
        });
      }

      tl.to(
        split.lines,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          filter: "blur(0px)",
          y: 0,
          duration: reduceMotion ? 0.01 : 1.1,
          stagger: 0.12,
        },
        reduceMotion ? 0 : "-=1.0",
      ).to(
        subline.current,
        { opacity: 1, y: 0, duration: reduceMotion ? 0.01 : 0.9 },
        "-=0.5",
      );

      if (marker.current) {
        gsap.set(marker.current, { opacity: 0 });
        tl.to(marker.current, { opacity: 1, duration: 0.4 }, "-=0.3");
      }
      if (scrollLabel.current) {
        tl.to(scrollLabel.current, { opacity: 0.6, duration: 0.6 }, "-=0.3");
      }

      if (reduceMotion) return;

      if (dustRef.current) {
        const motes =
          dustRef.current.querySelectorAll<HTMLElement>("[data-mote]");
        motes.forEach((mote) => {
          const duration = 20 + Math.random() * 20;
          const xDrift = (Math.random() - 0.5) * 60;
          gsap.to(mote, {
            y: "-=120",
            x: `+=${xDrift}`,
            duration,
            repeat: -1,
            ease: "none",
            delay: -Math.random() * duration,
          });
        });
      }

      const quickX = gsap.quickTo(sceneRef.current, "x", {
        duration: 1.1,
        ease: "power3.out",
      });
      const quickY = gsap.quickTo(sceneRef.current, "y", {
        duration: 1.1,
        ease: "power3.out",
      });
      const quickLineX = gsap.quickTo(lineSvg.current, "x", {
        duration: 1.4,
        ease: "power3.out",
      });

      const onPointerMove = (e: PointerEvent) => {
        const { innerWidth, innerHeight } = window;
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        quickX(nx * 14);
        quickY(ny * 10);
        quickLineX(nx * -8);
      };
      window.addEventListener("pointermove", onPointerMove);

      const marker0 = marker.current;
      const lineLength = linePath.current?.getTotalLength() ?? 0;

      const exit = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            if (marker0 && linePath.current) {
              const pt = linePath.current.getPointAtLength(
                self.progress * lineLength,
              );
              gsap.set(marker0, { attr: { cx: pt.x, cy: pt.y } });
            }
          },
        },
      });

      exit
        .to(
          sceneRef.current,
          { scale: 0.9, opacity: 0, duration: 1, ease: "power2.inOut" },
          0,
        )
        .to(
          lineSvg.current,
          { opacity: 0, duration: 0.6, ease: "power1.in" },
          0.4,
        )
        .to(
          root.current,
          {
            backgroundColor: "#000000",
            duration: 1,
            ease: "power2.inOut",
          },
          0,
        );

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative h-dvh w-full overflow-hidden bg-[#0A0908] text-[#E8DCC8]"
    >
      <div className="wh-grain pointer-events-none absolute inset-0 z-30 opacity-6 mix-blend-overlay" />

      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, transparent 30%, #0A0908 92%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[45%] opacity-40"
        style={{
          background: "linear-gradient(to top, #2B1D14 0%, transparent 100%)",
          filter: "blur(40px)",
        }}
      />

      <div ref={sceneRef} className="absolute inset-0 z-10">
        <div ref={dustRef} className="absolute inset-0">
          {DUST_LAYERS.map((layer, li) =>
            Array.from({ length: layer.count }).map((_, i) => {
              const size =
                layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]);
              return (
                <div
                  key={`${li}-${i}`}
                  data-mote
                  className="absolute rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${60 + Math.random() * 40}%`,
                    width: size,
                    height: size,
                    background: "#8A7A63",
                    opacity: layer.depth,
                    filter: `blur(${(1 - layer.depth) * 1.5}px)`,
                  }}
                />
              );
            }),
          )}
        </div>

        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-28 md:px-20 md:pb-36">
          <h1
            ref={headlineWrap}
            className="max-w-3xl font-general text-[13vw] leading-[0.95] tracking-tight text-[#E8DCC8] md:text-[6.5vw]"
          >
            Selected Work
          </h1>
          <p
            ref={subline}
            className="mt-6 max-w-md translate-y-3 font-[Space_Grotesk] text-sm text-[#E8DCC8]/70 opacity-0 md:text-base"
          >
            Interfaces built like architecture — deliberate, load-bearing, built
            to outlast the demo.
          </p>
        </div>
      </div>

      <svg
        ref={lineSvg}
        className="pointer-events-none absolute right-[14%] top-0 z-20 h-full w-16"
        viewBox="0 0 64 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          ref={linePath}
          x1="32"
          y1="60"
          x2="32"
          y2="740"
          stroke="#D98C4A"
          strokeWidth="1"
          strokeOpacity="0.55"
        />
        <circle ref={marker} cx="32" cy="60" r="3.5" fill="#D98C4A" />
      </svg>

      {/* scroll cue */}
      <span
        ref={scrollLabel}
        className="absolute bottom-10 right-[14%] z-20 -translate-x-1/2 font-[Space_Grotesk] text-xs tracking-wide text-[#E8DCC8] opacity-0"
      >
        Scroll
      </span>

      <style jsx>{`
        .wh-grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation: wh-flicker 0.6s steps(2) infinite;
        }
        @keyframes wh-flicker {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-1%, 1%);
          }
          100% {
            transform: translate(1%, -1%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .wh-grain {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
