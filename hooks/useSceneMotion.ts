"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArtifactMotionState,
  CameraMotionState,
  defaultArtifactMotion,
  defaultCameraMotion,
} from "@/utils/artifactMotion";

gsap.registerPlugin(ScrollTrigger);

export function useSceneMotion() {
  const artifactMotion = useRef<ArtifactMotionState>({
    ...defaultArtifactMotion,
  });
  const cameraMotion = useRef<CameraMotionState>({ ...defaultCameraMotion });
  const introRef = useRef(0);

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      const introProxy = { value: 0 };
      gsap.to(introProxy, {
        value: 1,
        duration: 2.2,
        delay: 0.15,
        ease: "power3.out",
        onUpdate: () => {
          introRef.current = introProxy.value;
        },
      });

      artifactMotion.current.coreReveal = 0;

      ScrollTrigger.create({
        trigger: "#about",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        animation: gsap
          .timeline()
          .to(
            artifactMotion.current,
            {
              x: 1.1,
              rotY: Math.PI * 0.9,
              scale: 0.85,
              coreReveal: 0.22,
              ease: "none",
            },
            0,
          )
          .to(
            cameraMotion.current,
            { x: 0.4, y: 0.3, z: 4.0, fov: 30, ease: "none" },
            0,
          ),
      });

      ScrollTrigger.create({
        trigger: "#work",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        animation: gsap
          .timeline()
          .to(
            artifactMotion.current,
            {
              x: -0.35,
              rotY: Math.PI * 1.6,
              scale: 1.3,
              coreReveal: 1,
              ease: "none",
            },
            0,
          )
          .to(
            cameraMotion.current,
            { x: -0.15, y: 0.05, z: 3.6, fov: 30, ease: "none" },
            0,
          ),
      });

      ScrollTrigger.create({
        trigger: "#contact",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        animation: gsap
          .timeline()
          .to(
            artifactMotion.current,
            {
              x: 0,
              rotY: Math.PI * 2.1,
              scale: 1,
              coreReveal: 0.35,
              ease: "none",
            },
            0,
          )
          .to(
            cameraMotion.current,
            { x: 0, y: 0.15, z: 4.6, fov: 30, ease: "none" },
            0,
          ),
      });

      window.addEventListener("load", onLoad);
    });

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return { artifactMotion, cameraMotion, introRef };
}
