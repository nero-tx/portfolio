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
  const pupilRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);
  const thrusterGlow1 = useRef<THREE.Mesh>(null);
  const thrusterGlow2 = useRef<THREE.Mesh>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);

  const { size } = useThree();
  const pointerRig = usePointerRig();

  const dragRotation = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });
  const lastNdc = useRef({ x: 0, y: 0 });

  const responsiveScale = useMemo(() => {
    if (size.width < 480) return 0.76;
    if (size.width < 768) return 0.92;
    return 1.15;
  }, [size.width]);

  const materials = useMemo(() => {
    return {
      titaniumChassis: new THREE.MeshPhysicalMaterial({
        color: "#1a1613",
        metalness: 0.94,
        roughness: 0.2,
        clearcoat: 0.85,
        clearcoatRoughness: 0.15,
        reflectivity: 0.9,
      }),
      goldTrim: new THREE.MeshPhysicalMaterial({
        color: "#e2984a",
        emissive: "#7a390b",
        emissiveIntensity: 0.45,
        metalness: 0.96,
        roughness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      }),
      darkPanel: new THREE.MeshStandardMaterial({
        color: "#080605",
        metalness: 0.88,
        roughness: 0.38,
      }),
      cyanConduit: new THREE.MeshStandardMaterial({
        color: "#5fb8c9",
        emissive: "#205d6b",
        emissiveIntensity: 0.8,
        metalness: 0.95,
        roughness: 0.08,
        transparent: true,
        opacity: 0.94,
      }),
      amberRing: new THREE.MeshPhysicalMaterial({
        color: "#ea993f",
        emissive: "#ab540d",
        emissiveIntensity: 0.85,
        metalness: 0.95,
        roughness: 0.1,
        clearcoat: 0.9,
      }),
      eyeLensGlass: new THREE.MeshPhysicalMaterial({
        color: "#01090d",
        emissive: "#5fb8c9",
        emissiveIntensity: 0.95,
        roughness: 0.02,
        metalness: 0.1,
        transmission: 0.92,
        ior: 1.62,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.95,
      }),
      eyePupilGlow: new THREE.MeshBasicMaterial({
        color: "#5fb8c9",
        toneMapped: false,
      }),
      thrusterCyan: new THREE.MeshBasicMaterial({
        color: "#5fb8c9",
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      }),
      laserBeam: new THREE.MeshBasicMaterial({
        color: "#d98c4a",
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      innerCoreGlow: new THREE.MeshBasicMaterial({
        color: "#ffaa44",
        toneMapped: false,
      }),
    };
  }, []);

  useFrame((state) => {
    if (!droneGroup.current) return;
    const time = state.clock.getElapsedTime();
    const target = motion.current;
    const intro = THREE.MathUtils.clamp(introRef.current ?? 1, 0, 1);
    const ndc = pointerRig.ndc.current;

    // Pointer velocity calculation for aerodynamic banking
    const pVelX = (ndc.x - lastNdc.current.x) * 60;
    const pVelY = (ndc.y - lastNdc.current.y) * 60;
    lastNdc.current = { x: ndc.x, y: ndc.y };

    // 1. Drag Physics with Inertia Damping
    if (pointerRig.isDragging.current) {
      const dx = pointerRig.dragDelta.current.x;
      const dy = pointerRig.dragDelta.current.y;

      dragVelocity.current.y = dx * 0.009;
      dragVelocity.current.x = dy * 0.009;

      dragRotation.current.y += dragVelocity.current.y;
      dragRotation.current.x += dragVelocity.current.x;

      pointerRig.dragDelta.current = { x: 0, y: 0 };
    } else {
      dragVelocity.current.x *= 0.92;
      dragVelocity.current.y *= 0.92;

      dragRotation.current.x += dragVelocity.current.x;
      dragRotation.current.y += dragVelocity.current.y;

      dragRotation.current.x = THREE.MathUtils.lerp(
        dragRotation.current.x,
        0,
        0.035,
      );
    }

    // 2. Harmonic Anti-Gravity Hover & Physical Levitation
    const hoverY =
      Math.sin(time * 1.4) * 0.06 + Math.sin(time * 2.8) * 0.025;
    const hoverZ = Math.sin(time * 0.9) * 0.03;
    const hoverRoll = Math.sin(time * 1.1) * 0.02;

    const targetX = target.x + ndc.x * 0.42;
    const targetY = target.y + hoverY + ndc.y * 0.28;
    const targetZ = target.z + hoverZ;

    droneGroup.current.position.x = THREE.MathUtils.lerp(
      droneGroup.current.position.x,
      targetX,
      0.075,
    );
    droneGroup.current.position.y = THREE.MathUtils.lerp(
      droneGroup.current.position.y,
      targetY,
      0.075,
    );
    droneGroup.current.position.z = THREE.MathUtils.lerp(
      droneGroup.current.position.z,
      targetZ,
      0.075,
    );

    // 3. Aerodynamic Banking & Inertial Rotation
    const baseRotY = target.rotY + time * 0.1 + dragRotation.current.y;
    const bankRotZ = -ndc.x * 0.32 - pVelX * 0.025 + hoverRoll;
    const pitchRotX = -ndc.y * 0.36 + pVelY * 0.02 + dragRotation.current.x;

    droneGroup.current.rotation.y = THREE.MathUtils.lerp(
      droneGroup.current.rotation.y,
      baseRotY,
      0.075,
    );
    droneGroup.current.rotation.x = THREE.MathUtils.lerp(
      droneGroup.current.rotation.x,
      pitchRotX,
      0.075,
    );
    droneGroup.current.rotation.z = THREE.MathUtils.lerp(
      droneGroup.current.rotation.z,
      bankRotZ,
      0.075,
    );

    droneGroup.current.scale.setScalar(
      target.scale * responsiveScale * intro,
    );

    // 4. Optical Eye Sensor Tracking Cursor
    if (eyeGroup.current) {
      const eyeLookX = THREE.MathUtils.clamp(-ndc.y * 0.7, -0.48, 0.48);
      const eyeLookY = THREE.MathUtils.clamp(ndc.x * 0.8, -0.58, 0.58);
      eyeGroup.current.rotation.x = THREE.MathUtils.lerp(
        eyeGroup.current.rotation.x,
        eyeLookX,
        0.15,
      );
      eyeGroup.current.rotation.y = THREE.MathUtils.lerp(
        eyeGroup.current.rotation.y,
        eyeLookY,
        0.15,
      );
    }

    // Dynamic pupil focal breathing
    if (pupilRef.current) {
      const pupilScale = 1 + Math.sin(time * 3.5) * 0.12;
      pupilRef.current.scale.set(pupilScale, pupilScale, 1);
    }

    // 5. Multi-Axis Gyroscopic Quantum Gimbal Conduits
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.88;
      ring1Ref.current.rotation.y = time * 0.44;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.98;
      ring2Ref.current.rotation.z = time * 0.58;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 1.18;
      ring3Ref.current.rotation.x = -time * 0.68;
    }

    // 6. Volumetric Plasma Thruster Jet Pulse
    const thrusterPulse = 0.85 + Math.sin(time * 24.0) * 0.25;
    if (thrusterGlow1.current) {
      thrusterGlow1.current.scale.set(1, 1, thrusterPulse * 1.3);
    }
    if (thrusterGlow2.current) {
      thrusterGlow2.current.scale.set(1, 1, thrusterPulse * 1.3);
    }

    // 7. Holographic Scanner Reticle
    if (laserBeamRef.current) {
      const laserPulse = 1 + Math.sin(time * 5.0) * 0.08;
      laserBeamRef.current.scale.set(laserPulse, laserPulse, 1);
    }

    // 8. Internal Core Light Breathing
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 2.4 + Math.sin(time * 4.0) * 0.6;
    }
  });

  return (
    <group ref={droneGroup}>
      {/* 1. Main Spherical Titanium Hull */}
      <mesh material={materials.titaniumChassis} castShadow receiveShadow>
        <sphereGeometry args={[0.72, 36, 36]} />
      </mesh>

      {/* Internal Core Light */}
      <pointLight
        ref={coreLightRef}
        color="#ff9944"
        intensity={2.5}
        distance={2.8}
        position={[0, 0, 0.2]}
      />

      {/* Equatorial Ribbed Belt Panel */}
      <mesh material={materials.darkPanel}>
        <cylinderGeometry args={[0.745, 0.745, 0.18, 36]} />
      </mesh>

      {/* Decorative Gold Inset Trim Ring */}
      <mesh material={materials.goldTrim}>
        <torusGeometry args={[0.735, 0.016, 14, 64]} />
      </mesh>

      {/* 2. Front Cybernetic Sensor Eye Aperture */}
      <group ref={eyeGroup} position={[0, 0, 0.58]}>
        {/* Outer Beveled Camera Housing */}
        <mesh material={materials.goldTrim} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.38, 0.16, 32]} />
        </mesh>

        {/* Inner Dark Stepped Ring */}
        <mesh
          material={materials.darkPanel}
          position={[0, 0, 0.08]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.26, 0.3, 0.08, 32]} />
        </mesh>

        {/* Glowing Optical Glass Lens */}
        <mesh material={materials.eyeLensGlass} position={[0, 0, 0.11]}>
          <sphereGeometry args={[0.22, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>

        {/* Dynamic Pulsing Central Cyan Pupil */}
        <mesh ref={pupilRef} material={materials.eyePupilGlow} position={[0, 0, 0.18]}>
          <circleGeometry args={[0.08, 32]} />
        </mesh>

        {/* Holographic Forward Scanner Cone Beam */}
        <mesh
          ref={laserBeamRef}
          material={materials.laserBeam}
          position={[0, 0, 1.4]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.48, 2.8, 32, 1, true]} />
        </mesh>
      </group>

      {/* 3. Concentric Gyroscopic Stabilizer Rings (Holtzman Conduits) */}
      <mesh ref={ring1Ref} material={materials.cyanConduit}>
        <torusGeometry args={[0.92, 0.018, 14, 72]} />
      </mesh>

      <mesh ref={ring2Ref} material={materials.amberRing}>
        <torusGeometry args={[1.08, 0.016, 14, 72]} />
      </mesh>

      <mesh ref={ring3Ref} material={materials.goldTrim}>
        <torusGeometry args={[1.22, 0.014, 12, 72]} />
      </mesh>

      {/* 4. Directional Aerodynamic Wings */}
      <group position={[-0.72, 0, -0.1]} rotation={[0, 0, 0.2]}>
        <mesh material={materials.titaniumChassis}>
          <boxGeometry args={[0.65, 0.04, 0.45]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[-0.28, 0, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.42]} />
        </mesh>
      </group>

      <group position={[0.72, 0, -0.1]} rotation={[0, 0, -0.2]}>
        <mesh material={materials.titaniumChassis}>
          <boxGeometry args={[0.65, 0.04, 0.45]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[0.28, 0, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.42]} />
        </mesh>
      </group>

      {/* Dorsal & Ventral Fins */}
      <group position={[0, 0.72, -0.15]} rotation={[-0.25, 0, 0]}>
        <mesh material={materials.titaniumChassis}>
          <boxGeometry args={[0.04, 0.55, 0.38]} />
        </mesh>
        <mesh material={materials.cyanConduit} position={[0, 0.22, 0]}>
          <boxGeometry args={[0.06, 0.1, 0.35]} />
        </mesh>
      </group>

      <group position={[0, -0.72, -0.15]} rotation={[0.25, 0, 0]}>
        <mesh material={materials.titaniumChassis}>
          <boxGeometry args={[0.04, 0.45, 0.35]} />
        </mesh>
      </group>

      {/* 5. Rear Plasma Thruster Engines */}
      <group position={[-0.26, 0, -0.68]}>
        <mesh material={materials.darkPanel} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.25, 24]} />
        </mesh>
        <mesh
          ref={thrusterGlow1}
          material={materials.thrusterCyan}
          position={[0, 0, -0.22]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.12, 0.48, 20]} />
        </mesh>
      </group>

      <group position={[0.26, 0, -0.68]}>
        <mesh material={materials.darkPanel} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.25, 24]} />
        </mesh>
        <mesh
          ref={thrusterGlow2}
          material={materials.thrusterCyan}
          position={[0, 0, -0.22]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.12, 0.48, 20]} />
        </mesh>
      </group>

      {/* Internal Multi-Frequency Point Lights */}
      <pointLight color="#5fb8c9" intensity={2.4} distance={3.8} />
      <pointLight color="#d98c4a" intensity={2.0} distance={2.8} position={[0, 0, 0.8]} />
    </group>
  );
}
