"use client";

import { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Artifact from "./Artifact";
import Ground from "./Ground";
import ParticleField from "./ParticleField";
import { useSceneMotion } from "@/hooks/useSceneMotion";
import type { CameraMotionState } from "@/utils/artifactMotion";
import { Frameloop } from "@react-three/fiber";

// Suppress internal React-Three-Fiber v9 THREE.Clock deprecation notice
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("THREE.Clock: This module has been deprecated")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

function CameraRig({
  cameraMotion,
  introRef,
}: {
  cameraMotion: RefObject<CameraMotionState>;
  introRef: RefObject<number>;
}) {
  const { camera, pointer } = useThree();

  useFrame(() => {
    const target = cameraMotion.current;
    const intro = introRef.current ?? 0;

    const startZ = target.z + 2.85;
    const startY = target.y + 1.25;

    const px = (pointer.x || 0) * 0.16;
    const py = (pointer.y || 0) * 0.08;

    const easedX = THREE.MathUtils.lerp(0, target.x, intro) + px;
    const easedY = THREE.MathUtils.lerp(startY, target.y, intro) + py;
    const easedZ = THREE.MathUtils.lerp(startZ, target.z, intro);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, easedX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, easedY, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, easedZ, 0.06);

    if (camera instanceof THREE.PerspectiveCamera) {
      const nextFov = THREE.MathUtils.lerp(camera.fov, target.fov, 0.05);
      if (Math.abs(camera.fov - nextFov) > 0.005) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }

    camera.lookAt(0, -0.15, 0);
  });

  return null;
}

export default function Scene({ frameloop = "always" }: { frameloop?: Frameloop }) {
  const { artifactMotion, cameraMotion, introRef } = useSceneMotion();

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={
        typeof window !== "undefined" && window.innerWidth < 768
          ? [1, 1.2]
          : [1, 1.5]
      }
      frameloop={frameloop}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      camera={{ fov: 30, position: [0, 1.4, 7.2] }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#070503"]} />
      <fog attach="fog" args={["#070503", 4.5, 14]} />

      <hemisphereLight args={["#ffe3b8", "#120d09", 1.4]} />

      <CameraRig cameraMotion={cameraMotion} introRef={introRef} />

      <directionalLight
        position={[-4, 4.2, 3]}
        intensity={3.4}
        color="#ffaa55"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      <directionalLight
        position={[4, 2, 4]}
        intensity={1.6}
        color="#5fb8c9"
      />

      <directionalLight
        position={[0, 4.2, -4.5]}
        intensity={3.0}
        color="#ff9940"
      />

      <ambientLight intensity={0.12} color="#2b2018" />

      <pointLight
        position={[0, -1.2, 0]}
        intensity={1.0}
        distance={4.5}
        color="#ff8833"
      />

      <Artifact motion={artifactMotion} introRef={introRef} />
      <Ground />
      <ParticleField />
    </Canvas>
  );
}
