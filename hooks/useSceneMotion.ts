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

      // Act 1: Extended Hero Multi-Beat Narrative Choreography (4-Phase Storyline)
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        animation: gsap
          .timeline()
          // Beat 1 -> Beat 2: Inspection Orbit & Zoom In
          .to(
            artifactMotion.current,
            {
              x: -0.35,
              rotY: Math.PI * 0.65,
              scale: 1.05,
              ease: "power1.inOut",
            },
            0,
          )
          .to(
            cameraMotion.current,
            { x: -0.15, y: 0.1, z: 4.8, fov: 29, ease: "power1.inOut" },
            0,
          )
          // Beat 2 -> Beat 3: Hyper-Drive Awakening
          .to(
            artifactMotion.current,
            {
              x: 0.55,
              rotY: Math.PI * 1.35,
              scale: 1.15,
              ease: "power2.inOut",
            },
            0.35,
          )
          .to(
            cameraMotion.current,
            { x: 0.15, y: -0.05, z: 4.2, fov: 31, ease: "power2.inOut" },
            0.35,
          )
          // Beat 3 -> Beat 4 (Outro): Flight Mode & Hyperspace Ascent
          .to(
            artifactMotion.current,
            {
              x: 0,
              y: 0.65,
              z: -1.6,
              rotY: Math.PI * 2.2,
              scale: 0.75,
              ease: "power2.inOut",
            },
            0.7,
          )
          .to(
            cameraMotion.current,
            { x: 0, y: 0.25, z: 5.4, fov: 28, ease: "power2.inOut" },
            0.7,
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
