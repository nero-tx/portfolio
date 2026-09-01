"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectMedia } from "@/utils/main-data";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  media: ProjectMedia[];
  className?: string;
}

export default function ImageScrollGallery({ media, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const items = gsap.utils.toArray<HTMLElement>(
        ".gallery-item",
        root.current,
      );
      if (!items.length) return;

      items.forEach((item) => {
        const frame = item.querySelector<HTMLElement>(".gallery-frame");
        const media = item.querySelector<HTMLElement>(".gallery-media");

        if (!frame || !media) return;

        if (reduceMotion) {
          gsap.set(frame, {
            clipPath: "inset(0% 0% 0% 0%)",
          });

          gsap.set(media, {
            yPercent: 0,
            scale: 1,
            filter: "blur(0px)",
          });

          return;
        }

        gsap.set(frame, {
          clipPath: "inset(100% 0% 0% 0%)",
        });

        gsap.set(media, {
          yPercent: 8,
          scale: 1.08,
          filter: "blur(8px)",
          transformOrigin: "center center",
        });

        const reveal = gsap.timeline({
          paused: true,
          defaults: {
            overwrite: "auto",
          },
        });

        reveal
          .to(
            frame,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.15,
              ease: "power4.out",
            },
            0,
          )
          .to(
            media,
            {
              yPercent: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.45,
              ease: "power3.out",
            },
            0.05,
          );

        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          once: true,
          onEnter: () => reveal.play(),
        });

        gsap.to(media, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root, dependencies: [media] },
  );

  return (
    <div ref={root} className={`flex flex-col gap-24 ${className}`}>
      {media.map((m, i) => (
        <div key={i} className="gallery-item">
          <div className="gallery-frame relative aspect-video w-full overflow-hidden rounded-lg">
            {m.type === "image" ? (
              <img
                src={m.src}
                alt={m.alt}
                className="gallery-media h-full w-full object-cover brightness-90"
              />
            ) : (
              <video
                src={m.src}
                poster={m.poster}
                muted
                loop
                autoPlay
                playsInline
                className="gallery-media h-full w-full object-cover brightness-90"
              />
            )}
          </div>
          {m.caption && (
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#E8DCC8]/40">
              {String(i + 1).padStart(2, "0")} — {m.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function NoVisualsFallback({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-[#E8DCC8]/10 bg-[#0A0908] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="dust-mote absolute rounded-full bg-[#E8DCC8]/25"
            style={{
              left: `${(i * 37) % 100}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              animationDuration: `${8 + (i % 6)}s`,
              animationDelay: `${-(i * 1.3)}s`,
            }}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, rgba(217,140,74,0.06), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 400 160"
        className="dune-draw absolute bottom-0 left-0 w-full text-[#E8DCC8]/15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <path
          d="M0 120 Q 60 90 120 110 T 240 100 T 400 115 V160 H0 Z"
          className="dune-back"
        />
        <path
          d="M0 140 Q 80 105 160 130 T 320 120 T 400 135 V160 H0 Z"
          className="dune-front"
        />
      </svg>

      {/* label */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <span className="h-px w-8 bg-[#E8DCC8]/20" />
        <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#E8DCC8]/35">
          No preview available
        </span>
      </div>

      <style jsx>{`
        .dust-mote {
          bottom: -4px;
          opacity: 0;
          animation-name: dust-rise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes dust-rise {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-140px);
            opacity: 0;
          }
        }

        .dune-back,
        .dune-front {
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation: dune-draw 2.4s ease-out forwards;
        }
        .dune-front {
          animation-delay: 0.25s;
        }
        @keyframes dune-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dust-mote {
            animation: none;
            opacity: 0.2;
          }
          .dune-back,
          .dune-front {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
