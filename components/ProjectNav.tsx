"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ProjectNavProps {
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

export default function ProjectNav({ prev, next }: ProjectNavProps) {
  if (!prev && !next) return null;

  return (
    <motion.nav
      className="mt-32 flex items-stretch border-t border-[#E8DCC8]/10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      }}
    >
      {prev ? (
        <NavLink direction="prev" slug={prev.slug} title={prev.title} />
      ) : (
        <div className="flex-1" />
      )}
      <motion.div
        className="w-px origin-top bg-[#E8DCC8]/10"
        variants={{
          hidden: { transform: "scaleY(0)" },
          visible: { transform: "scaleY(1)" },
        }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      />
      {next ? (
        <NavLink direction="next" slug={next.slug} title={next.title} />
      ) : (
        <div className="flex-1" />
      )}
    </motion.nav>
  );
}

function NavLink({
  direction,
  slug,
  title,
}: {
  direction: "prev" | "next";
  slug: string;
  title: string;
}) {
  const isNext = direction === "next";

  return (
    <motion.div
      className="flex-1"
      variants={{
        hidden: { opacity: 0, transform: `translateY(24px)` },
        visible: { opacity: 1, transform: "translateY(0px)" },
      }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link
        href={`/work/${slug}`}
        className="group relative block overflow-hidden py-14"
      >
        <motion.span
          aria-hidden="true"
          className={`absolute inset-y-0 w-full bg-[#E8DCC8]/3 ${isNext ? "right-0 origin-right" : "left-0 origin-left"}`}
          initial={{ transform: "scaleX(0)" }}
          whileHover={{ transform: "scaleX(1)" }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        />

        <div
          className={`relative flex flex-col gap-3 px-6 md:px-12 ${isNext ? "items-end text-right" : "items-start text-left"}`}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#E8DCC8]/35 transition-colors duration-300 group-hover:text-[#E8DCC8]/60">
            {isNext ? "Next project" : "Previous project"}
          </span>

          <span className="flex items-center gap-3 font-[Cinzel] text-2xl font-light text-[#EFE6D4] md:text-4xl">
            {!isNext && <NavArrow icon={ArrowLeft} hoverX={-6} />}

            <span className="relative overflow-hidden">
              <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                {title}
              </span>
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 inline-block translate-y-full text-[#D98C4A] transition-transform duration-300 ease-out group-hover:translate-y-0"
              >
                {title}
              </span>
            </span>

            {isNext && <NavArrow icon={ArrowRight} hoverX={6} />}
          </span>
        </div>

        <motion.span
          aria-hidden="true"
          className={`absolute bottom-0 h-px w-full bg-[#D98C4A]/50 ${isNext ? "right-0 origin-right" : "left-0 origin-left"}`}
          initial={{ transform: "scaleX(0)" }}
          whileHover={{ transform: "scaleX(1)" }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        />
      </Link>
    </motion.div>
  );
}

function NavArrow({
  icon: Icon,
  hoverX,
}: {
  icon: typeof ArrowLeft;
  hoverX: number;
}) {
  return (
    <motion.span
      className="inline-block"
      initial={{ transform: "translateX(0px)" }}
      whileHover={{ transform: `translateX(${hoverX}px)` }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Icon className="size-5 text-[#D98C4A] md:size-7" />
    </motion.span>
  );
}
