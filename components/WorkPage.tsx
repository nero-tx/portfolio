"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/utils/main-data";
import WorkHero from "./WorkHero";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function WorkPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const split = new SplitText(".work-page-title", { type: "chars" });

      if (reduceMotion) {
        gsap.set(split.chars, { opacity: 1, yPercent: 0, rotateX: 0 });
      } else {
        gsap.set(split.chars, {
          yPercent: 120,
          rotateX: -25,
          opacity: 0,
          transformOrigin: "50% 100%",
        });
        gsap.to(split.chars, {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.038,
          delay: 0.15,
        });
      }

      const rows = gsap.utils.toArray<HTMLElement>(".project-row");

      rows.forEach((row) => {
        const imgWrap = row.querySelector<HTMLElement>(".project-img-wrap");
        const lines = row.querySelectorAll<HTMLElement>(".project-title-line");
        const meta = row.querySelector<HTMLElement>(".project-meta");
        const desc = row.querySelector<HTMLElement>(".project-desc");
        const cta = row.querySelector<HTMLElement>(".project-cta");
        const separator = row.querySelector<HTMLElement>(".project-separator");

        if (reduceMotion) {
          gsap.set(
            [imgWrap, ...lines, meta, desc, cta, separator].filter(Boolean),
            { clipPath: "none", yPercent: 0, opacity: 1, y: 0, scaleX: 1 },
          );
          return;
        }

        // Image clip-path reveal
        if (imgWrap) {
          gsap.fromTo(
            imgWrap,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.1,
              ease: "power3.inOut",
              scrollTrigger: { trigger: row, start: "top 78%" },
            },
          );
        }

        // Title lines slide up
        if (lines.length) {
          gsap.fromTo(
            lines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 1.0,
              ease: "power4.out",
              stagger: 0.1,
              scrollTrigger: { trigger: row, start: "top 74%" },
            },
          );
        }

        // Meta / desc / cta stagger
        const targets = [meta, desc, cta].filter(Boolean);
        if (targets.length) {
          gsap.fromTo(
            targets,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: { trigger: row, start: "top 68%" },
            },
          );
        }

        // Separator line
        if (separator) {
          gsap.fromTo(
            separator,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power3.inOut",
              scrollTrigger: { trigger: row, start: "top 88%" },
            },
          );
        }
      });

      return () => {
        split.revert();
      };
    },
    { scope: pageRef },
  );

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen w-full overflow-x-hidden"
    >
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] grain" />

      <WorkHero />

      {/* ── PROJECT LIST ──────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-16">
        {projects.map((project, i) => {
          const isEven = i % 2 === 1;
          return (
            <div key={project.number} className="project-row group relative">
              <div
                className="project-separator origin-left h-px w-full bg-[#E8DCC8]/8"
                style={{ transform: "scaleX(0)" }}
              />

              <div
                className={`flex min-h-[85vh] flex-col gap-10 py-16 md:py-24 md:flex-row md:items-center md:gap-0 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden md:w-[55%] ${
                    isEven ? "md:pl-12" : "md:pr-12"
                  }`}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <img
                      src={project?.bgImage || project.image}
                      alt=""
                      aria-hidden
                      // fill
                      // quality={20}
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className="scale-110 object-cover blur-3xl saturate-150 opacity-30"
                    />
                  </div>

                  <div
                    className="project-img-wrap relative aspect-4/3 overflow-hidden rounded-lg will-change-[clip-path]"
                    style={{ clipPath: "inset(0 100% 0 0)" }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      // fill
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className="object-cover brightness-75 saturate-90 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#070503]/60 via-transparent to-transparent" />

                    <span className="absolute bottom-4 right-5 font-circular-web text-[5rem] font-light leading-none text-white/8 select-none">
                      {project.number}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex w-full flex-col justify-center gap-6 md:w-[45%] ${
                    isEven ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div className="project-meta flex items-center gap-4 opacity-0">
                    <span className="font-mono text-[9px] tracking-[0.45em] text-[#D98C4A]/60">
                      {project.number}
                    </span>
                    <div className="h-px w-6 bg-[#D98C4A]/40" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#E8DCC8]/40">
                      {project.category}
                    </span>
                    <span className="ml-auto font-mono text-[9px] text-[#E8DCC8]/25">
                      {project.year}
                    </span>
                  </div>

                  <div>
                    {project.title.split(" ").map((word, wi) => (
                      <div key={wi} className="overflow-hidden leading-[0.95]">
                        <div
                          className="project-title-line font-circular-web text-[clamp(2.8rem,5.5vw,6.5rem)] font-light leading-[0.95] tracking-tight text-[#EFE6D4] will-change-transform"
                          style={{ transform: "translateY(110%)" }}
                        >
                          {word}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="project-desc max-w-sm font-general text-sm leading-relaxed text-[#E8DCC8]/50 opacity-0">
                    {project.description}
                  </p>

                  <div className="project-cta opacity-0">
                    <Link
                      href={project.slug ? `/work/${project.slug}` : "#"}
                      data-cursor="link"
                      aria-label={`View project: ${project.title}`}
                      className="group/cta inline-flex items-center gap-3"
                    >
                      <span className="relative font-mono text-xs uppercase tracking-[0.3em] text-[#D98C4A]">
                        View Project
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#D98C4A] transition-all duration-400 ease-out group-hover/cta:w-full" />
                      </span>
                      <ArrowUpRight className="size-3.5 text-[#D98C4A] transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="h-px w-full bg-[#E8DCC8]/8" />
      </section>
    </div>
  );
}
