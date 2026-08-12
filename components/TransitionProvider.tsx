"use client";

import React, { useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";

// Generate 30 columns with an Arrakis / Dune palette gradient
const COLUMN_COUNT = 30;
const COLUMNS = Array.from({ length: COLUMN_COUNT }).map((_, index) => {
  const progress = index / (COLUMN_COUNT - 1);

  let bg = "#0c0a09";
  if (progress < 0.4) {
    bg = `color-mix(in srgb, #0c0a09 ${100 - progress * 250}%, #7c2d12)`;
  } else if (progress < 0.8) {
    const localProg = (progress - 0.4) / 0.4;
    bg = `color-mix(in srgb, #7c2d12 ${100 - localProg * 100}%, #d97706)`;
  } else {
    const localProg = (progress - 0.8) / 0.2;
    bg = `color-mix(in srgb, #d97706 ${100 - localProg * 100}%, #0c0a09)`;
  }

  return { id: index, bg };
});

export default function ColumnTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const overlayRef = useRef<HTMLDivElement>(null!);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const tl = gsap.timeline({ onComplete: next });

        const cols = columnsRef.current.filter(Boolean);

        // Make overlay visible and active during transition
        gsap.set(overlayRef.current, {
          display: "flex",
          pointerEvents: "all",
          opacity: 1,
        });

        // Set transform origin LEFT so blocks scale out towards the RIGHT
        gsap.set(cols, {
          transformOrigin: "left center",
          scaleX: 0,
        });

        if (reduced) {
          tl.to(wrapperRef.current, { opacity: 0, duration: 0.35 });
          tl.to(cols, { scaleX: 1, duration: 0.35 }, 0);
          return () => tl.kill();
        }

        // 1. Page Content Depth Effect
        tl.to(
          wrapperRef.current,
          {
            scale: 0.96,
            filter: "blur(8px) brightness(0.5)",
            duration: 0.8,
            ease: "power3.inOut",
          },
          0,
        );

        // 2. 30 Columns Stagger Sweep (Left to Right)
        tl.to(
          cols,
          {
            scaleX: 1.02, // Prevents sub-pixel gaps between columns
            duration: 0.55,
            ease: "power4.inOut",
            stagger: {
              each: 0.015,
              from: "start",
            },
          },
          0,
        );

        return () => tl.kill();
      }}
      enter={(next) => {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const tl = gsap.timeline({
          onComplete: () => {
            // Completely hide the overlay container so it disappears from DOM layer tree
            gsap.set(overlayRef.current, {
              display: "none",
              pointerEvents: "none",
              opacity: 0,
            });

            // Clean inline transform & blur styles off your page wrapper
            gsap.set(wrapperRef.current, { clearProps: "all" });

            next();
          },
        });

        const cols = columnsRef.current.filter(Boolean);

        if (reduced) {
          tl.to(wrapperRef.current, { opacity: 1, duration: 0.35 });
          tl.to(cols, { scaleX: 0, duration: 0.35 }, 0);
          return () => tl.kill();
        }

        // Set transform origin RIGHT so shrinking scaleX collapses from left-to-right
        gsap.set(cols, {
          transformOrigin: "right center",
        });

        // 1. 30 Columns Collapse Sweep (Left to Right)
        tl.to(
          cols,
          {
            scaleX: 0,
            duration: 0.55,
            ease: "power4.inOut",
            stagger: {
              each: 0.015,
              from: "start",
            },
          },
          0,
        );

        tl.to(
          wrapperRef.current,
          {
            scale: 1,
            filter: "blur(0px) brightness(1)",
            duration: 0.6,
            ease: "power3.out",
          },
          0.15,
        );

        return () => tl.kill();
      }}
    >
      <div
        ref={wrapperRef}
        className="will-change-[transform,filter] transition-none"
      >
        {children}
      </div>

      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-50 hidden opacity-0 h-full w-full overflow-hidden"
        aria-hidden="true"
      >
        {COLUMNS.map((col, i) => (
          <div
            key={col.id}
            ref={(el) => {
              columnsRef.current[i] = el;
            }}
            className="h-full flex-1 will-change-transform"
            style={{
              backgroundColor: col.bg,
              transform: "scaleX(0)",
            }}
          />
        ))}

        {/* Dune Film Grain Texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </TransitionRouter>
  );
}
