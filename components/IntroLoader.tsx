"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

declare global {
  interface Window {
    __INTRO_PLAYED__?: boolean;
  }
}

let introHasPlayedMemory = false;

function checkShouldRunIntro(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const navEntries = performance.getEntriesByType("navigation");
    const isReload =
      navEntries.length > 0 &&
      (navEntries[0] as PerformanceNavigationTiming).type === "reload";

    const legacyReload = (performance as any)?.navigation?.type === 1;

    if (isReload || legacyReload) {
      introHasPlayedMemory = false;
      window.__INTRO_PLAYED__ = false;
      sessionStorage.removeItem("__INTRO_PLAYED__");
      return true;
    }

    if (
      introHasPlayedMemory ||
      window.__INTRO_PLAYED__ === true ||
      sessionStorage.getItem("__INTRO_PLAYED__") === "true"
    ) {
      return false;
    }

    return true;
  } catch {
    return !introHasPlayedMemory;
  }
}

export default function IntroLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const gyroRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const shouldRun = checkShouldRunIntro();

    if (!shouldRun) {
      gsap.set(containerRef.current, { autoAlpha: 0 });
      return;
    }

    introHasPlayedMemory = true;
    window.__INTRO_PLAYED__ = true;
    sessionStorage.setItem("__INTRO_PLAYED__", "true");

    const progressObj = { value: 0 };

    const setBarWidth = barFillRef.current
      ? gsap.quickSetter(barFillRef.current, "width", "%")
      : null;

    gsap.set([layer1Ref.current, layer2Ref.current], { yPercent: 0 });

    gsap.to(".intro-gyro-outer", {
      rotation: 360,
      repeat: -1,
      duration: 7,
      ease: "none",
    });

    gsap.to(".intro-gyro-inner", {
      rotation: -360,
      repeat: -1,
      duration: 4.5,
      ease: "none",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(containerRef.current, { autoAlpha: 0 });
      },
    });

    tl.to(progressObj, {
      value: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.floor(progressObj.value);
        setBarWidth?.(val);

        if (percentTextRef.current) {
          percentTextRef.current.textContent =
            val < 10 ? `00${val}` : val < 100 ? `0${val}` : `${val}`;
        }
      },
    });

    tl.to(
      percentTextRef.current,
      {
        color: "#D98C4A",
        textShadow: "0 0 20px rgba(217,140,74,0.8)",
        duration: 0.25,
        ease: "power2.out",
      },
      "-=0.1",
    );

    tl.to({}, { duration: 0.25 });

    tl.to(
      gyroRef.current,
      {
        scale: 1.4,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.45,
        ease: "power2.in",
      },
      "outro",
    );

    tl.to(
      contentWrapperRef.current,
      {
        y: -30,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.5,
        ease: "power2.in",
      },
      "outro",
    );

    tl.to(
      [layer2Ref.current, layer1Ref.current],
      {
        yPercent: -100,
        duration: 0.45,
        ease: "power4.inOut",
        stagger: 0.08,
      },
      "outro+=0.2",
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-99999 flex flex-col items-center justify-center overflow-hidden select-none text-[#E8DCC8]"
      aria-label="System Loading"
    >
      <div className="absolute inset-0 z-0 isolate">
        <div
          ref={layer1Ref}
          className="absolute inset-0 bg-[#D98C4A] will-change-transform"
        />
        <div
          ref={layer2Ref}
          className="absolute inset-0 bg-[#0A0908] will-change-transform"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,140,74,0.09),transparent_65%)] pointer-events-none" />
        </div>
      </div>

      <div
        ref={contentWrapperRef}
        className="relative z-10 flex flex-col items-center justify-center px-6 will-change-transform"
      >
        <div
          ref={gyroRef}
          className="relative mb-8 flex size-20 items-center justify-center will-change-transform"
        >
          <div className="intro-gyro-outer absolute inset-0 rounded-full border border-dashed border-[#D98C4A]/50" />
          <div className="intro-gyro-inner absolute inset-2 rounded-full border border-t-[#5FB8C9] border-r-transparent border-b-[#5FB8C9]/30 border-l-transparent" />
          <div className="size-2.5 rounded-full bg-[#D98C4A] shadow-[0_0_15px_#D98C4A]" />
        </div>

        <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
          <span
            ref={percentTextRef}
            className="text-[clamp(3.8rem,9vw,6.5rem)] font-light tracking-tight text-[#EFE6D4]"
          >
            000
          </span>
          <span className="text-2xl font-semibold text-[#D98C4A]">%</span>
        </div>

        <div className="mt-5 h-0.5 w-52 overflow-hidden rounded-full bg-white/10 shadow-[0_0_10px_rgba(217,140,74,0.15)]">
          <div
            ref={barFillRef}
            className="h-full w-0 rounded-full bg-linear-to-r from-[#D98C4A] via-[#EFE6D4] to-[#D98C4A] shadow-[0_0_10px_#D98C4A] transition-none"
          />
        </div>
      </div>
    </div>
  );
}
