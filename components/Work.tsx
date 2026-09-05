"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const DUST_LAYERS_DESKTOP = [
  { count: 12, size: [1, 2], depth: 0.15 },
  { count: 8, size: [2, 3.5], depth: 0.32 },
  { count: 5, size: [3, 5], depth: 0.55 },
] as const;

const DUST_LAYERS_MOBILE = [
  { count: 6, size: [1, 2], depth: 0.18 },
  { count: 4, size: [2, 3.5], depth: 0.35 },
] as const;

const VIEWBOX_H = 900;
const SUN_CY = 420;
const SUN_R = 64;

export default function WorkHero() {
  const root = useRef<HTMLDivElement>(null);
  const headlineWrap = useRef<HTMLHeadingElement>(null);
  const subline = useRef<HTMLParagraphElement>(null);
  const scrollLabel = useRef<HTMLSpanElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  const ridgeBack = useRef<SVGGElement>(null);
  const ridgeMid = useRef<SVGGElement>(null);
  const ridgeFront = useRef<SVGGElement>(null);
  const sunGroup = useRef<SVGGElement>(null);
  const sunClip = useRef<SVGRectElement>(null);
  const orbitOuter = useRef<SVGCircleElement>(null);
  const orbitInner = useRef<SVGCircleElement>(null);
  const shockRing = useRef<SVGCircleElement>(null);

  const [viewBoxW, setViewBoxW] = useState(1600);
  const [isMobile, setIsMobile] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const el = svgWrapRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0) {
        const aspect = rect.width / rect.height;
        setViewBoxW(Math.max(600, Math.round(VIEWBOX_H * aspect)));
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const sync = () => {
      setIsMobile(mqMobile.matches);
      setIsCoarsePointer(mqCoarse.matches);
    };
    sync();
    mqMobile.addEventListener("change", sync);
    mqCoarse.addEventListener("change", sync);
    return () => {
      mqMobile.removeEventListener("change", sync);
      mqCoarse.removeEventListener("change", sync);
    };
  }, []);

  const isNarrow = viewBoxW / VIEWBOX_H < 1.1;
  const sunXPercent = isNarrow ? 0.58 : 0.74;
  const SUN_CX = Math.round(viewBoxW * sunXPercent);

  const dustLayers = isMobile ? DUST_LAYERS_MOBILE : DUST_LAYERS_DESKTOP;

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
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        scaleY: 1.25,
        transformOrigin: "0% 100%",
      });

      if (sunClip.current) {
        gsap.set(sunClip.current, { y: -(SUN_R * 2 + 4) });
      }
      if (shockRing.current) {
        gsap.set(shockRing.current, {
          scale: 0,
          opacity: 0,
          svgOrigin: `${SUN_CX} ${SUN_CY}`,
        });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (sunClip.current) {
        tl.to(sunClip.current, {
          y: SUN_R * 2 + 4,
          duration: reduceMotion ? 0.01 : isMobile ? 1 : 1.3,
          ease: "power2.inOut",
        });
      }

      tl.to(
        split.lines,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          scaleY: 1,
          duration: reduceMotion ? 0.01 : isMobile ? 0.8 : 1,
          stagger: isMobile ? 0.07 : 0.1,
          ease: "power4.out",
        },
        reduceMotion ? 0 : isMobile ? "-=0.55" : "-=0.7",
      ).to(
        subline.current,
        { opacity: 1, y: 0, duration: reduceMotion ? 0.01 : 0.8 },
        "-=0.5",
      );

      if (shockRing.current) {
        tl.to(
          shockRing.current,
          {
            scale: isMobile ? 2.2 : 3,
            opacity: 0,
            duration: reduceMotion ? 0.01 : 1,
            ease: "power2.out",
          },
          "-=0.6",
        ).set(shockRing.current, { opacity: 0.9 }, "<");
      }

      if (scrollLabel.current) {
        tl.to(scrollLabel.current, { opacity: 0.6, duration: 0.6 }, "-=0.3");
      }

      if (reduceMotion) return;

      const orbitTweens = [orbitOuter.current, orbitInner.current]
        .filter(Boolean)
        .map((el, i) =>
          gsap.to(el, {
            rotation: i === 0 ? 360 : -360,
            duration: i === 0 ? 22 : 15,
            repeat: -1,
            ease: "none",
            svgOrigin: `${SUN_CX} ${SUN_CY}`,
          }),
        );

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

      if (isCoarsePointer) return;

      const quickX = gsap.quickTo(sceneRef.current, "x", {
        duration: 1.1,
        ease: "power3.out",
      });
      const quickY = gsap.quickTo(sceneRef.current, "y", {
        duration: 1.1,
        ease: "power3.out",
      });
      const quickBack = gsap.quickTo(ridgeBack.current, "x", {
        duration: 1.6,
        ease: "power3.out",
      });
      const quickMid = gsap.quickTo(ridgeMid.current, "x", {
        duration: 1.3,
        ease: "power3.out",
      });
      const quickFront = gsap.quickTo(ridgeFront.current, "x", {
        duration: 1,
        ease: "power3.out",
      });
      const quickSun = gsap.quickTo(sunGroup.current, "x", {
        duration: 1.4,
        ease: "power3.out",
      });

      const onPointerMove = (e: PointerEvent) => {
        const { innerWidth, innerHeight } = window;
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        quickX(nx * 14);
        quickY(ny * 10);
        quickBack(nx * 6);
        quickMid(nx * 14);
        quickFront(nx * 26);
        quickSun(nx * -10);
      };
      window.addEventListener("pointermove", onPointerMove);

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        orbitTweens.forEach((t) => t.kill());
      };
    },
    { scope: root, dependencies: [viewBoxW, isMobile, isCoarsePointer] },
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
        <div ref={svgWrapRef} className="absolute inset-0">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${viewBoxW} ${VIEWBOX_H}`}
            preserveAspectRatio="xMidYMax slice"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="sun-clip">
                <rect
                  x={SUN_CX - SUN_R - 4}
                  y={SUN_CY - SUN_R - 4}
                  width={SUN_R * 2 + 8}
                  height={SUN_R * 2 + 8}
                />
              </clipPath>
            </defs>

            <g ref={sunGroup} clipPath="url(#sun-clip)">
              <circle
                cx={SUN_CX}
                cy={SUN_CY}
                r={SUN_R}
                fill="#D98C4A"
                opacity="0.85"
              />
              <rect
                ref={sunClip}
                x={SUN_CX - SUN_R - 8}
                y={SUN_CY - SUN_R - 4}
                width={SUN_R * 2 + 16}
                height={SUN_R * 2 + 8}
                fill="#0A0908"
              />
            </g>
            <circle
              ref={orbitOuter}
              cx={SUN_CX}
              cy={SUN_CY}
              r={SUN_R + 34}
              fill="none"
              stroke="#D98C4A"
              strokeOpacity="0.25"
              strokeWidth="0.75"
              strokeDasharray="2 8"
            />
            {!isMobile && (
              <circle
                ref={orbitInner}
                cx={SUN_CX}
                cy={SUN_CY}
                r={SUN_R + 18}
                fill="none"
                stroke="#EFE6D4"
                strokeOpacity="0.18"
                strokeWidth="0.5"
                strokeDasharray="1 6"
              />
            )}
            <circle
              ref={shockRing}
              cx={SUN_CX}
              cy={SUN_CY}
              r={SUN_R}
              fill="none"
              stroke="#D98C4A"
              strokeWidth="1.5"
            />

            <g ref={ridgeBack} opacity="0.35">
              <path
                d={`M0,620 C${viewBoxW * 0.19},560 ${viewBoxW * 0.31},600 ${viewBoxW * 0.5},560 C${viewBoxW * 0.69},520 ${viewBoxW * 0.84},560 ${viewBoxW},540 L${viewBoxW},900 L0,900 Z`}
                fill="#3A2A1D"
              />
            </g>
            <g ref={ridgeMid} opacity="0.55">
              <path
                d={`M0,700 C${viewBoxW * 0.16},660 ${viewBoxW * 0.34},700 ${viewBoxW * 0.53},660 C${viewBoxW * 0.72},620 ${viewBoxW * 0.88},660 ${viewBoxW},640 L${viewBoxW},900 L0,900 Z`}
                fill="#2B1D14"
              />
            </g>
            <g ref={ridgeFront} opacity="0.9">
              <path
                d={`M0,780 C${viewBoxW * 0.19},740 ${viewBoxW * 0.38},790 ${viewBoxW * 0.56},750 C${viewBoxW * 0.75},710 ${viewBoxW * 0.88},760 ${viewBoxW},730 L${viewBoxW},900 L0,900 Z`}
                fill="#0A0908"
              />
            </g>
          </svg>
        </div>

        <div ref={dustRef} className="absolute inset-0">
          {dustLayers.map((layer, li) =>
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

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 sm:px-10 md:px-20 md:pb-36">
          <h1
            ref={headlineWrap}
            className="max-w-3xl font-general leading-[0.95] tracking-tight text-[#E8DCC8]"
            style={{ fontSize: "clamp(2.75rem, 11vw, 7rem)" }}
          >
            Selected Work
          </h1>
          <p
            ref={subline}
            className="mt-5 max-w-md translate-y-3 font-general text-sm text-[#E8DCC8]/70 opacity-0 sm:mt-6 md:text-base"
          >
            Interfaces built like architecture — deliberate, load-bearing, built
            to outlast the demo.
          </p>
        </div>
      </div>

      <span
        ref={scrollLabel}
        className="absolute bottom-6 right-6 z-20 font-mono text-[10px] tracking-wide text-[#E8DCC8] opacity-0 sm:bottom-10 sm:right-[10%] sm:text-xs"
      >
        Scroll
      </span>
    </section>
  );
}
