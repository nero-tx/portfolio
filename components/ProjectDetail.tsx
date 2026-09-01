"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Project } from "@/utils/main-data";
import CodePreview from "./CodePreview";
import ImageScrollGallery, { NoVisualsFallback } from "./ImageGallery";
import ProjectNav from "./ProjectNav";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ProjectDetail({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const titleSplit = new SplitText(".detail-title", {
        type: "lines",
        linesClass: "detail-title-line",
      });
      const problemSplit = new SplitText(".problem-statement", {
        type: "lines",
        linesClass: "problem-line",
      });

      if (reduceMotion) {
        gsap.set([titleSplit.lines, problemSplit.lines], {
          yPercent: 0,
          opacity: 1,
        });
        gsap.set(".fade-in-el, .fix-step", { opacity: 1, x: 0, y: 0 });
        gsap.set(".hero-visual", { clipPath: "inset(0% 0% 0% 0%)" });
        return () => {
          titleSplit.revert();
          problemSplit.revert();
        };
      }

      // ── hero title ────────────────────────────────────────────────
      gsap.set(titleSplit.lines, { yPercent: 110 });
      gsap.to(titleSplit.lines, {
        yPercent: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        delay: 0.15,
      });

      gsap.fromTo(
        ".hero-meta",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power3.out" },
      );

      gsap.fromTo(
        ".hero-visual",
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power3.inOut",
          delay: 0.35,
        },
      );

      // ── problem statement, split by line ────────────────────────────
      gsap.set(problemSplit.lines, { yPercent: 100, opacity: 0 });
      gsap.to(problemSplit.lines, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".problem-statement", start: "top 78%" },
      });

      // ── generic fade-ins (meta, context, results) ───────────────────
      gsap.utils.toArray<HTMLElement>(".fade-in-el").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      // ── fix steps, staggered from the left ──────────────────────────
      gsap.fromTo(
        ".fix-step",
        { opacity: 0, x: -18 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".fix-list", start: "top 80%" },
        },
      );

      return () => {
        titleSplit.revert();
        problemSplit.revert();
      };
    },
    { scope: root, dependencies: [project.slug] },
  );

  return (
    <div
      ref={root}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#0A0908] text-[#E8DCC8]"
    >
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] bg-[url('/images/grain.png')]" />

      <div className="relative z-10 px-6 pb-32 pt-28 md:px-16 md:pt-36">
        <header className="mb-20">
          <div className="hero-meta mb-6 flex items-center gap-4 opacity-0">
            <span className="font-mono text-[11px] tracking-[0.4em] text-[#D98C4A]/70">
              {project.number}
            </span>
            <div className="h-px w-6 bg-[#D98C4A]/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E8DCC8]/40">
              {project.category}
            </span>
            <span className="ml-auto font-mono text-[11px] text-[#E8DCC8]/25">
              {project.year}
            </span>
          </div>

          <h1 className="detail-title max-w-4xl overflow-hidden font-[Cinzel] text-[clamp(2.8rem,7vw,6rem)] font-light leading-[0.95] tracking-wide text-[#EFE6D4]">
            {project.title}
          </h1>

          <p className="hero-meta mt-8 max-w-xl font-general text-base leading-relaxed text-[#E8DCC8]/60 opacity-0">
            {project.description}
          </p>

          {project.stack.length > 0 && (
            <div className="hero-meta mt-6 flex flex-wrap gap-2 opacity-0">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[#E8DCC8]/12 px-3 py-1 font-mono text-sm hover:text-foreground transition text-[#E8DCC8]/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <div className="hero-meta mt-8 flex flex-wrap gap-6 opacity-0">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#D98C4A] px-2 py-1"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

                  <span className="absolute -bottom-1 left-0 w-full h-px bg-[#D98C4A] origin-left scale-x-0 group-hover:scale-100 transition-transform duration-500" />
                </a>
              ))}
            </div>
          )}
        </header>

        <div
          className="hero-visual relative mb-28 w-full max-w-6xl overflow-hidden rounded-lg"
          style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        >
          {project.hasVisual && project.media ? (
            <ImageScrollGallery
              media={project.media}
              className="h-full w-full"
            />
          ) : project.codePreview ? (
            <CodePreview
              preview={project.codePreview}
              className="h-full w-full"
            />
          ) : (
            <NoVisualsFallback />
          )}
        </div>

        <section className="mb-28 max-w-3xl">
          <span className="fade-in-el mb-5 block font-mono text-[11px] uppercase tracking-[0.3em] text-[#8C4A3A] opacity-0">
            {project.problem.kicker ?? "The problem"}
          </span>
          <p className="problem-statement overflow-hidden font-[Cinzel] text-[clamp(1.6rem,3.2vw,2.6rem)] font-light leading-tight text-[#EFE6D4]">
            {project.problem.statement}
          </p>
          {project.problem.context && (
            <p className="fade-in-el mt-6 max-w-xl font-general text-sm leading-relaxed text-[#E8DCC8]/50 opacity-0">
              {project.problem.context}
            </p>
          )}
        </section>

        <section className="mb-28 max-w-3xl">
          <span className="fade-in-el mb-6 block font-mono text-[11px] uppercase tracking-[0.3em] text-[#4E8C86] opacity-0">
            {project.fix.kicker ?? "The fix"}
          </span>
          <ol className="fix-list space-y-5">
            {project.fix.approach.map((step, i) => (
              <li key={i} className="fix-step flex gap-4 opacity-0">
                <span className="mt-1 font-mono text-xs text-[#4E8C86]/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-general text-[15px] leading-relaxed text-[#E8DCC8]/70">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {project.results && project.results.length > 0 && (
          <section className="max-w-2xl border-t border-[#E8DCC8]/8 pt-10">
            <span className="fade-in-el mb-6 block font-mono text-[11px] uppercase tracking-[0.3em] text-[#E8DCC8]/40 opacity-0">
              Outcome
            </span>
            <ul className="space-y-3">
              {project.results.map((r, i) => (
                <li
                  key={i}
                  className="fade-in-el font-general text-sm text-[#E8DCC8]/60 opacity-0"
                >
                  {r}
                </li>
              ))}
            </ul>
          </section>
        )}

        <ProjectNav
          prev={
            project.prevSlug
              ? {
                  slug: project.prevSlug,
                  title: project.prevSlug,
                }
              : undefined
          }
          next={
            project.nextSlug
              ? {
                  slug: project.nextSlug,
                  title: project.nextSlug,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
