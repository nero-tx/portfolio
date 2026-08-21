"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("custom-cursor-active");

    const dot = dotRef.current;
    const reticle = reticleRef.current;
    const label = labelRef.current;
    if (!dot || !reticle) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let reticleX = mouseX;
    let reticleY = mouseY;
    let isVisible = false;
    let isMouseDown = false;
    let currentState = "default";
    let rafId: number;

    const updatePosition = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = "1";
        reticle.style.opacity = "1";
        reticleX = mouseX;
        reticleY = mouseY;
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    // Smooth RAF loop for the reticle (fast responsive 0.22 lerp, zero jank)
    const loop = () => {
      if (isVisible) {
        const dx = mouseX - reticleX;
        const dy = mouseY - reticleY;
        reticleX += dx * 0.22;
        reticleY += dy * 0.22;

        reticle.style.transform = `translate3d(${reticleX}px, ${reticleY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    // Event delegation for cursor hover states (O(1), zero MutationObserver, zero layout recalculations)
    const onPointerOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      if (target) {
        const state = target.dataset.cursor || "link";
        const labelText = target.dataset.cursorLabel || "";
        currentState = state;
        reticle.dataset.state = state;

        if (label) {
          label.textContent = labelText;
          label.style.opacity = labelText ? "1" : "0";
        }
      }
    };

    const onPointerOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      if (target) {
        const next = (e.relatedTarget as HTMLElement)?.closest?.(
          "[data-cursor]",
        ) as HTMLElement | null;
        if (!next) {
          currentState = "default";
          reticle.dataset.state = isMouseDown ? "drag" : "default";
          if (label) {
            label.textContent = "";
            label.style.opacity = "0";
          }
        }
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
      if (currentState === "default") {
        reticle.dataset.state = "drag";
      }
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1.5)`;
    };

    const onMouseUp = () => {
      isMouseDown = false;
      reticle.dataset.state = currentState;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
    };

    window.addEventListener("pointermove", updatePosition, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", updatePosition);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-9999 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8DCC8] opacity-0 transition-opacity duration-200 will-change-transform shadow-[0_0_8px_rgba(232,220,200,0.8)]"
      />

      <div
        ref={reticleRef}
        data-state="default"
        className="cursor-reticle pointer-events-none fixed top-0 left-0 z-9998 opacity-0 will-change-transform"
      >
        {/* Rotating Compass Outer Diamond */}
        <div className="reticle-dial size-12 relative flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="overflow-visible"
          >
            {/* Diamond frame */}
            <polygon
              points="24,8 40,24 24,40 8,24"
              fill="none"
              stroke="rgba(232, 220, 200, 0.45)"
              strokeWidth="1"
              className="reticle-diamond transition-all duration-300 ease-out"
            />
            {/* Compass Ticks: N, E, S, W */}
            <line
              x1="24"
              y1="0"
              x2="24"
              y2="5"
              stroke="rgba(217, 140, 74, 0.7)"
              strokeWidth="1"
            />
            <line
              x1="43"
              y1="24"
              x2="48"
              y2="24"
              stroke="rgba(217, 140, 74, 0.7)"
              strokeWidth="1"
            />
            <line
              x1="24"
              y1="43"
              x2="24"
              y2="48"
              stroke="rgba(217, 140, 74, 0.7)"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="24"
              x2="5"
              y2="24"
              stroke="rgba(217, 140, 74, 0.7)"
              strokeWidth="1"
            />

            {/* Viewfinder Brackets (Visible in "view" state) */}
            <path
              d="M4,12 L4,4 L12,4"
              fill="none"
              stroke="#D98C4A"
              strokeWidth="1.5"
              className="bracket-tl opacity-0 transition-opacity duration-300"
            />
            <path
              d="M36,4 L44,4 L44,12"
              fill="none"
              stroke="#D98C4A"
              strokeWidth="1.5"
              className="bracket-tr opacity-0 transition-opacity duration-300"
            />
            <path
              d="M44,36 L44,44 L36,44"
              fill="none"
              stroke="#D98C4A"
              strokeWidth="1.5"
              className="bracket-br opacity-0 transition-opacity duration-300"
            />
            <path
              d="M12,44 L4,44 L4,36"
              fill="none"
              stroke="#D98C4A"
              strokeWidth="1.5"
              className="bracket-bl opacity-0 transition-opacity duration-300"
            />
          </svg>
        </div>

        {/* Tactical HUD Label */}
        <span
          ref={labelRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.25em] text-[#E8DCC8] opacity-0 transition-all duration-300 bg-[#0a0806]/85 px-1.5 py-0.5 rounded border border-[#D98C4A]/40"
        />
      </div>

      <style>{`
        /* 60fps / 120fps CSS GPU-driven state transitions */
        .reticle-dial {
          animation: reticle-spin 12s linear infinite;
        }

        @keyframes reticle-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cursor-reticle[data-state="link"] .reticle-diamond {
          transform: scale(1.3);
          transform-origin: center;
          stroke: #D98C4A;
          stroke-width: 1.5;
        }

        .cursor-reticle[data-state="drag"] .reticle-diamond {
          transform: scale(1.15);
          transform-origin: center;
          stroke-dasharray: 4 3;
          stroke: #D98C4A;
        }

        .cursor-reticle[data-state="view"] .reticle-diamond {
          opacity: 0;
          transform: scale(0.6);
          transform-origin: center;
        }

        .cursor-reticle[data-state="view"] .bracket-tl,
        .cursor-reticle[data-state="view"] .bracket-tr,
        .cursor-reticle[data-state="view"] .bracket-br,
        .cursor-reticle[data-state="view"] .bracket-bl {
          opacity: 1;
        }

        .cursor-reticle[data-state="view"] .reticle-dial {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}
