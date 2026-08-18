"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import cn from "@/utils/utils";

interface BtnProps {
  title: string;
  id: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  disableAudio?: boolean;
}

const Button = ({
  title,
  id,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  onClick,
  className,
  disableAudio,
}: BtnProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const showId = useId();

  // quickTo setters — reused per-frame instead of creating a new tween on every mousemove
  const quickRotateX = useRef<gsap.QuickToFunc | null>(null);
  const quickRotateY = useRef<gsap.QuickToFunc | null>(null);
  const quickSkewX = useRef<gsap.QuickToFunc | null>(null);
  const quickSkewY = useRef<gsap.QuickToFunc | null>(null);
  const quickScale = useRef<gsap.QuickToFunc | null>(null);

  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const audio = new Audio("/audio/btn.wav");

    audio.preload = "auto";
    audio.volume = 0.35;

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!buttonRef.current) return;

    quickRotateX.current = gsap.quickTo(buttonRef.current, "rotateX", {
      duration: 0.6,
      ease: "power3.out",
    });
    quickRotateY.current = gsap.quickTo(buttonRef.current, "rotateY", {
      duration: 0.6,
      ease: "power3.out",
    });
    quickSkewX.current = gsap.quickTo(buttonRef.current, "skewX", {
      duration: 0.5,
      ease: "power3.out",
    });
    quickSkewY.current = gsap.quickTo(buttonRef.current, "skewY", {
      duration: 0.5,
      ease: "power3.out",
    });
    quickScale.current = gsap.quickTo(buttonRef.current, "scale", {
      duration: 0.4,
      ease: "power3.out",
    });
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || disableAudio) return;

    const audio = audioRef.current;

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    lastPos.current = { x: e.clientX, y: e.clientY };

    quickScale.current?.(1.03);

    gsap.to(fillRef.current, {
      scaleX: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    // Tilt — position-based perspective rotation
    const rotateY = normalizedX * 15;
    const rotateX = -normalizedY * 15;

    // Skew
    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;

    const skewX = gsap.utils.clamp(-14, 14, deltaX * 0.6);
    const skewY = gsap.utils.clamp(-6, 6, deltaY * 0.25);

    lastPos.current = { x: e.clientX, y: e.clientY };

    quickRotateX.current?.(rotateX);
    quickRotateY.current?.(rotateY);
    quickSkewX.current?.(skewX);
    quickSkewY.current?.(skewY);

    gsap.to(iconRef.current, {
      x: normalizedX * 5,
      y: normalizedY * 5,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    // Elastic settle — the rubber-band snap back to neutral
    gsap.to(buttonRef.current, {
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      skewY: 0,
      scale: 1,
      duration: 0.9,
      ease: "elastic.out(1, 0.4)",
    });

    gsap.to(fillRef.current, {
      scaleX: 0,
      duration: 0.4,
      ease: "power3.inOut",
    });

    gsap.to(iconRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    onClick?.(e);
  };

  return (
    <div
      id={id}
      className="relative z-10 w-fit"
      style={{
        perspective: "1200px",
      }}
    >
      <button
        id={showId}
        ref={buttonRef}
        type="button"
        disabled={disabled}
        data-cursor="link"
        className={cn(`group relative flex w-fit items-centergap-4 overflow-hidden rounded-xs border border-white/15 bg-amber-950 px-4 py-3 font-circular-web text-xs uppercase tracking-[0.32em] text-[#efe6d4] outline-none backdrop-blur-sm will-change-transform transition-colors duration-500 hover:border-[#D98C4A]/60 focus-visible:border-[#D98C4A] disabled:pointer-events-none disabled:opacity-30 md:px-6 md:py-3.5`,
          className,
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <span
          ref={fillRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[#D98C4A]/10"
        />

        {LeftIcon && (
          <span className="relative z-10 shrink-0 transition-transform duration-500 group-hover:transform-[translateZ(10px)]">
            <LeftIcon className="size-3.5 text-[#D98C4A]" />
          </span>
        )}

        {/* TEXT */}

        <span className="relative z-10 overflow-hidden transform-[translateZ(8px)]">
          <span className="block  transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
            {title}
          </span>

          <span
            aria-hidden="true"
            className="absolute left-0 top-full block text-[#D98C4A] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
          >
            {title}
          </span>
        </span>

        <span
          ref={iconRef}
          className="relative z-10 flex shrink-0 transform-[translateZ(12px)]
          "
        >
          {RightIcon ? (
            <RightIcon className="size-3.5 text-[#D98C4A]/70 transition-colors duration-300 group-hover:text-[#D98C4A]" />
          ) : (
            <ArrowUpRight className="size-3.5 text-[#D98C4A]/70 transition-colors duration-300 group-hover:text-[#D98C4A]" />
          )}
        </span>

        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-0 bg-[#D98C4A] transition-all duration-500 group-hover:w-full"
        />
      </button>
    </div>
  );
};

export default Button;
