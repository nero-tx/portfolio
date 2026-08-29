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
        className="relative flex h-full w-max will-change-transform"
      >
        <ViewAllSlide />

        {projects.map((project) => (
          <div
            key={project.number}
            className="group relative h-screen w-screen shrink-0"
          >
            <div className="absolute inset-[4vw] md:inset-[5vw] overflow-hidden">
              <div className="absolute inset-0 z-10 bg-linear-to-t from-[#0B0907]/80 via-transparent to-[#0B0907]/10" />

              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover grayscale-20 brightness-[0.72] transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04] rounded-lg aspect-video"
              />

              <div className="absolute inset-0 bg-[radial-linear(circle_at_70%_40%,rgba(211,143,72,0.15),transparent_35%)]" />
            </div>

            <div className="absolute left-[7vw] top-1/2 z-20 -translate-y-1/2 md:left-[8vw]">
              <span className="font-mono text-[10px] tracking-[0.4em] text-[#C88A4A]">
                // {project.number}
              </span>
            </div>

            <div className="absolute bottom-[10vw] left-[12vw] z-20 max-w-170 md:left-[15vw]">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#E8DCC8]/50">
                {project.category}
              </p>

              <h3 className="font-serif text-[16vw] font-light leading-[0.75] tracking-[-0.06em] md:text-[10vw]">
                {project.title}
              </h3>

              <div className="mt-8 flex items-end justify-between gap-12">
                <p className="max-w-sm text-sm leading-relaxed text-[#E8DCC8]/60 md:text-base">
                  {project.description}
                </p>

                <span className="hidden font-mono text-[10px] tracking-[0.3em] text-[#E8DCC8]/40 md:block">
                  {project.year}
                </span>
              </div>
            </div>

            <MagneticLink href={`/work/${project.slug}`} />

            <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-[#E8DCC8]/10" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-8 left-8 z-30 md:flex items-center gap-4 md:left-16 hidden">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#E8DCC8]/40">
          Scroll to explore
        </span>

        <div className="h-px w-16 overflow-hidden bg-[#E8DCC8]/20">
          <div className="h-full w-full origin-left animate-pulse bg-[#C88A4A]" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-8 z-30 font-mono text-[9px] tracking-[0.3em] text-[#E8DCC8] md:right-16 hidden md:inline-block">
        MY WORK
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
