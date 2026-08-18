"use client";

import { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Artifact from "./Artifact";
import Ground from "./Ground";
import ParticleField from "./ParticleField";
import { useSceneMotion } from "@/hooks/useSceneMotion";
import type { CameraMotionState } from "@/utils/artifactMotion";

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

    const px = (pointer.x || 0) * 0.18;
    const py = (pointer.y || 0) * 0.08;

    const easedX = THREE.MathUtils.lerp(0, target.x, intro) + px;
    const easedY = THREE.MathUtils.lerp(startY, target.y, intro) + py;
    const easedZ = THREE.MathUtils.lerp(startZ, target.z, intro);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, easedX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, easedY, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, easedZ, 0.06);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, target.fov, 0.05);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(0, -0.15, 0);
  });

  return null;
}

export default function Scene() {
  const { artifactMotion, cameraMotion, introRef } = useSceneMotion();

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, position: [0, 1.4, 7.2] }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#0a0806"]} />
      <fog attach="fog" args={["#0a0806", 5, 13]} />

      <CameraRig cameraMotion={cameraMotion} introRef={introRef} />

      <directionalLight
        position={[-3, 2.4, -2.6]}
        intensity={2.2}
        color="#ffb870"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[2.5, 1.2, 3]}
        intensity={0.35}
        color="#6b5c48"
      />
      <ambientLight intensity={0.08} color="#3a2f24" />

      <Artifact motion={artifactMotion} introRef={introRef} />
      <Ground />
      <ParticleField />
    </Canvas>
  );
}
