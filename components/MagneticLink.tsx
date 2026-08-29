// components/MagneticLink.tsx
"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const MagneticLink = ({ href }: { href: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 15, mass: 0.4 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const strength = 0.4;
  const radius = 90;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);

    if (distance < radius + rect.width / 2) {
      x.set(distX * strength);
      y.set(distY * strength);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="pointer-events-auto absolute bottom-[8vw] right-[8vw] z-20 hidden h-20 w-20 md:block"
      data-cursor="link"
    >
      <motion.div style={{ x: sx, y: sy }} className="h-full w-full">
        <Link
          ref={ref}
          href={href}
          className="group/link relative flex h-full w-full items-center justify-center rounded-full border border-[#C88A4A]/30 transition-colors duration-300 hover:border-[#C88A4A]/70 hover:bg-[#C88A4A]/10"
        >
          {/* Center dot, fades out on hover */}
          <span className="absolute h-1 w-1 rounded-full bg-[#C88A4A] transition-opacity duration-300 group-hover/link:opacity-0" />

          {/* Label, fades in on hover */}
          <span className="pointer-events-none absolute font-mono text-[9px] uppercase tracking-[0.2em] text-[#C88A4A] opacity-0 transition-opacity duration-300 group-hover/link:opacity-100">
            View
          </span>

          {/* Rotating ring accent */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full animate-[spin_12s_linear_infinite] opacity-0 transition-opacity duration-300 group-hover/link:opacity-40"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#C88A4A"
              strokeWidth="0.5"
              strokeDasharray="4 6"
            />
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default MagneticLink;
