"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(".hero-title", {
        type: "chars",
      });

      const chars = split.chars;

      gsap.set(chars, {
        yPercent: 120,
        opacity: 0,
        rotateX: -35,
        transformOrigin: "50% 100%",
      });

      gsap.set(".hero-eyebrow", {
        y: 18,
        opacity: 0,
        filter: "blur(8px)",
      });

      gsap.set(".hero-description", {
        y: 25,
        opacity: 0,
      });

      gsap.set(".hero-bottom-description", {
        y: 20,
        opacity: 0,
      });

      gsap.set(".hero-contact", {
        y: 20,
        opacity: 0,
      });

      gsap.set(".hero-scroll", {
        y: 20,
        opacity: 0,
      });

      gsap.set(".hero-meta", {
        y: -15,
        opacity: 0,
      });

      gsap.set(".hero-side-label", {
        x: 15,
        opacity: 0,
      });

      gsap.set(".hero-frame-line", {
        scaleX: 0,
        transformOrigin: "left",
      });

      gsap.set(".hero-vertical-line", {
        scaleY: 0,
        transformOrigin: "top",
      });

      // INTRO
      const intro = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      intro
        // eyebrow
        .to(
          ".hero-eyebrow",
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
          },
          0.15,
        )

        // title
        .to(
          chars,
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.15,
            stagger: 0.035,
            ease: "power4.out",
          },
          0.3,
        )

        // intro paragraph
        .to(
          ".hero-description",
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
          },
          0.85,
        )

        // CTA
        .to(
          ".hero-contact",
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          1.0,
        )

        // top metadata
        .to(
          ".hero-meta",
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          0.6,
        )

        // right label
        .to(
          ".hero-side-label",
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
          },
          0.75,
        )

        // horizontal frame
        .to(
          ".hero-frame-line",
          {
            scaleX: 1,
            duration: 1,
            ease: "power3.inOut",
          },
          0.55,
        )

        // vertical frame
        .to(
          ".hero-vertical-line",
          {
            scaleY: 1,
            duration: 1.1,
            ease: "power3.inOut",
          },
          0.5,
        )

        // bottom statement
        .to(
          ".hero-bottom-description",
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          1.05,
        )

        // scroll indicator
        .to(
          ".hero-scroll",
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          1.25,
        );

      // SCROLL
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      // MAIN TITLE
      scrollTl.to(
        ".hero-copy",
        {
          xPercent: -18,
          yPercent: -10,
          opacity: 0.3,
          scale: 0.92,
          duration: 1,
          ease: "power2.inOut",
        },
        0,
      );

      // EYEBROW
      scrollTl.to(
        ".hero-eyebrow",
        {
          yPercent: -100,
          opacity: 0,
          duration: 0.6,
        },
        0,
      );

      // DESCRIPTION
      scrollTl.to(
        ".hero-description",
        {
          yPercent: 80,
          opacity: 0,
          duration: 0.7,
        },
        0,
      );

      // CTA
      scrollTl.to(
        ".hero-contact",
        {
          yPercent: 100,
          opacity: 0,
          duration: 0.65,
        },
        0,
      );

      // TOP META
      scrollTl.to(
        ".hero-meta",
        {
          yPercent: -120,
          opacity: 0,
          duration: 0.6,
        },
        0,
      );

      // BOTTOM DESCRIPTION
      scrollTl.to(
        ".hero-bottom-description",
        {
          yPercent: 80,
          opacity: 0,
          duration: 0.65,
        },
        0.05,
      );

      // SIDE LABEL
      scrollTl.to(
        ".hero-side-label",
        {
          xPercent: 100,
          opacity: 0,
          duration: 0.65,
        },
        0,
      );

      // SCROLL INDICATOR
      scrollTl.to(
        ".hero-scroll",
        {
          y: -30,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        0,
      );

      // FRAME
      scrollTl.to(
        ".hero-frame-line",
        {
          scaleX: 0,
          transformOrigin: "right",
          opacity: 0,
          duration: 0.7,
        },
        0.15,
      );

      scrollTl.to(
        ".hero-vertical-line",
        {
          scaleY: 0,
          transformOrigin: "bottom",
          opacity: 0,
          duration: 0.7,
        },
        0.15,
      );

      return () => {
        split.revert();
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative h-[180vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute left-[5.8rem top-0 z-10 hidden h-full w-px bg-white/5 md:block">
          <div className="hero-vertical-line absolute left-0 top-0 h-[32%] w-full bg-linear-to-b from-transparent via-[#D98C4A] to-transparent" />
        </div>

        <div className="hero-copy absolute left-6 top-[21%] z-20 md:left-[9vw] md:top-[24%]">
          <div className="max-w-160">
            <div className="hero-eyebrow mb-5 flex items-center gap-4">
              <span className="h-px w-8 bg-[#D98C4A]/70" />

              <span className="font-circular-web text-[10px] uppercase tracking-[0.4em] text-[#D98C4A]">
                Creative Developer
              </span>
            </div>

            <h1
              className="hero-title special-font text-[19vw] leading-[0.8] text-[#efe6d4]
                sm:text-[13vw] md:text-[9vw]"
              style={{
                perspective: "1200px",
              }}
            >
              <span className="block">TAREK</span>
              <span className="block">FAWZY</span>
            </h1>

            <div className="hero-description hidden sm:inline-flex mt-8 max-w-100">
              <p className="font-general text-sm leading-6 text-neutral-400">
                I engineer immersive digital experiences where systems, motion,
                and atmosphere become one — built to perform, adapt, and endure.
              </p>
            </div>

            <Button
              id="hero-contact-btn"
              title="Get in touch"
              rightIcon={ArrowUpRight}
              className="hero-contact hidden sm:flex rounded-full mt-8 bg-white text-amber-900 font-bold"
              disableAudio
              onClick={() => {}}
            />
          </div>
        </div>

        <div
          className="hero-frame-line pointer-events-none absolute left-[9vw] right-[9vw] top-[18%]
            z-10 h-px bg-linear-to-r from-[#D98C4A]/40
            via-white/5 to-transparent"
        />

        <div className="hero-side-label pointer-events-none absolute right-6 top-1/2 z-20 -translate-y-1/2 hidden sm:inline-flex">
          <div className="flex -rotate-90 items-center gap-4">
            <span className="font-robert-regular text-[8px] uppercase tracking-[0.5em] text-white whitespace-nowrap">
              Systems / Motion / Experience
            </span>

            <span className="h-px w-12 bg-[#D98C4A]/50" />
          </div>
        </div>

        <div className="hero-bottom-description pointer-events-none absolute bottom-25 md:bottom-10 right-6 z-20 max-w-87 md:right-10 hidden sm:inline-block">
          <div className="mb-3 flex items-center justify-end gap-3">
            <span className="font-robert-medium text-[8px] uppercase tracking-[0.45em] text-white">
              Engineering × Atmosphere
            </span>

            <span className="size-1 rounded-full bg-[#D98C4A]" />
          </div>

          <p className="text-right font-general text-xs leading-6 text-amber-300">
            From the architecture beneath the surface to every interaction you
            can feel.
          </p>
        </div>

        <div className="hero-scroll absolute bottom-10 left-6 z-30 md:left-10">
          <div className="flex items-center gap-4">
            <div className="flex size-8 items-center justify-center rounded-full border border-[#D98C4A]/30">
              <ArrowDown className="size-4 text-[#D98C4A]" />
            </div>

            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/50">
                Scroll to descend
              </div>

              <div className="mt-1 font-circular-web text-[8px] uppercase tracking-[0.25em] text-white/30">
                Enter the system
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
