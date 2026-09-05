"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const EMAIL = "tf5234045@gmail.com";

const socials = [
  { label: "GitHub", href: "https://github.com/nero-tx", code: "GH" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tarek-fawzy-773466323",
    code: "LI",
  },
  { label: "X / Twitter", href: "https://x.com/n3rotx", code: "TW" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
];

const year = new Date().getFullYear();

function ContactMailLink() {
  const [hovered, setHovered] = useState(false);
  const lineRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.45, ease: "power3.out" },
    );
  };

  const handleMouseLeave = () => {
    setHovered(false);
    gsap.to(lineRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.3,
      ease: "power2.in",
    });
  };

  return (
    <a
      href={`mailto:${EMAIL}`}
      data-cursor="link"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col gap-1.5 w-fit"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#D98C4A]/60 transition-colors duration-300 group-hover:text-[#D98C4A]">
        contact:mail
      </span>

      <span className="flex items-center gap-3">
        <span className="overflow-hidden">
          <span
            className={`contact-cta-text inline-block font-circular-web text-[clamp(1rem,2.2vw,1.6rem)] font-light tracking-tight transition-colors duration-300 ${
              hovered ? "text-[#D98C4A]" : "text-[#EFE6D4]/80"
            }`}
          >
            Let&apos;s Create Something Extraordinary
          </span>
        </span>
        <ArrowUpRight
          className={`size-5 shrink-0 transition-all duration-300 ease-out ${
            hovered
              ? "translate-x-0.5 -translate-y-0.5 text-[#D98C4A]"
              : "text-[#EFE6D4]/40"
          }`}
        />
      </span>

      <span
        ref={lineRef}
        className="block h-px w-full origin-left scale-x-0 bg-[#D98C4A]/60"
      />
    </a>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const nameTextRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const headingSplit = new SplitText(nameTextRef.current, {
        type: "chars",
      });
      const taglineSplit = new SplitText(taglineRef.current, {
        type: "words",
      });
      const ctaSplit = new SplitText(".contact-cta-text", {
        type: "words",
      });

      gsap.set(headingSplit.chars, { yPercent: 110, opacity: 0 });
      gsap.set(taglineSplit.words, { yPercent: 100, opacity: 0 });
      gsap.set(ctaSplit.words, { yPercent: 100, opacity: 0 });
      gsap.set(".footer-row", { opacity: 0, y: 16 });

      const headingTl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      headingTl
        .to(headingSplit.chars, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          stagger: 0.035,
        })
        .to(taglineSplit.words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.025,
        });

      gsap.to(".footer-row", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(ctaSplit.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.03,
        scrollTrigger: {
          trigger: ".contact-cta-text",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      return () => {
        headingSplit.revert();
        taglineSplit.revert();
        ctaSplit.revert();
      };
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      id="main-footer"
      className="relative w-full overflow-hidden border-t border-[#D98C4A]/15 bg-[#070503] text-[#E8DCC8]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(217,140,74,0.07),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.025] grain" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-16">
        <div
          ref={nameRef}
          className="overflow-hidden pt-20 pb-10 md:pt-28 md:pb-14"
        >
          <h2
            ref={nameTextRef}
            className="font-circular-web text-[clamp(4rem,13vw,14rem)] font-light leading-none tracking-tight text-[#EFE6D4]/90 select-none"
          >
            TAREK<span className="text-[#D98C4A]">.</span>
          </h2>
        </div>

        <div className="footer-row border-t border-[#E8DCC8]/8 py-10 md:py-14">
          <ContactMailLink />
        </div>

        <div className="footer-row h-px w-full bg-[#E8DCC8]/8" />

        <div className="footer-row grid grid-cols-2 gap-y-12 py-12 md:grid-cols-3 md:gap-y-0">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#D98C4A]/70">
              ARCHITECT
            </span>
            <p
              ref={taglineRef}
              className="max-w-[26ch] text-sm leading-relaxed text-[#E8DCC8]/55"
            >
              Building products at the intersection of engineering, design, and
              intelligence.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[10px] text-emerald-400/80">
                Open to work
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#E8DCC8]/35">
              Navigate
            </span>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  data-cursor="link"
                  className="group flex w-fit items-center gap-1.5 font-mono text-xs text-[#E8DCC8]/55 transition-colors duration-200 hover:text-[#E8DCC8]"
                >
                  <span className="inline-block h-px w-0 bg-[#D98C4A] transition-all duration-300 group-hover:w-3" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#E8DCC8]/35">
              Channels
            </span>
            <ul className="flex flex-col gap-2">
              {socials.map((s) => (
                <li key={s.code}>
                  <Link
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="group flex w-fit items-center gap-2.5 font-mono text-xs text-[#E8DCC8]/55 transition-colors duration-200 hover:text-[#E8DCC8]"
                  >
                    <span className="font-mono text-[8px] text-[#D98C4A]/60 transition-colors duration-200 group-hover:text-[#D98C4A]">
                      [{s.code}]
                    </span>
                    {s.label}
                    <ArrowUpRight className="size-2.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-row h-px w-full bg-[#E8DCC8]/8" />

        <div className="footer-row flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#E8DCC8]/25">
              © {year} TAREK FAWZY
            </span>
            <span className="hidden h-3 w-px bg-[#E8DCC8]/15 md:block" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#E8DCC8]/18">
              BUILT WITH NEXT.JS
            </span>
          </div>

          <div className="flex items-center gap-2 rounded border border-[#D98C4A]/15 px-2.5 py-1">
            <div className="size-1.5 rounded-full bg-[#D98C4A]/60" />
            <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#D98C4A]/50">
              v{year}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
