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

      // Clean, elegant scroll-driven parallax and subtle spatial retreat into the About section
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        animation: gsap
          .timeline()
          .to(
            artifactMotion.current,
            {
              y: -0.4,
              z: -1.2,
              rotY: Math.PI * 0.45,
              scale: 0.9,
              ease: "power2.inOut",
            },
            0,
          )
          .to(
            cameraMotion.current,
            { y: 0.2, z: 6.2, fov: 32, ease: "power2.inOut" },
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
