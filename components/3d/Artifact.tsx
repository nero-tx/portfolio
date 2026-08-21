"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import {
  buildArtifactGeometry,
  buildShardGeometry,
  buildRockDetailCanvas,
  buildRockRoughnessCanvas,
} from "@/utils/shaders/artifactGeometry";
import { fresnelVertex, fresnelFragment } from "@/utils/shaders/fresnelRim";
import { applyCrackDisplacement } from "@/utils/shaders/crackDisplacement";
import { usePointerRig } from "@/hooks/usePointerRig";
import type { ArtifactMotionState } from "@/utils/artifactMotion";
import ArtifactCore from "./ArtifactCore";

const SHARD_COUNT = 6;
const SHARD_CONFIGS = [
  { radius: 2.1, speed: 0.35, yOffset: 0.6, phase: 0.0, scale: 1.0 },
  { radius: 2.35, speed: -0.28, yOffset: -0.4, phase: 1.2, scale: 0.85 },
  { radius: 1.95, speed: 0.42, yOffset: 0.1, phase: 2.5, scale: 1.1 },
  { radius: 2.5, speed: -0.22, yOffset: 0.9, phase: 3.8, scale: 0.75 },
  { radius: 2.2, speed: 0.31, yOffset: -0.7, phase: 4.6, scale: 0.9 },
  { radius: 2.4, speed: -0.38, yOffset: -0.1, phase: 5.4, scale: 1.05 },
];

