"use client";

import React, { useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set([layer1Ref.current, layer2Ref.current], { yPercent: 100 });
  }, []);

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const l1 = layer1Ref.current;
        const l2 = layer2Ref.current;
        if (!l1 || !l2) {
          next();
          return () => {};
        }

        const tl = gsap.timeline({ onComplete: next });

        gsap.set([l1, l2], { yPercent: 100 });

        tl.to([l1, l2], {
          yPercent: 0,
          duration: 0.45,
          ease: "power4.inOut",
          stagger: 0.08,
        });

        return () => tl.kill();
      }}
      enter={(next) => {
        const l1 = layer1Ref.current;
        const l2 = layer2Ref.current;
        if (!l1 || !l2) {
          next();
          return () => {};
        }

        const tl = gsap.timeline({ onComplete: next });

        gsap.set([l1, l2], { yPercent: 0 });

        tl.to([l2, l1], {
          yPercent: -100,
          duration: 0.45,
          ease: "power4.inOut",
          stagger: 0.08,
        });

        return () => tl.kill();
      }}
    >
      <div>{children}</div>

      <div
        className="pointer-events-none fixed inset-0 z-9999 isolate"
        aria-hidden="true"
      >
        <div
          ref={layer1Ref}
          className="absolute inset-0 bg-[#D98C4A] will-change-transform"
        />
        <div
          ref={layer2Ref}
          className="absolute inset-0 bg-[#E8DCC8] will-change-transform"
        />
      </div>
    </TransitionRouter>
  );
}
