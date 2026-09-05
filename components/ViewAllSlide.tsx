"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { projects } from "@/utils/main-data";
import { AsciiGlitchRipple } from "./text-motions";

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const lineVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const headingContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const subtextVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, delay: 0.3 },
  },
};

const ViewAllSlide = () => {
  return (
    <div className="group relative h-full w-screen shrink-0 overflow-hidden rounded-lg">
      <div className="absolute size-full overflow-hidden bg-[#0B0907] rounded-lg">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,138,74,0.12),transparent_45%),radial-gradient(circle_at_75%_80%,rgba(180,120,55,0.08),transparent_40%)]" />
          <div className="absolute inset-0 opacity-[0.035] grain" />
        </div>

        <motion.div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <svg
          viewBox="0 0 600 600"
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 opacity-[0.05] animate-[spin_90s_linear_infinite]"
        >
          <circle
            cx="300"
            cy="300"
            r="280"
            fill="none"
            stroke="#C88A4A"
            strokeWidth="1"
          />
          <circle
            cx="300"
            cy="300"
            r="220"
            fill="none"
            stroke="#C88A4A"
            strokeWidth="0.5"
            strokeDasharray="2 10"
          />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 360;
            return (
              <line
                key={i}
                x1="300"
                y1="20"
                x2="300"
                y2={i % 6 === 0 ? "45" : "35"}
                stroke="#C88A4A"
                strokeWidth="1"
                transform={`rotate(${angle} 300 300)`}
              />
            );
          })}
        </svg>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={labelVariants}
          className="pointer-events-none absolute left-8 top-12 z-20 flex items-center gap-5 md:left-16 md:top-20"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C88A4A]">
            Full Archive
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="h-px w-16 origin-left bg-[#C88A4A]/40"
          />
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#E8DCC8]/40">
            {projects.length}
          </span>
        </motion.div>

        <div className="relative z-20 flex h-full w-full flex-col items-center justify-center px-8 text-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={labelVariants}
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#E8DCC8]/50"
          >
            Every project, one place
          </motion.p>

          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={headingContainer}
            className="font-circular-web text-5xl sm:text-7xl md:text-[clamp(4rem,8vw,8rem)] font-light leading-[0.88] tracking-tight text-[#E8DCC8]"
          >
            <span className="block overflow-hidden">
              <motion.span variants={lineVariants} className="block">
                View all
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={lineVariants} className="block text-[#D98C4A]">
                projects.
              </motion.span>
            </span>
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.55 }}
            className="mt-12"
            data-cursor="link"
          >
            <Link
              href="/work"
              className="group/link relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-[#C88A4A]/40 px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#E8DCC8] transition-colors duration-300 hover:border-[#C88A4A]/80"
            >
              <span className="absolute inset-0 -translate-x-full bg-[#C88A4A]/10 transition-transform duration-500 ease-out group-hover/link:translate-x-0" />
              <AsciiGlitchRipple
                as="span"
                className="relative whitespace-nowrap"
              >
                See the full archive
              </AsciiGlitchRipple>
              <span className="relative text-[#C88A4A] inline-block animate-[pulse_1.6s_ease-in-out_infinite]">
                →
              </span>
            </Link>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={subtextVariants}
            className="mt-8 font-mono text-[10px] tracking-[0.3em] text-[#E8DCC8]/50"
          >
            04 selected · more in the archive
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default ViewAllSlide;
