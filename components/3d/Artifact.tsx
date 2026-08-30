"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePointerRig } from "@/hooks/usePointerRig";
import type { ArtifactMotionState } from "@/utils/artifactMotion";

export default function Artifact({
  motion,
  introRef,
}: {
  motion: RefObject<ArtifactMotionState>;
  introRef: RefObject<number>;
}) {
  const droneGroup = useRef<THREE.Group>(null);
  const eyeGroup = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);
  const thrusterGlow1 = useRef<THREE.Mesh>(null);
  const thrusterGlow2 = useRef<THREE.Mesh>(null);

  const { size } = useThree();
  const pointerRig = usePointerRig();

  // Drag physics state with inertia
  const dragRotation = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });

  // Responsive scale
  const responsiveScale = useMemo(() => {
    if (size.width < 480) return 0.78;
    if (size.width < 768) return 0.98;
    return 1.18;
  }, [size.width]);

  // Materials
  const materials = useMemo(() => {
    return {
      titaniumChassis: new THREE.MeshStandardMaterial({
        color: "#181512",
        metalness: 0.94,
        roughness: 0.24,
      }),
      goldTrim: new THREE.MeshStandardMaterial({
        color: "#d98c4a",
        emissive: "#87450e",
        emissiveIntensity: 0.35,
        metalness: 0.92,
        roughness: 0.18,
      }),
      darkPanel: new THREE.MeshStandardMaterial({
        color: "#0a0806",
        metalness: 0.85,
        roughness: 0.45,
      }),
      cyanRing: new THREE.MeshStandardMaterial({
        color: "#5fb8c9",
        emissive: "#1b4e59",
        emissiveIntensity: 0.6,
        metalness: 0.96,
        roughness: 0.1,
        transparent: true,
        opacity: 0.92,
      }),
      amberRing: new THREE.MeshStandardMaterial({
        color: "#e89438",
        emissive: "#a6520f",
        emissiveIntensity: 0.7,
        metalness: 0.94,
        roughness: 0.12,
      }),
      eyeLensGlass: new THREE.MeshPhysicalMaterial({
        color: "#031017",
        emissive: "#5fb8c9",
        emissiveIntensity: 0.9,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.88,
        ior: 1.55,
        clearcoat: 1.0,
      }),
      eyePupilGlow: new THREE.MeshBasicMaterial({
        color: "#5fb8c9",
        toneMapped: false,
      }),
      thrusterCyan: new THREE.MeshBasicMaterial({
        color: "#5fb8c9",
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      }),
      laserBeam: new THREE.MeshBasicMaterial({
        color: "#d98c4a",
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    };
  }, []);

  useFrame((state) => {
    if (!droneGroup.current) return;
    const time = state.clock.getElapsedTime();
    const target = motion.current;
    const intro = THREE.MathUtils.clamp(introRef.current ?? 1, 0, 1);
    const ndc = pointerRig.ndc.current;

    // 1. Drag Motion with Rotational Inertia Physics
    if (pointerRig.isDragging.current) {
      const dx = pointerRig.dragDelta.current.x;
      const dy = pointerRig.dragDelta.current.y;

      dragVelocity.current.y = dx * 0.009;
      dragVelocity.current.x = dy * 0.009;

      dragRotation.current.y += dragVelocity.current.y;
      dragRotation.current.x += dragVelocity.current.x;

      pointerRig.dragDelta.current = { x: 0, y: 0 };
    } else {
      // Angular friction damping decay
      dragVelocity.current.x *= 0.92;
      dragVelocity.current.y *= 0.92;

      dragRotation.current.x += dragVelocity.current.x;
      dragRotation.current.y += dragVelocity.current.y;

      // Gentle spring back towards center on X axis
      dragRotation.current.x = THREE.MathUtils.lerp(
        dragRotation.current.x,
        0,
        0.03,
      );
    }

    // 2. Mouse Move Parallax Position with hovering
    const hoverY = Math.sin(time * 1.5) * 0.07;
    const targetX = target.x + ndc.x * 0.45;
    const targetY = target.y + hoverY + ndc.y * 0.3;
    const targetZ = target.z;

    droneGroup.current.position.x = THREE.MathUtils.lerp(
      droneGroup.current.position.x,
      targetX,
      0.08,
    );
    droneGroup.current.position.y = THREE.MathUtils.lerp(
      droneGroup.current.position.y,
      targetY,
      0.08,
    );
    droneGroup.current.position.z = THREE.MathUtils.lerp(
      droneGroup.current.position.z,
      targetZ,
      0.08,
    );

    // 3. Mouse Move Drone Bank & Tilt + Drag Rotation
    const baseRotY = target.rotY + time * 0.12 + dragRotation.current.y;
    const targetRotX = -ndc.y * 0.4 + dragRotation.current.x;
    const targetRotZ = -ndc.x * 0.35 + Math.sin(time * 1.2) * 0.03;

    droneGroup.current.rotation.y = THREE.MathUtils.lerp(
      droneGroup.current.rotation.y,
      baseRotY,
      0.08,
    );
    droneGroup.current.rotation.x = THREE.MathUtils.lerp(
      droneGroup.current.rotation.x,
      targetRotX,
      0.08,
    );
    droneGroup.current.rotation.z = THREE.MathUtils.lerp(
      droneGroup.current.rotation.z,
      targetRotZ,
      0.08,
    );

    droneGroup.current.scale.setScalar(
      target.scale * responsiveScale * intro,
    );

    // 4. Cybernetic Optical Eye Locking on Cursor
    if (eyeGroup.current) {
      const eyeLookX = THREE.MathUtils.clamp(-ndc.y * 0.65, -0.45, 0.45);
      const eyeLookY = THREE.MathUtils.clamp(ndc.x * 0.75, -0.55, 0.55);
      eyeGroup.current.rotation.x = THREE.MathUtils.lerp(
        eyeGroup.current.rotation.x,
        eyeLookX,
        0.14,
      );
      eyeGroup.current.rotation.y = THREE.MathUtils.lerp(
        eyeGroup.current.rotation.y,
        eyeLookY,
        0.14,
      );
    }

    // 5. Gyroscopic Gimbal Rings Rotating
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.85;
      ring1Ref.current.rotation.y = time * 0.45;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.95;
      ring2Ref.current.rotation.z = time * 0.55;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 1.15;
      ring3Ref.current.rotation.x = -time * 0.65;
    }

    // 6. Thruster Exhaust Flame Flicker
    const thrusterFlicker = 0.8 + Math.sin(time * 22.0) * 0.2;
    if (thrusterGlow1.current) {
      thrusterGlow1.current.scale.set(1, 1, thrusterFlicker * 1.2);
    }
    if (thrusterGlow2.current) {
      thrusterGlow2.current.scale.set(1, 1, thrusterFlicker * 1.2);
    }

    // 7. Laser Scanner Projector
    if (laserBeamRef.current) {
      laserBeamRef.current.scale.set(
        1 + Math.sin(time * 6.0) * 0.08,
        1 + Math.sin(time * 6.0) * 0.08,
        1,
      );
    }
  });

  return (
    <group ref={droneGroup}>
      {/* 1. Main Spherical Titanium Hull */}
      <mesh material={materials.titaniumChassis} castShadow receiveShadow>
        <sphereGeometry args={[0.72, 32, 32]} />
      </mesh>

      {/* Equatorial Ribbed Belt Panel */}
      <mesh material={materials.darkPanel}>
        <cylinderGeometry args={[0.74, 0.74, 0.18, 32]} />
      </mesh>

      {/* Decorative Gold Inset Trim Ring */}
      <mesh material={materials.goldTrim}>
        <torusGeometry args={[0.73, 0.015, 12, 48]} />
      </mesh>

      {/* 2. Front Cybernetic Sensor Eye Aperture */}
      <group ref={eyeGroup} position={[0, 0, 0.58]}>
        {/* Outer Beveled Camera Housing */}
        <mesh material={materials.goldTrim} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.38, 0.16, 24]} />
        </mesh>

        {/* Inner Dark Stepped Ring */}
        <mesh
          material={materials.darkPanel}
          position={[0, 0, 0.08]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.26, 0.3, 0.08, 24]} />
        </mesh>

        {/* Glowing Optical Glass Lens */}
        <mesh material={materials.eyeLensGlass} position={[0, 0, 0.11]}>
          <sphereGeometry args={[0.22, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>

        {/* Pulsing Central Cyan Pupil */}
        <mesh material={materials.eyePupilGlow} position={[0, 0, 0.18]}>
          <circleGeometry args={[0.08, 24]} />
        </mesh>

        {/* Holographic Forward Scanner Cone Beam */}
        <mesh
          ref={laserBeamRef}
          material={materials.laserBeam}
          position={[0, 0, 1.4]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.45, 2.6, 24, 1, true]} />
        </mesh>
      </group>

      {/* 3. Concentric Gyroscopic Stabilizer Rings (Holtzman Conduits) */}
      <mesh ref={ring1Ref} material={materials.cyanRing}>
        <torusGeometry args={[0.92, 0.018, 12, 64]} />
      </mesh>

      <mesh ref={ring2Ref} material={materials.amberRing}>
        <torusGeometry args={[1.08, 0.015, 12, 64]} />
      </mesh>

      <mesh ref={ring3Ref} material={materials.goldTrim}>
        <torusGeometry args={[1.22, 0.012, 10, 64]} />
      </mesh>

      {/* 4. Aerodynamic Directional Thruster Fins (Wings) */}
      {/* Left Wing */}
      <group position={[-0.72, 0, -0.1]} rotation={[0, 0, 0.2]}>
        <mesh material={materials.titaniumChassis}>
          <boxGeometry args={[0.65, 0.04, 0.45]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[-0.28, 0, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.42]} />
        </mesh>
      </group>

      {/* Right Wing */}
      <group position={[0.72, 0, -0.1]} rotation={[0, 0, -0.2]}>
        <mesh material={materials.titaniumChassis}>
          <boxGeometry args={[0.65, 0.04, 0.45]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[0.28, 0, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.42]} />
        </mesh>
      </group>

      {/* Top Dorsal Fin */}
      <group position={[0, 0.72, -0.15]} rotation={[-0.25, 0, 0]}>
        <mesh material={materials.titaniumChassis}>
          <boxGeometry args={[0.04, 0.55, 0.38]} />
        </mesh>
        <mesh material={materials.cyanRing} position={[0, 0.22, 0]}>
          <boxGeometry args={[0.06, 0.1, 0.35]} />
        </mesh>
      </group>

      {/* Bottom Ventral Fin */}
      <group position={[0, -0.72, -0.15]} rotation={[0.25, 0, 0]}>
        <mesh material={materials.titaniumChassis}>
          <boxGeometry args={[0.04, 0.45, 0.35]} />
        </mesh>
      </group>

      {/* 5. Rear Plasma Thruster Exhaust Engines */}
      <group position={[-0.26, 0, -0.68]}>
        <mesh material={materials.darkPanel} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.25, 20]} />
        </mesh>
        <mesh
          ref={thrusterGlow1}
          material={materials.thrusterCyan}
          position={[0, 0, -0.22]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.12, 0.45, 16]} />
        </mesh>
      </group>

      <group position={[0.26, 0, -0.68]}>
        <mesh material={materials.darkPanel} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.25, 20]} />
        </mesh>
        <mesh
          ref={thrusterGlow2}
          material={materials.thrusterCyan}
          position={[0, 0, -0.22]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.12, 0.45, 16]} />
        </mesh>
      </group>

      {/* Internal Light Sources */}
      <pointLight color="#5fb8c9" intensity={2.2} distance={3.5} />
      <pointLight color="#d98c4a" intensity={1.8} distance={2.5} position={[0, 0, 0.8]} />
    </group>
  );
}
