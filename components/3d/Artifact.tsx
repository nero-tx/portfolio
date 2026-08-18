"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import {
  buildArtifactGeometry,
  buildRockDetailCanvas,
} from "@/utils/shaders/artifactGeometry";
import { fresnelVertex, fresnelFragment } from "@/utils/shaders/fresnelRim";
import { applyCrackDisplacement } from "@/utils/shaders/crackDisplacement";
import { usePointerRig } from "@/hooks/usePointerRig";
import type { ArtifactMotionState } from "@/utils/artifactMotion";
import ArtifactCore from "./ArtifactCore";

export default function Artifact({
  motion,
  introRef,
}: {
  motion: RefObject<ArtifactMotionState>;
  introRef: RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const rim = useRef<THREE.Mesh>(null);
  const rimMaterial = useRef<THREE.ShaderMaterial>(null);
  const rockMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const veinsMaterial = useRef<LineMaterial>(null);
  const coreRevealRef = useRef(0);
  const { size, gl } = useThree();

  const pointerRig = usePointerRig();
  const crackIntensityRef = useRef(0);
  const dragRotationOffset = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => buildArtifactGeometry(20), []);

  const veinsGeometry = useMemo(() => {
    const edges = new THREE.EdgesGeometry(geometry, 18);
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
    tex.repeat.set(3, 3);
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
    return tex;
  }, [gl]);

  // shared crack uniforms — read by rock material (via onBeforeCompile) and rim shader
  const crackUniforms = useMemo(
    () => ({
      uCrackIntensity: { value: 0 },
      uCrackSeed: { value: Math.random() * 100 },
    }),
    [],
  );

  const rimUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#c9793a") },
      uIntensity: { value: 0.9 },
      uPower: { value: 2.4 },
      uCrackIntensity: crackUniforms.uCrackIntensity,
    }),
    [crackUniforms],
  );

  const rimColorSealed = useMemo(() => new THREE.Color("#c9793a"), []);
  const rimColorRevealed = useMemo(() => new THREE.Color("#ffe4b8"), []);

  const responsiveScale = useMemo(() => {
    if (size.width < 480) return 0.5;
    if (size.width < 768) return 0.65;
    if (size.width < 1024) return 0.85;
    return 1;
  }, [size.width]);

  useEffect(() => {
    veinsMaterial.current = veinsLine.material as LineMaterial;
    veinsMaterial.current.resolution.set(size.width, size.height);
    veinsMaterial.current.color = new THREE.Color("#ffb347");
    veinsMaterial.current.linewidth = 1.1;
    veinsMaterial.current.transparent = true;
    veinsMaterial.current.opacity = 0.55;
    veinsMaterial.current.blending = THREE.AdditiveBlending;
    veinsMaterial.current.depthWrite = false;
  }, [veinsLine, size]);

  // wire crack displacement into the rock material once it's mounted
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

    const s = smoothed.current;
    s.x = THREE.MathUtils.lerp(s.x, target.x, 0.07);
    s.y = THREE.MathUtils.lerp(s.y, target.y, 0.07);
    s.z = THREE.MathUtils.lerp(s.z, target.z, 0.07);
    s.rotY = THREE.MathUtils.lerp(s.rotY, target.rotY, 0.06);
    s.scale = THREE.MathUtils.lerp(s.scale, target.scale, 0.07);
    s.coreReveal = THREE.MathUtils.lerp(s.coreReveal, target.coreReveal, 0.08);

    // --- pointer-driven rotation offset, additive on top of scroll-driven rotY ---
    if (pointerRig.isDragging.current) {
      dragRotationOffset.current.y += pointerRig.dragDelta.current.x * 0.006;
      dragRotationOffset.current.x += pointerRig.dragDelta.current.y * 0.006;
      pointerRig.dragDelta.current = { x: 0, y: 0 }; // consume this frame's delta
    } else {
      // ease the offset back toward 0 so scroll choreography reclaims full control
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

    // --- crack ramp: rises fast + proportional to drag speed, heals slowly ---
    const crackTarget = pointerRig.isDragging.current
      ? Math.min(pointerRig.dragVelocity.current * 4, 1)
      : 0;

    crackIntensityRef.current = THREE.MathUtils.lerp(
      crackIntensityRef.current,
      crackTarget,
      pointerRig.isDragging.current ? 0.12 : 0.04,
    );
    crackUniforms.uCrackIntensity.value = crackIntensityRef.current;

    group.current.position.set(
      s.x,
      s.y + Math.sin(t * 0.5) * 0.05 + (1 - intro) * -1.4,
      s.z,
    );

    group.current.rotation.y = s.rotY + t * 0.06 + dragRotationOffset.current.y;
    group.current.rotation.x =
      THREE.MathUtils.lerp(-0.25, -0.06, intro) +
      Math.sin(t * 0.35) * 0.012 +
      dragRotationOffset.current.x;

    group.current.scale.setScalar(
      s.scale * THREE.MathUtils.lerp(0.82, 1, intro) * responsiveScale,
    );

    if (rimMaterial.current) {
      const breathe = 0.7 + Math.sin(t * 0.8) * 0.15;

      rimMaterial.current.uniforms.uIntensity.value =
        (breathe + s.coreReveal * 0.9) * intro;

      rimMaterial.current.uniforms.uPower.value = THREE.MathUtils.lerp(
        2.4,
        1.6,
        s.coreReveal,
      );

      (rimMaterial.current.uniforms.uColor.value as THREE.Color)
        .copy(rimColorSealed)
        .lerp(rimColorRevealed, s.coreReveal);
    }

    if (rim.current) {
      const rimPulse =
        1.015 +
        Math.sin(t * 1.1) * 0.004 +
        s.coreReveal * 0.02 +
        crackIntensityRef.current * 0.015;
      rim.current.scale.setScalar(rimPulse);
    }

    if (rockMaterial.current) {
      rockMaterial.current.opacity = THREE.MathUtils.lerp(1, 0.4, s.coreReveal);
    }
    if (veinsMaterial.current) {
      veinsMaterial.current.linewidth =
        (1.1 + s.coreReveal * 0.6 + crackIntensityRef.current * 0.9) *
        Math.min(1, responsiveScale + 0.3);
      veinsMaterial.current.opacity = 0.55 + crackIntensityRef.current * 0.4;
    }

    coreRevealRef.current = s.coreReveal;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          ref={rockMaterial}
          color="#241c15"
          roughness={0.92}
          metalness={0.22}
          roughnessMap={detailTexture ?? undefined}
          bumpMap={detailTexture ?? undefined}
          bumpScale={0.02}
          transparent
        />
      </mesh>

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

      <primitive object={veinsLine} />

      <ArtifactCore coreReveal={coreRevealRef} introRef={introRef} />
    </group>
  );
}
