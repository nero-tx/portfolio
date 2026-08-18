"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorState = "default" | "link" | "view" | "drag" | "text";

export default function CustomCursor() {
  const dotRef = useRef<SVGCircleElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<SVGPolygonElement>(null);
  const tickRefs = useRef<(SVGLineElement | null)[]>([]);
  const bracketRefs = useRef<(SVGPathElement | null)[]>([]);
  const labelRef = useRef<HTMLSpanElement>(null);
  const rotationTween = useRef<gsap.core.Tween | null>(null);

  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
    if (touch) return;

    document.documentElement.classList.add("custom-cursor-active");

    const dot = dotRef.current!;
    const wrapper = wrapperRef.current!;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const wrapX = gsap.quickTo(wrapper, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    const wrapY = gsap.quickTo(wrapper, "y", {
      duration: 0.25,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      wrapX(e.clientX);
      wrapY(e.clientY);
    };

    const onDown = () => setCursorState((s) => (s === "default" ? "drag" : s));
    const onUp = () => setCursorState((s) => (s === "drag" ? "default" : s));

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let bound: HTMLElement[] = [];
    const attach = () => {
      bound.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter as EventListener);
        el.removeEventListener("mouseleave", handleLeave as EventListener);
      });
      bound = Array.from(
        document.querySelectorAll<HTMLElement>("[data-cursor]"),
      );
      bound.forEach((el) => {
        el.addEventListener("mouseenter", handleEnter as EventListener);
        el.addEventListener("mouseleave", handleLeave as EventListener);
      });
    };

    function handleEnter(this: HTMLElement) {
      const state = (this.dataset.cursor || "link") as CursorState;
      setCursorState(state);
      setLabel(this.dataset.cursorLabel || "");

      if (this.dataset.cursor === "magnetic") {
        const onMagnetMove = (e: MouseEvent) => {
          const rect = this.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          gsap.to(this, {
            x: relX * 0.35,
            y: relY * 0.35,
            duration: 0.4,
            ease: "power2.out",
          });
        };
        const onMagnetLeave = () => {
          gsap.to(this, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
          });
          this.removeEventListener("mousemove", onMagnetMove as EventListener);
        };
        this.addEventListener("mousemove", onMagnetMove as EventListener);
        this.addEventListener("mouseleave", onMagnetLeave as EventListener, {
          once: true,
        });
      }
    }

    function handleLeave() {
      setCursorState("default");
      setLabel("");
    }

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      observer.disconnect();
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (isTouch || !diamondRef.current) return;
    rotationTween.current = gsap.to([diamondRef.current, ...tickRefs.current], {
      rotation: 360,
      transformOrigin: "center",
      duration: 8,
      repeat: -1,
      ease: "none",
    });
    return () => {
      rotationTween.current?.kill();
    };
  }, [isTouch]);

  useEffect(() => {
    const diamond = diamondRef.current;
    const ticks = tickRefs.current;
    const brackets = bracketRefs.current;
    if (!diamond || !brackets.length) return;

    const tl = gsap.timeline({
      defaults: { duration: 0.45, ease: "power3.out" },
    });

    // reset rotation speed
    if (rotationTween.current) {
      rotationTween.current.timeScale(
        cursorState === "drag" ? 4 : cursorState === "view" ? 0 : 1,
      );
    }

    if (cursorState === "view") {
      // diamond dissolves, brackets snap out into a viewfinder
      tl.to(diamond, { opacity: 0, scale: 0.6 }, 0)
        .to(ticks, { opacity: 0 }, 0)
        .to(
          brackets,
          { opacity: 1, scale: 1, stagger: 0.03, transformOrigin: "center" },
          0.05,
        )
        .to(labelRef.current, { opacity: 1, scale: 1 }, 0.15);
    } else {
      tl.to(
        brackets,
        { opacity: 0, scale: 0.7, transformOrigin: "center" },
        0,
      ).to(
        labelRef.current,
        { opacity: label ? 1 : 0, scale: label ? 1 : 0.6 },
        0,
      );

      if (cursorState === "text") {
        tl.to(diamond, { opacity: 0, scale: 0.3 }, 0).to(
          ticks,
          { opacity: 0 },
          0,
        );
      } else if (cursorState === "link") {
        tl.to(diamond, { opacity: 1, scale: 1.3, stroke: "#D98C4A" }, 0).to(
          ticks,
          {
            opacity: 1,
            scale: 1.6,
            stroke: "#D98C4A",
            transformOrigin: "center",
          },
          0,
        );
      } else if (cursorState === "drag") {
        tl.to(
          diamond,
          { opacity: 1, scale: 1.15, strokeDasharray: "4 3" },
          0,
        ).to(ticks, { opacity: 1, scale: 1, transformOrigin: "center" }, 0);
      } else {
        // default
        tl.to(
          diamond,
          {
            opacity: 1,
            scale: 1,
            strokeDasharray: "0 0",
            stroke: "rgba(232,220,200,0.55)",
          },
          0,
        ).to(
          ticks,
          {
            opacity: 0.7,
            scale: 1,
            stroke: "rgba(232,220,200,0.55)",
            transformOrigin: "center",
          },
          0,
        );
      }
    }
  }, [cursorState, label]);

  if (isTouch) return null;

  return (
    <>
      <svg
        className="pointer-events-none fixed left-0 top-0 z-9999 overflow-visible"
        width="1"
        height="1}"
      >
        <circle ref={dotRef} r="2" fill="#E8DCC8" />
      </svg>

      {/* lagged reticle wrapper */}
      <div
        ref={wrapperRef}
        className="pointer-events-none fixed left-0 top-0 z-9998 -translate-x-1/2 -translate-y-1/2"
        style={{ mixBlendMode: "difference" }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          className="overflow-visible"
        >
          {/* diamond / facet outline */}
          <polygon
            ref={diamondRef}
            points="28,10 46,28 28,46 10,28"
            fill="none"
            stroke="rgba(232,220,200,0.55)"
            strokeWidth="1"
          />

          {/* compass ticks: N E S W */}
          <line
            ref={(el) => {
              tickRefs.current[0] = el;
            }}
            x1="28"
            y1="0"
            x2="28"
            y2="6"
            stroke="rgba(232,220,200,0.55)"
            strokeWidth="1"
          />
          <line
            ref={(el) => {
              tickRefs.current[1] = el;
            }}
            x1="50"
            y1="28"
            x2="56"
            y2="28"
            stroke="rgba(232,220,200,0.55)"
            strokeWidth="1"
          />
          <line
            ref={(el) => {
              tickRefs.current[2] = el;
            }}
            x1="28"
            y1="50"
            x2="28"
            y2="56"
            stroke="rgba(232,220,200,0.55)"
            strokeWidth="1"
          />
          <line
            ref={(el) => {
              tickRefs.current[3] = el;
            }}
            x1="0"
            y1="28"
            x2="6"
            y2="28"
            stroke="rgba(232,220,200,0.55)"
            strokeWidth="1"
          />

          {/* viewfinder corner brackets (hidden until "view" state) */}
          {[
            "M4,14 L4,4 L14,4",
            "M42,4 L52,4 L52,14",
            "M52,42 L52,52 L42,52",
            "M14,52 L4,52 L4,42",
          ].map((d, i) => (
            <path
              key={d}
              ref={(el) => {
                bracketRefs.current[i] = el;
              }}
              d={d}
              fill="none"
              stroke="#D98C4A"
              strokeWidth="1.5"
              opacity="0"
            />
          ))}
        </svg>

        <span
          ref={labelRef}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-[#E8DCC8] opacity-0"
        >
          {label}
        </span>
      </div>
    </>
  );
}
