"use client";

import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollProgress(
  element: HTMLElement | null,
): RefObject<number> {
  const progress = useRef(0);

  useEffect(() => {
    if (!element) {
      progress.current = 0;
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, [element]);

  return progress;
}
