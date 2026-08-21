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

      // Act 2: About (Inspection Profile)
      ScrollTrigger.create({
        trigger: "#about",
        start: "top bottom",
        end: "top top",
        scrub: 1.2,
        animation: gsap
          .timeline()
          .to(
            artifactMotion.current,
            {
              x: 1.15,
              rotY: Math.PI * 0.95,
              scale: 0.88,
              coreReveal: 0.25,
              ease: "none",
            },
            0,
          )
          .to(
            cameraMotion.current,
            { x: 0.45, y: 0.2, z: 4.2, fov: 28, ease: "none" },
            0,
          ),
      });

      // Act 2.5: Deep Scan (Holtzman Disintegration & Core Charge)
      ScrollTrigger.create({
        trigger: "#deep-scan",
        start: "top bottom",
        end: "top top",
        scrub: 1.2,
        animation: gsap
          .timeline()
          .to(
            artifactMotion.current,
            {
              x: 0,
              rotY: Math.PI * 1.45,
              scale: 1.15,
              coreReveal: 0.65,
              ease: "none",
            },
            0,
          )
          .to(
            cameraMotion.current,
            { x: 0, y: 0.1, z: 3.8, fov: 29, ease: "none" },
            0,
          ),
      });

      // Act 3: Work (Core Ignition & Fracture)
      ScrollTrigger.create({
        trigger: "#work",
        start: "top bottom",
        end: "top top",
        scrub: 1.2,
        animation: gsap
          .timeline()
          .to(
            artifactMotion.current,
            {
              x: -0.45,
              rotY: Math.PI * 1.85,
              scale: 1,
              coreReveal: 1.0,
              ease: "none",
            },
            0,
          )
          .to(
            cameraMotion.current,
            { x: -0.2, y: 0.05, z: 3.5, fov: 30, ease: "none" },
            0,
          ),
      });

      // Act 4: Capabilities (Systems Matrix)
      ScrollTrigger.create({
        trigger: "#capabilities",
        start: "top bottom",
        end: "top top",
        scrub: 1.2,
        animation: gsap
          .timeline()
          .to(
            artifactMotion.current,
            {
              x: 0.85,
              rotY: Math.PI * 2.65,
              scale: 0.92,
              coreReveal: 0.45,
              ease: "none",
            },
            0,
          )
          .to(
            cameraMotion.current,
            { x: 0.35, y: 0.15, z: 4.2, fov: 29, ease: "none" },
            0,
          ),
      });

      // Act 5: Contact (Equilibrium & Transmission)
      ScrollTrigger.create({
        trigger: "#contact",
        start: "top bottom",
        end: "top top",
        scrub: 1.2,
        animation: gsap
          .timeline()
          .to(
            artifactMotion.current,
            {
              x: 0,
              rotY: Math.PI * 3.4,
              scale: 0.95,
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
