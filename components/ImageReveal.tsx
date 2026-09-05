"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import cn from "@/utils/utils";

interface ImageRevealProps {
  source: string;
  className: string;
  imgAlt?: string;
}

const ImageReveal = ({ source, imgAlt, className }: ImageRevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ["start end", "end 65%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const y = useTransform(smoothProgress, [0, 1], ["-3vh", "3vh"]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 1]);

  const filter = useTransform(smoothProgress, (v) => {
    const start = 0.1;
    const end = 0.7;
    const t = Math.min(Math.max((v - start) / (end - start), 0), 1);
    const sepia = 55 - t * 55;
    const saturate = 35 + t * 65;
    const contrast = 96 + t * 9;
    const brightness = 88 + t * 12;
    return `sepia(${sepia}%) saturate(${saturate}%) contrast(${contrast}%) brightness(${brightness}%)`;
  });

  const opacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);

  const grainOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.7],
    [0.35, 0.2, 0],
  );

  return (
    <motion.div
      ref={elementRef}
      style={{ opacity }}
      className={cn("relative overflow-hidden rounded-xl", className)}
    >
      <motion.div style={{ y, scale, filter }} className="h-full w-full">
        <Image
          src={source}
          alt={imgAlt ?? "image-preview"}
          width={400}
          height={450}
          className="size-full rounded-xl object-cover"
        />
      </motion.div>
      <motion.div
        style={{ opacity: grainOpacity }}
        className="pointer-events-none absolute inset-0 mix-blend-overlay grain"
      />
    </motion.div>
  );
};

export default ImageReveal;
