"use client";

import { projects } from "@/utils/main-data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import MagneticLink from "./MagneticLink";
import ViewAllSlide from "./ViewAllSlide";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track) return;

      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount() + window.innerHeight * 1.5}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      tl.to(track, {
        x: () => -getScrollAmount(),
        y: 0,
        ease: "none",
        duration: 2,
      });

      tl.to(
        track,
        {
          opacity: 0,
          filter: "blur(8px)",
          scale: 0.96,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "+=0.2",
      );

      tl.to(
        ".outro-overlay",
        {
          backgroundColor: "rgba(10, 8, 6, 0.85)",
          backdropFilter: "blur(12px)",
          duration: 0.6,
        },
        "<",
      );

      tl.to(
        ".outro-sigil",
        {
          opacity: 1,
          scaleY: 1,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.2",
      );

      tl.to(
        ".outro-label",
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.1",
      );

      tl.to(
        ".outro-title",
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.2",
      );

      tl.to(
        ".outro-line",
        {
          width: "120px",
          opacity: 1,
          duration: 0.6,
          ease: "power4.out",
        },
        "-=0.4",
      );

      tl.to({}, { duration: 0.4 });

      const images = Array.from(track.querySelectorAll("img"));
      let loaded = 0;

      const onImageLoad = () => {
        loaded += 1;
        if (loaded === images.length) {
          ScrollTrigger.refresh();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          onImageLoad();
        } else {
          img.addEventListener("load", onImageLoad, { once: true });
          img.addEventListener("error", onImageLoad, { once: true });
        }
      });

      const fallback = window.setTimeout(() => ScrollTrigger.refresh(), 1000);

      return () => {
        window.clearTimeout(fallback);
        images.forEach((img) => {
          img.removeEventListener("load", onImageLoad);
          img.removeEventListener("error", onImageLoad);
        });
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative h-dvh w-full overflow-hidden text-[#E9DFC8]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-linear(circle_at_70%_50%,rgba(180,120,55,0.12),transparent_35%)]" />

        <div className="absolute inset-0 opacity-[0.035] bg-[url('/images/grain.png')]" />
      </div>

      <div
        ref={trackRef}
        className="relative flex h-full items-center w-max will-change-transform"
      >
        <ViewAllSlide />

        {projects.map((project) => (
          <div
            key={project.number}
            className="group relative h-[85dvh] md:h-full w-screen shrink-0 overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                src={project.bgImage || project.image}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover scale-110 filter blur-2xl md:blur-3xl saturate-100 opacity-60 transition-transform duration-1000 ease-out group-hover:scale-120"
              />
              <div className="absolute inset-0 bg-[#070503]/50 md:bg-[#070503]/20" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#070503_95%)]" />
            </div>

            <div className="absolute inset-4 sm:inset-8 md:inset-[5vw] overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xs">
              <div className="absolute inset-0 z-10 bg-linear-to-t from-[#070503]/95 via-[#070503]/40 to-[#070503]/20 md:via-transparent md:to-[#070503]/20" />
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover grayscale-15 brightness-[0.7] transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04] rounded-lg"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(217,140,74,0.18),transparent_50%)]" />
            </div>

            <div className="absolute inset-x-6 sm:inset-x-12 bottom-12 sm:bottom-16 md:inset-x-auto md:left-[10vw] md:bottom-[8vw] z-20 max-w-xl p-3">
              <div className="mb-2 sm:mb-4 flex items-center gap-3">
                <span className="font-mono text-[9px] sm:text-xs uppercase tracking-[0.3em] text-[#D98C4A]">
                  {project.category}
                </span>
                <span className="h-px w-4 sm:w-6 bg-[#D98C4A]/40" />
                <span className="font-mono text-[9px] sm:text-xs text-[#E8DCC8]/40">
                  {project.year}
                </span>
              </div>

              <h3 className="font-circular-web text-4xl sm:text-6xl md:text-[clamp(3.5rem,7vw,7rem)] font-light leading-[0.92] tracking-tight text-[#EFE6D4]">
                {project.title}
              </h3>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8">
                <p className="max-w-md font-general text-xs sm:text-sm leading-relaxed text-[#E8DCC8]/75">
                  {project.description}
                </p>
                <div className="block md:hidden pt-2">
                  <a
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D98C4A]/50 bg-[#D98C4A]/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#EFE6D4] backdrop-blur-md"
                  >
                    <span>View Project</span>
                    <span className="text-[#D98C4A]">→</span>
                  </a>
                </div>
              </div>
            </div>

            <MagneticLink href={`/work/${project.slug}`} />

            <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-linear-to-r from-transparent via-[#D98C4A]/30 to-transparent" />
          </div>
        ))}
      </div>

      {/*mini-footer */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-[#D98C4A]/12 bg-[#070503]/60 px-8 py-3 backdrop-blur-sm md:px-16">
        <div className="flex items-center gap-5">
          <span className="font-mono text-[8px] uppercase tracking-[0.45em] text-[#D98C4A]/60">
            SELECTED WORK
          </span>
          <div className="hidden h-3 w-px bg-[#E8DCC8]/15 md:block" />
          <span className="hidden font-mono text-[8px] uppercase tracking-[0.35em] text-[#E8DCC8]/30 md:inline">
            {projects.length} projects
          </span>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#E8DCC8]/30">
            Scroll to explore
          </span>
          <div className="h-px w-10 overflow-hidden bg-[#E8DCC8]/15">
            <div className="h-full w-full origin-left animate-pulse bg-[#C88A4A]/60" />
          </div>
        </div>
      </div>

      {/* End Scene Outro */}
      <div className="outro-overlay pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center bg-transparent">
        <div className="outro-sigil mb-8 opacity-0 origin-bottom">
          <div className="h-16 w-px bg-linear-to-b from-transparent via-[#C88A4A]/80 to-transparent mx-auto" />
        </div>

        <span className="outro-label font-mono text-[10px] uppercase tracking-[0.5em] text-[#C88A4A] opacity-0 translate-y-4 text-center">
          Good ideas are nice
        </span>

        <h2 className="outro-title mt-8 text-[clamp(2rem,5vw,5rem)] text-[#E8DCC8] opacity-0 blur-md scale-95 uppercase text-center max-w-5xl px-6 leading-[1.1] font-circular-web">
          Making them actually work is better.
        </h2>

        <div className="outro-line mt-12 h-px w-0 bg-[#C88A4A]/50 mx-auto" />
      </div>
    </section>
  );
};

export default Work;
