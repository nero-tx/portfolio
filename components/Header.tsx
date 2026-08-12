"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Chambers", href: "/chambers" },
  { label: "Origin", href: "#origin" },
  { label: "Works", href: "/work" },
  { label: "Transmission", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(10,9,8,0.82)" : "rgba(10,9,8,0)",
          borderColor: scrolled ? "rgba(232,220,200,0.12)" : "rgba(232,220,200,0)",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backdropFilter: scrolled ? "blur(14px)" : "none" }}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
          {/* Logo */}
          <a href="/" className="group relative flex flex-col items-start">
            <span className="font-circular-web text-[1.4rem] font-medium tracking-[0.42em] text-[#E8DCC8] transition-colors duration-500 group-hover:text-[#D98C4A]">
              NERO
            </span>
            <span className="relative mt-1.5 h-px w-full bg-[#E8DCC8]/25">
              <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#D98C4A] transition-all duration-500 group-hover:shadow-[0_0_8px_2px_rgba(217,140,74,0.7)]" />
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-1 font-robert-medium text-[0.72rem] font-medium uppercase tracking-[0.25em] text-[#E8DCC8]/70 transition-colors duration-300 hover:text-[#E8DCC8]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-linear-to-r from-[#D98C4A] to-transparent transition-all duration-500 ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="#contact"
            className="hidden items-center gap-3 border border-[#E8DCC8]/20 px-5 py-2.5 font-robert-medium text-[0.68rem] uppercase tracking-[0.25em] text-[#E8DCC8]/80 transition-all duration-300 hover:border-[#D98C4A]/60 hover:text-[#D98C4A] md:flex"
          >
            Begin
          </Link>

          {/* Mobile toggle */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[6px] md:hidden"
          >
            <motion.span animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-px w-6 bg-[#E8DCC8]" />
            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="h-px w-6 bg-[#E8DCC8]" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="h-px w-6 bg-[#E8DCC8]" />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-[#0A0908] px-8 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                  className="border-b border-[#E8DCC8]/10 py-4 font-[var(--font-cinzel)] text-3xl tracking-[0.08em] text-[#E8DCC8]"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 font-[var(--font-space-grotesk)] text-[0.65rem] uppercase tracking-[0.3em] text-[#E8DCC8]/40"
            >
              Engineered in the manner of monuments
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}