"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import cn from "@/utils/utils";
import { Volume2, VolumeX } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { useAudio } from "@/context/AudioProvider";

export default function Header() {
  const { isPlaying, toggle } = useAudio();

  return (
    <>
      <motion.header
        initial={false}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto flex container items-center justify-between px-4 py-5 md:px-12">
          <Link href="/" className="group relative flex flex-col items-start">
            <span className="font-circular-web text-[1.4rem] font-medium tracking-[0.42em] text-[#E8DCC8] transition-colors duration-500 group-hover:text-[#D98C4A]">
              NERO
            </span>
            <span className="relative mt-1 h-px w-full bg-[#E8DCC8]/25">
              <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#D98C4A] transition-all duration-500 group-hover:shadow-[0_0_8px_2px_rgba(217,140,74,0.7)]" />
            </span>
          </Link>

          <div className="flex items-center gap-1.5 md:gap-3">
            <button
              onClick={toggle}
              className={cn(
                "flex size-9 shrink-0 cursor-pointer items-center justify-center transition-all rounded-full ease-in-out duration-500",
                isPlaying
                  ? "bg-neutral-100 text-black hover:bg-neutral-200"
                  : "text-slate-500 bg-[#D9D9D9]/10 hover:bg-[#D9D9D9]/20",
              )}
              data-cursor="drag"
            >
              {isPlaying ? (
                <Volume2 className="size-4.5" />
              ) : (
                <VolumeX className="size-4.5" />
              )}
            </button>

            <Link
              data-cursor="link"
              href="mailto:tf5234045@gmail.com"
              className="relative z-10 flex gap-2 h-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white px-3 text-black transition-all duration-500 ease-out group"
            >
              <div className="relative overflow-hidden font-medium font-robert-medium text-sm md:text-base uppercase">
                <span className="block tracking-tight transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:-translate-y-full">
                  Get In Touch
                </span>

                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 block tracking-tight translate-y-full transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0"
                >
                  Get In Touch
                </span>
              </div>

              <ArrowUpRight className="size-3.5 text-black transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </motion.header>
    </>
  );
}