export default function Artifact({
  motion,
  introRef,
}: {
  motion: RefObject<ArtifactMotionState>;
  introRef: RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const shardsGroup = useRef<THREE.Group>(null);
  const rim = useRef<THREE.Mesh>(null);
  const rimMaterial = useRef<THREE.ShaderMaterial>(null);
  const rockMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const shardMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const veinsMaterial = useRef<LineMaterial>(null);
  const coreRevealRef = useRef(0);
  const { size, gl } = useThree();

  const pointerRig = usePointerRig();
  const crackIntensityRef = useRef(0);
  const dragRotationOffset = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => buildArtifactGeometry(42), []);

  const shardGeometries = useMemo(
    () => Array.from({ length: SHARD_COUNT }, (_, i) => buildShardGeometry(i)),
    [],
  );

  const veinsGeometry = useMemo(() => {
    const edges = new THREE.EdgesGeometry(geometry, 22);
    const g = new LineSegmentsGeometry();
    g.setPositions(edges.attributes.position.array as Float32Array);
    return g;
  }, [geometry]);

  const veinsLine = useMemo(
    () => new LineSegments2(veinsGeometry, new LineMaterial()),
    [veinsGeometry],
  );

  const detailTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const tex = new THREE.CanvasTexture(buildRockDetailCanvas());
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
    return tex;
  }, [gl]);

  const roughnessTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const tex = new THREE.CanvasTexture(buildRockRoughnessCanvas());
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
    return tex;
  }, [gl]);

  // Shared crack uniforms
  const crackUniforms = useMemo(
    () => ({
      uCrackIntensity: { value: 0 },
      uCrackSeed: { value: Math.random() * 100 },
    }),
    [],
  );

  const rimUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#d9833e") },
      uIntensity: { value: 1.0 },
      uPower: { value: 2.2 },
      uCrackIntensity: crackUniforms.uCrackIntensity,
    }),
    [crackUniforms],
  );

  const rimColorSealed = useMemo(() => new THREE.Color("#d9833e"), []);
  const rimColorRevealed = useMemo(() => new THREE.Color("#ffeed4"), []);

  const responsiveScale = useMemo(() => {
    if (size.width < 480) return 0.52;
    if (size.width < 768) return 0.68;
    if (size.width < 1024) return 0.8;
    return 0.9;
  }, [size.width]);

  useEffect(() => {
    veinsMaterial.current = veinsLine.material as LineMaterial;
    veinsMaterial.current.resolution.set(size.width, size.height);
    veinsMaterial.current.color = new THREE.Color("#ffb852");
    veinsMaterial.current.linewidth = 1.2;
    veinsMaterial.current.transparent = true;
    veinsMaterial.current.opacity = 0.6;
    veinsMaterial.current.blending = THREE.AdditiveBlending;
    veinsMaterial.current.depthWrite = false;
  }, [veinsLine, size]);

  useEffect(() => {
    if (rockMaterial.current) {
      applyCrackDisplacement(rockMaterial.current, crackUniforms);
    }
  }, [crackUniforms]);

  const smoothed = useRef({
    x: 0,
    y: -0.35,
    z: 0,
    rotY: 0,
    scale: 1,
    coreReveal: 0,
  });

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const intro = introRef.current ?? 0;
    const target = motion.current;

    // Cardiac Pulse (Heartbeat of the internal core transmitted through the rock)
    const rawPulse = Math.sin(t * 2.4);
    const cardiacShock = Math.pow(Math.max(0, rawPulse), 4.0);

    const s = smoothed.current;
    s.x = THREE.MathUtils.lerp(s.x, target.x, 0.07);
    s.y = THREE.MathUtils.lerp(s.y, target.y, 0.07);
    s.z = THREE.MathUtils.lerp(s.z, target.z, 0.07);
    s.rotY = THREE.MathUtils.lerp(s.rotY, target.rotY, 0.06);
    s.scale = THREE.MathUtils.lerp(s.scale, target.scale, 0.07);
    s.coreReveal = THREE.MathUtils.lerp(s.coreReveal, target.coreReveal, 0.08);

    // Pointer-driven rotation offset with gyro momentum
    if (pointerRig.isDragging.current) {
      dragRotationOffset.current.y += pointerRig.dragDelta.current.x * 0.007;
      dragRotationOffset.current.x += pointerRig.dragDelta.current.y * 0.007;
      pointerRig.dragDelta.current = { x: 0, y: 0 };
    } else {
      dragRotationOffset.current.x = THREE.MathUtils.lerp(
        dragRotationOffset.current.x,
        0,
        0.05,
      );
      dragRotationOffset.current.y = THREE.MathUtils.lerp(
        dragRotationOffset.current.y,
        0,
        0.05,
      );
    }

    // Dynamic crack stress responding to drag + cardiac pulse
    const crackTarget = pointerRig.isDragging.current
      ? Math.min(pointerRig.dragVelocity.current * 4.5, 1)
      : cardiacShock * 0.25;

    crackIntensityRef.current = THREE.MathUtils.lerp(
      crackIntensityRef.current,
      crackTarget,
      pointerRig.isDragging.current ? 0.14 : 0.06,
    );
    crackUniforms.uCrackIntensity.value = crackIntensityRef.current;

    // Position with organic thermal levitation & cardiac heave
    const introOffsetY = THREE.MathUtils.lerp(-1.4, 0, intro);
    group.current.position.set(
      s.x,
      s.y + introOffsetY + Math.sin(t * 0.5) * 0.05 + cardiacShock * 0.03,
      s.z,
    );

    // Dynamic rotation
    group.current.rotation.y = s.rotY + t * 0.07 + dragRotationOffset.current.y;
    group.current.rotation.x =
      THREE.MathUtils.lerp(-0.22, -0.05, intro) +
      Math.sin(t * 0.35) * 0.015 +
      dragRotationOffset.current.x;
    group.current.scale.setScalar(responsiveScale);

    // Animate orbital floating shards with harmonic magnetic orbits
    if (shardsGroup.current) {
      shardsGroup.current.children.forEach((child, i) => {
        const cfg = SHARD_CONFIGS[i % SHARD_CONFIGS.length];
        const angle = t * cfg.speed + cfg.phase;
        const orbitRadius =
          cfg.radius * (1 + s.coreReveal * 0.4 + cardiacShock * 0.05);
        const heightBob =
          Math.sin(t * 0.8 + cfg.phase) * 0.14 + cardiacShock * 0.02;

        child.position.set(
          Math.cos(angle) * orbitRadius,
          cfg.yOffset + heightBob,
          Math.sin(angle) * orbitRadius,
        );

        child.rotation.x = t * 0.45 + cfg.phase;
        child.rotation.y = t * 0.55 + cfg.phase;
        child.rotation.z = Math.sin(t * 0.35 + cfg.phase) * 0.25;
      });
    }

    if (rimMaterial.current) {
      const breathe = 0.75 + Math.sin(t * 0.8) * 0.18 + cardiacShock * 0.3;

      rimMaterial.current.uniforms.uIntensity.value =
        (breathe + s.coreReveal * 1.2) * intro;

      rimMaterial.current.uniforms.uPower.value = THREE.MathUtils.lerp(
        2.3,
        1.4,
        s.coreReveal,
      );

      (rimMaterial.current.uniforms.uColor.value as THREE.Color)
        .copy(rimColorSealed)
        .lerp(rimColorRevealed, s.coreReveal);
    }

    if (rockMaterial.current) {
      rockMaterial.current.opacity = THREE.MathUtils.lerp(
        1,
        0.42,
        s.coreReveal,
      );
    }

    if (veinsMaterial.current) {
      veinsMaterial.current.linewidth =
        (1.2 +
          s.coreReveal * 0.8 +
          cardiacShock * 0.6 +
          crackIntensityRef.current * 1.0) *
        Math.min(1, responsiveScale + 0.3);
      veinsMaterial.current.opacity =
        0.6 + cardiacShock * 0.35 + crackIntensityRef.current * 0.4;
    }

    coreRevealRef.current = s.coreReveal;
  });

  return (
    <group ref={group}>
      {/* Main Obsidian Monolith Shell */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          ref={rockMaterial}
          color="#1c1612"
          roughness={0.65}
          metalness={0.25}
          roughnessMap={roughnessTexture ?? undefined}
          bumpMap={detailTexture ?? undefined}
          bumpScale={0.035}
          transparent
        />
      </mesh>

      {/* Rim Glow Envelope */}
      <mesh ref={rim} geometry={geometry}>
        <shaderMaterial
          ref={rimMaterial}
          vertexShader={fresnelVertex}
          fragmentShader={fresnelFragment}
          uniforms={rimUniforms}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Luminous Chamfer Veins */}
      <primitive object={veinsLine} />

      {/* Orbital Levitating Shards */}
      <group ref={shardsGroup}>
        {shardGeometries.map((shardGeom, i) => (
          <mesh
            key={i}
            geometry={shardGeom}
            castShadow
            receiveShadow
            scale={SHARD_CONFIGS[i].scale}
          >
            <meshStandardMaterial
              ref={i === 0 ? shardMaterial : undefined}
              color="#221b16"
              roughness={0.55}
              metalness={0.35}
              roughnessMap={roughnessTexture ?? undefined}
              bumpMap={detailTexture ?? undefined}
              bumpScale={0.025}
            />
          </mesh>
        ))}
      </group>

      {/* Inner Hyper-Crystalline Plasma Singularity Core */}
      <ArtifactCore coreReveal={coreRevealRef} introRef={introRef} />
    </group>
  );
}
