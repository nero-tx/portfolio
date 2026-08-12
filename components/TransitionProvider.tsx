"use client";

import React, { useRef, useState } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";
import NeroSigil from "./NeroSigil";

const PALETTE = [
  "#0A0908",
  "#170F09",
  "#241609",
  "#2A1B10",
  "#3D2415",
  "#5A3A22",
] as const;
const DEPTH_PATTERN = [0, 1, 2, 1, 3, 2, 4, 3, 5, 3, 2, 1];
const COLUMN_COUNT = 30;
const COLUMNS = Array.from({ length: COLUMN_COUNT }, (_, i) => ({
  id: i,
  color: PALETTE[DEPTH_PATTERN[i % DEPTH_PATTERN.length]],
}));

export default function ColumnTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sealed, setSealed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement[]>([]);

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const wrapper = wrapperRef.current;
        const overlay = overlayRef.current;
        const logo = logoRef.current;
        const cols = columnsRef.current;

        if (!wrapper || !overlay) {
          next();
          return () => {};
        }

        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        const tl = gsap.timeline({ onComplete: next });

        gsap.set(overlay, {
          display: "flex",
          opacity: 1,
          pointerEvents: "all",
        });

        gsap.set(cols, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        gsap.set(logo, {
          opacity: 0,
          scale: 0.85,
        });

        if (reduced) {
          tl.to([wrapper, cols], { opacity: 0, duration: 0.2 }, 0);
          tl.call(() => setSealed(false), [], 0);
          return () => tl.kill();
        }

        tl.to(
          wrapper,
          {
            scale: 1,
            filter: "brightness(0.35) blur(6px)",
            duration: 0.55,
            ease: "power3.inOut",
          },
          0,
        );

        tl.to(
          cols,
          {
            scaleX: 1.02,
            duration: 0.6,
            ease: "power4.inOut",
            stagger: 0.012,
          },
          0,
        );

        tl.call(() => setSealed(true), [], 0.6);

        tl.to(
          logo,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.4)",
          },
          0.55,
        );

        tl.to({}, { duration: 1.2 });

        tl.to(logo, {
          opacity: 0,
          scale: 0.92,
          duration: 0.25,
          ease: "power3.in",
        });

        tl.call(() => setSealed(false));

        return () => tl.kill();
      }}
      enter={(next) => {
        const wrapper = wrapperRef.current;
        const overlay = overlayRef.current;
        const cols = columnsRef.current;

        if (!wrapper || !overlay) {
          next();
          return () => {};
        }

        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(overlay, {
              display: "none",
              opacity: 0,
              pointerEvents: "none",
            });
            gsap.set(wrapper, { clearProps: "all" });
            next();
          },
        });

        tl.call(() => setSealed(false), [], 0);

        if (reduced) {
          tl.to(wrapper, { opacity: 1, duration: 0.2 }, 0);
          return () => tl.kill();
        }

        gsap.set(cols, { transformOrigin: "right center" });

        tl.to(
          cols,
          {
            scaleX: 0,
            duration: 0.55,
            ease: "power4.inOut",
            stagger: 0.012,
          },
          0,
        );

        tl.to(
          wrapper,
          {
            scale: 1,
            filter: "brightness(1) blur(0px)",
            duration: 0.6,
            ease: "power3.out",
          },
          0.1,
        );

        return () => tl.kill();
      }}
    >
      <div ref={wrapperRef} className="will-change-[transform,filter]">
        {children}
      </div>

      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-9999 opacity-0 flex h-full w-full items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex">
          {COLUMNS.map((col, idx) => (
            <div
              key={col.id}
              ref={(el) => {
                if (el) columnsRef.current[idx] = el;
              }}
              className="h-full flex-1 border-r border-white/5 last:border-r-0 will-change-transform"
              style={{
                backgroundColor: col.color,
                transform: "scaleX(0)",
              }}
            />
          ))}
        </div>

        <div ref={logoRef} className="relative z-10 opacity-0 select-none">
          <NeroSigil size={120} active={sealed} />
        </div>
      </div>
    </TransitionRouter>
  );
}
