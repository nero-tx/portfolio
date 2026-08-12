"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const TICK_COUNT = 28;

export default function NeroSigil({
  active = false,
  size = 220,
}: {
  active?: boolean;
  size?: number;
}) {
  const ringRef = useRef<SVGCircleElement>(null!);
  const tickGroupRef = useRef<SVGGElement>(null!);
  const monogramRef = useRef<SVGGElement>(null!);
  const crossbarRef = useRef<SVGGElement>(null!);
  const glowRef = useRef<SVGCircleElement>(null!);
  const wordmarkRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const idle = gsap
      .timeline({ repeat: -1 })
      .to(
        tickGroupRef.current,
        { rotate: 360, duration: 90, ease: "none", transformOrigin: "50% 50%" },
        0,
      )
      .to(
        glowRef.current,
        {
          opacity: 0.55,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
        0,
      );
    return () => {
      idle.kill();
    };
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();

    if (active) {
      gsap.set(
        [
          ringRef.current,
          monogramRef.current,
          crossbarRef.current,
          wordmarkRef.current,
        ],
        { opacity: 0 },
      );
      gsap.set(monogramRef.current, { scale: 0.7, transformOrigin: "50% 50%" });
      gsap.set(ringRef.current, { scale: 1.15, transformOrigin: "50% 50%" });
      gsap.set(crossbarRef.current, { scaleX: 0, transformOrigin: "50% 50%" });

      tl.to(
        ringRef.current,
        { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
        0,
      )
        .to(
          monogramRef.current,
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2.2)" },
          0.15,
        )
        .to(
          crossbarRef.current,
          { opacity: 1, scaleX: 1, duration: 0.5, ease: "power2.out" },
          0.4,
        )
        .to(
          wordmarkRef.current,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.55,
        )
        .fromTo(
          glowRef.current,
          { opacity: 0 },
          { opacity: 0.4, duration: 0.8, ease: "power2.out" },
          0.2,
        );
    } else {
      tl.to(
        wordmarkRef.current,
        { opacity: 0, duration: 0.3, ease: "power1.in" },
        0,
      )
        .to(
          crossbarRef.current,
          { opacity: 0, scaleX: 0, duration: 0.35, ease: "power1.in" },
          0.05,
        )
        .to(
          monogramRef.current,
          { opacity: 0, scale: 0.8, duration: 0.4, ease: "power1.in" },
          0.05,
        )
        .to(
          ringRef.current,
          { opacity: 0, scale: 0.9, duration: 0.4, ease: "power1.in" },
          0.1,
        );
    }

    return () => {
      tl.kill();
    };
  }, [active]);

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = (i / TICK_COUNT) * 360;
    const major = i % 7 === 0;
    return (
      <line
        key={i}
        x1={100}
        y1={major ? 10 : 14}
        x2={100}
        y2={20}
        stroke="#E8DCC8"
        strokeOpacity={major ? 0.55 : 0.25}
        strokeWidth={major ? 1.4 : 0.8}
        transform={`rotate(${angle} 100 100)`}
      />
    );
  });

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="nero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F2C879" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#D98C4A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D98C4A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle
          ref={glowRef}
          cx="100"
          cy="100"
          r="70"
          fill="url(#nero-glow)"
          opacity="0"
        />

        <circle
          ref={ringRef}
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="#E8DCC8"
          strokeOpacity="0.5"
          strokeWidth="1"
        />

        <g ref={tickGroupRef}>{ticks}</g>

        <g ref={monogramRef} fill="#E8DCC8">
          <path d="M73,62 L81,62 L81,138 L73,138 L66,131 L66,69 Z" />
          <path d="M119,62 L127,62 L134,69 L134,131 L127,138 L119,138 Z" />
          <path d="M87,64.4 L125,128.4 L113,135.6 L75,71.6 Z" />
        </g>

        <g ref={crossbarRef}>
          <rect x="58" y="98.5" width="84" height="3" fill="#D98C4A" />
          <rect x="55" y="94" width="3" height="12" fill="#D98C4A" />
          <rect x="142" y="94" width="3" height="12" fill="#D98C4A" />
        </g>
      </svg>

      <div
        ref={wordmarkRef}
        className="mt-4 flex flex-col items-center opacity-0"
        style={{ transform: "translateY(8px)" }}
      >
        <span className="text-[1.35rem] font-medium tracking-[0.5em] text-[#E8DCC8]">
          NERO
        </span>
        <div className="mt-2 flex items-center gap-3">
          <span className="h-px w-6 bg-[#D98C4A]/60" />
          <span className="text-[0.65rem] font-medium tracking-[0.4em] text-[#D98C4A]/80">
            TX
          </span>
          <span className="h-px w-6 bg-[#D98C4A]/60" />
        </div>
      </div>
    </div>
  );
}
