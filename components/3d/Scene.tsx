"use client";

import { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
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
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.18,
      }}
      camera={{ fov: 30, position: [0, 1.4, 7.2] }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#080605"]} />
      <fog attach="fog" args={["#080605", 4.5, 14]} />

      {/* Procedural HDR Image-Based Lighting for Realistic Specular & Reflections */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0.4, 0]}>
          {/* Key warm overhead softbox */}
          <Lightformer
            form="rect"
            intensity={3.8}
            position={[-4, 5, -3]}
            scale={[6, 4, 1]}
            color="#ffbe70"
            target={[0, 0, 0]}
          />
          {/* Lateral cool cyan rim strip */}
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[4, 2, 4]}
            scale={[8, 2, 1]}
            color="#5fb8c9"
          />
          {/* Top diffuse fill */}
          <Lightformer
            form="ring"
            intensity={1.6}
            position={[0, 6, 0]}
            scale={[5, 5, 1]}
            color="#ffe3b8"
          />
          {/* Dark warm floor bounce */}
          <Lightformer
            form="rect"
            intensity={1.2}
            position={[0, -4, 0]}
            scale={[10, 10, 1]}
            color="#422515"
          />
        </group>
      </Environment>

      <CameraRig cameraMotion={cameraMotion} introRef={introRef} />

      {/* Cinematic 3-Point Lighting Setup */}
      {/* Key Warm Directional Light with Soft Shadows */}
      <directionalLight
        position={[-4, 3.8, 3]}
        intensity={3.2}
        color="#ffaa55"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      {/* Cool Lateral Fill Light for Chiaroscuro Depth */}
      <directionalLight
        position={[3.5, 1.8, 2.5]}
        intensity={0.7}
        color="#3d5868"
      />

      {/* Intense Amber Backlight / Rim Light */}
      <directionalLight
        position={[0, 4.2, -4.5]}
        intensity={3.6}
        color="#ff9940"
      />

      {/* Ambient Fill */}
      <ambientLight intensity={0.12} color="#2b2018" />

      {/* Ground Amber Glow Reflection */}
      <pointLight
        position={[0, -1.2, 0]}
        intensity={1.2}
        distance={4.5}
        color="#ff8833"
      />

      <Artifact motion={artifactMotion} introRef={introRef} />
      <Ground />
      <ParticleField />
    </Canvas>
  );
}
