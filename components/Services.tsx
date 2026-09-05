"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import ImageReveal from "./ImageReveal";
import { services } from "@/utils/main-data";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const SERVICE_METRICS = [
  { vector: "VECTOR // DIRECTION & PRODUCT ARCHITECTURE", code: "SYS-01" },
  { vector: "VECTOR // FULL-STACK & SCALABLE SYSTEMS", code: "SYS-02" },
  { vector: "VECTOR // NEURAL WORKFLOWS & AI AGENTS", code: "SYS-03" },
  { vector: "VECTOR // IMMERSIVE MOTION & CREATIVE LAB", code: "SYS-04" },
] as const;

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".services-bg-watermark", {
          xPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        const isMobile = window.innerWidth < 768;
        let titleSplit: InstanceType<typeof SplitText> | null = null;

        if (!isMobile) {
          titleSplit = new SplitText(".services-header-title", {
            type: "lines,words",
          });

          gsap.set(titleSplit.words, {
            autoAlpha: 0,
            yPercent: 100,
            rotateX: -20,
          });

          gsap.to(titleSplit.words, {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            stagger: 0.04,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".services-header-title",
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        } else {
          gsap.fromTo(
            ".services-header-title",
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".services-header-title",
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        gsap.from(".services-hud-badge", {
          opacity: 0,
          x: -24,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-hud-badge",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".services-header-divider", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".services-header-divider",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        const rows = gsap.utils.toArray<HTMLElement>(".service-row");

        rows.forEach((row) => {
          const strata = row.querySelector(".row-strata");
          const indexBadge = row.querySelector(".row-index-badge");
          const title = row.querySelector(".row-title");
          const desc = row.querySelector(".row-description");
          const tags = row.querySelectorAll(".row-tag-item");
          const visual = row.querySelector(".row-visual-wrap");
          const cornerTl = row.querySelector(".corner-tl");
          const cornerBr = row.querySelector(".corner-br");

          // Explicitly set initial hidden states with autoAlpha to eliminate race conditions
          gsap.set([indexBadge, title, desc, visual, cornerTl, cornerBr], {
            autoAlpha: 0,
          });
          gsap.set(tags, { autoAlpha: 0, y: 14 });
          gsap.set(strata, { scaleY: 0, transformOrigin: "top" });
          gsap.set(indexBadge, { x: -16 });
          gsap.set(title, { y: 28 });
          gsap.set(desc, { y: 20 });
          gsap.set(visual, { scale: 0.94, y: 15 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            defaults: { ease: "power3.out", duration: 0.8 },
          });

          tl.to(strata, { scaleY: 1, duration: 0.6, ease: "power2.out" })
            .to(indexBadge, { autoAlpha: 1, x: 0 }, "<0.05")
            .to(title, { autoAlpha: 1, y: 0 }, "<0.05")
            .to(desc, { autoAlpha: 1, y: 0 }, "<0.1")
            .to(
              tags,
              { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.5 },
              "<0.1",
            )
            .to(
              visual,
              { autoAlpha: 1, scale: 1, y: 0, duration: 0.85 },
              "<0.1",
            )
            .to([cornerTl, cornerBr], { autoAlpha: 1, duration: 0.4 }, "<");
        });

        return () => {
          titleSplit?.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    idx: number,
  ) => {
    const el = rowRefs.current[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mouse-x", `${x}%`);
    el.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen w-full overflow-hidden py-32 text-[#E9DFC8]"
    >
      <div
        aria-hidden="true"
        className="services-bg-watermark pointer-events-none absolute left-0 top-1/3 -translate-y-1/2 select-none whitespace-nowrap font-robert-regular text-[16vw] font-bold uppercase tracking-tighter text-[#D98C4A]/4 will-change-transform"
      >
        DISCIPLINES // ARCHITECTURE // MOTION
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(217,140,74,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(180,120,55,0.05),transparent_45%)]" />
      </div>

      <div className="container relative mx-auto px-6 md:px-12">
        <div className="mb-16">
          <div className="services-hud-badge mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#D98C4A] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#D98C4A]" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D98C4A]">
                // CORE CAPABILITIES
              </span>
            </div>

            <div className="hidden font-mono text-[9px] uppercase tracking-[0.3em] text-[#E8DCC8]/40 sm:block">
              SPEC: 04 VECTORS // DEPLOYED
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2 className="services-header-title font-robert-medium text-[clamp(2.4rem,5vw,5rem)] leading-[1.05] tracking-tight text-[#E9DFC8]">
                Strategy. Systems.
                <br />
                <span className="text-[#D98C4A]">Pure Execution.</span>
              </h2>
            </div>

            <div className="lg:col-span-4 lg:pb-2">
              <p className="font-general text-sm leading-relaxed text-[#A6998A] md:text-base">
                Engineering resilient digital infrastructure, AI-augmented
                systems, and expressive interactive worlds that elevate product
                standards.
              </p>
            </div>
          </div>

          <div className="services-header-divider relative mt-10 h-px w-full bg-linear-to-r from-[#D98C4A]/60 via-white/10 to-transparent" />
        </div>

        <div className="flex flex-col gap-4">
          {services.map((service, i) => {
            const isHovered = hoveredIndex === i;
            const isAnyHovered = hoveredIndex !== null;
            const metric = SERVICE_METRICS[i] || {
              vector: "VECTOR // ADVANCED DIGITAL SYSTEMS",
              code: `SYS-0${i + 1}`,
            };

            return (
              <div
                key={service.title}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                data-cursor="view"
                data-cursor-label={`DISCIPLINE 0${i + 1}`}
                onMouseEnter={() => {
                  setHoveredIndex(i);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                onMouseMove={(e) => handleMouseMove(e, i)}
                className={`service-row group relative overflow-hidden rounded-md border border-[#E8DCC8]/8 bg-[#0b0806]/70 p-6 backdrop-blur-md transition-all duration-500 md:p-10 ${
                  isHovered
                    ? "border-[#D98C4A]/60 shadow-[0_0_40px_rgba(217,140,74,0.08)]"
                    : isAnyHovered
                      ? "opacity-45"
                      : "opacity-100"
                }`}
                style={{
                  // @ts-ignore
                  "--mouse-x": "50%",
                  // @ts-ignore
                  "--mouse-y": "50%",
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(217,140,74,0.12), transparent 70%)",
                  }}
                />

                <div className="corner-tl pointer-events-none absolute left-2 top-2 size-3 border-l border-t border-[#D98C4A]/40 transition-colors duration-300 group-hover:border-[#D98C4A]" />
                <div className="corner-br pointer-events-none absolute bottom-2 right-2 size-3 border-b border-r border-[#D98C4A]/40 transition-colors duration-300 group-hover:border-[#D98C4A]" />

                <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="row-strata h-3.5 w-1 bg-[#D98C4A]" />
                    <span className="row-index-badge font-mono text-[10px] tracking-[0.3em] text-[#D98C4A]">
                      [ 0{i + 1} / 0{services.length} ]
                    </span>
                    <span className="hidden font-mono text-[9px] tracking-[0.2em] text-[#E8DCC8]/40 md:inline-block">
                      {metric.vector}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-[#E8DCC8]/30">
                      {metric.code}
                    </span>
                    <ArrowUpRight className="size-3.5 text-[#D98C4A]/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#D98C4A]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-5">
                    <div className="relative overflow-hidden">
                      <h3 className="row-title font-robert-medium text-[clamp(1.8rem,3.2vw,3.6rem)] leading-none tracking-tight text-[#E9DFC8] transition-colors duration-300 group-hover:text-white">
                        {service.title}
                      </h3>
                    </div>

                    <p className="row-description mt-4 font-general text-sm leading-relaxed text-[#A6998A] transition-colors duration-300 group-hover:text-[#D1C7BA] md:text-base">
                      {service.description}
                    </p>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[#D98C4A]/70">
                      TECH STACK & METHODOLOGY
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <li
                          key={tag}
                          className="row-tag-item rounded-xs border border-[#E8DCC8]/10 bg-[#16100c]/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#D5C7B3] transition-all duration-300 hover:scale-105 hover:border-[#D98C4A]/80 hover:bg-[#D98C4A]/15 hover:text-[#F3C28D]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="row-visual-wrap lg:col-span-3">
                    <div className="relative overflow-hidden rounded-md transition-all duration-500 ">
                      <ImageReveal
                        source={`/images/serv-${i + 1}.jpg`}
                        imgAlt={service.title}
                        className="h-48 w-full sm:h-56 lg:h-52"
                      />
                      <div className="pointer-events-none absolute bottom-2 left-2 rounded-xs bg-[#0b0806]/85 px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-[#D98C4A]">
                        ACT_0{i + 1} // LIVE
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 h-px w-0 bg-linear-to-r from-[#D98C4A] via-[#D98C4A]/40 to-transparent transition-all duration-700 ease-out group-hover:w-full" />
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#E8DCC8]/40">
            SYSTEM ARCHITECTURE · HIGH AVAILABILITY · IMMERSIVE INTERFACE
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-[#D98C4A]">
            <span className="size-1.5 rounded-full bg-[#D98C4A]" />
            <span>ARRAKIS CORE READY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
