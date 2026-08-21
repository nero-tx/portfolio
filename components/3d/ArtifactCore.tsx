"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fresnelVertex, fresnelFragment } from "@/utils/shaders/fresnelRim";
import { buildFlareTexture } from "@/utils/shaders/artifactGeometry";

const BLADE_ANGLES = [
  0,
  Math.PI / 6,
  Math.PI / 3,
  Math.PI / 2,
  (Math.PI * 2) / 3,
  (Math.PI * 5) / 6,
];
const DUST_COUNT = 140;

export default function ArtifactCore({
  coreReveal,
  introRef,
}: {
  coreReveal: RefObject<number>;
  introRef: RefObject<number>;
}) {
  const coreGroup = useRef<THREE.Group>(null);
  const crystalGroup = useRef<THREE.Group>(null);
  const flareGroup = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const pulseHaloRef = useRef<THREE.Mesh>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const fillLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.PointLight>(null);
  const { camera, gl } = useThree();

  const ember = useMemo(() => new THREE.Color("#3d1408"), []);
  const spice = useMemo(() => new THREE.Color("#e67a22"), []);
  const gold = useMemo(() => new THREE.Color("#ffbe5c"), []);
  const hotCore = useMemo(() => new THREE.Color("#fffdf5"), []);
  const coolAccent = useMemo(() => new THREE.Color("#18424d"), []);
  const coolAccentBright = useMemo(() => new THREE.Color("#5fb8c9"), []);
  const scratchA = useMemo(() => new THREE.Color(), []);
  const scratchB = useMemo(() => new THREE.Color(), []);

  // Dual-Faceted Hyper-Crystal Geometries (Precision Gem Cuts)
  const crystalGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.15, 0.28, 8, 3);
    geometry.rotateY(Math.PI / 8);
    geometry.translate(0, 0.14, 0);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const crystalGeometryBottom = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.15, 0.28, 8, 3);
    geometry.rotateY(Math.PI / 8);
    geometry.rotateX(Math.PI);
    geometry.translate(0, -0.14, 0);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Inner Diamond Core Cage
  const innerDiamondGeometry = useMemo(() => {
    const geometry = new THREE.OctahedronGeometry(0.09, 0);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Refractive Hyper-Crystal Material (High IOR, Dispersion, Clearcoat)
  const crystalMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: spice.clone(),
        emissive: gold.clone(),
        emissiveIntensity: 0.9,
        roughness: 0.04,
        metalness: 0.06,
        transmission: 0.9,
        thickness: 0.75,
        ior: 1.62,
        iridescence: 0.5,
        iridescenceIOR: 1.35,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      }),
    [spice, gold],
  );

  const innerDiamondMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffb44a",
        emissiveIntensity: 2.5,
        roughness: 0.1,
        metalness: 0.9,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      }),
    [],
  );

  const nucleusMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: hotCore.clone(),
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [hotCore],
  );

  const glowUniforms = useMemo(
    () => ({
      uColor: { value: gold.clone() },
      uIntensity: { value: 0 },
      uPower: { value: 2.0 },
      uCrackIntensity: { value: 0 },
    }),
    [gold],
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fresnelVertex,
        fragmentShader: fresnelFragment,
        uniforms: glowUniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [glowUniforms],
  );

  const coolHaloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: coolAccent.clone(),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        side: THREE.BackSide,
      }),
    [coolAccent],
  );

  const haloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: gold.clone(),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [gold],
  );

  const pulseHaloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: gold.clone(),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        wireframe: true,
        toneMapped: false,
      }),
    [gold],
  );

  // Metallic Gyro Gimbal Rings (Holtzman Conduits)
  const ringMaterials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: "#5fb8c9",
        emissive: "#1b4e59",
        emissiveIntensity: 0.5,
        metalness: 0.95,
        roughness: 0.12,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      }),
      new THREE.MeshStandardMaterial({
        color: "#e89438",
        emissive: "#87450e",
        emissiveIntensity: 0.6,
        metalness: 0.94,
        roughness: 0.15,
        transparent: true,
        opacity: 0.92,
      }),
      new THREE.MeshStandardMaterial({
        color: "#ffd470",
        emissive: "#aa751c",
        emissiveIntensity: 0.7,
        metalness: 0.96,
        roughness: 0.1,
        transparent: true,
        opacity: 0.96,
      }),
    ],
    [],
  );

  const flareTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const texture = new THREE.CanvasTexture(buildFlareTexture());
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [gl]);

  const flareMaterials = useMemo(
    () =>
      BLADE_ANGLES.map(
        (_, i) =>
          new THREE.MeshBasicMaterial({
            map: flareTexture ?? undefined,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false,
            color: (i % 2 === 0 ? gold : coolAccentBright).clone(),
          }),
      ),
    [flareTexture, gold, coolAccentBright],
  );

  // Toroidal Magnetic Vortex Particle Field
  const [dustPositions, dustColors, dustParams] = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    const col = new Float32Array(DUST_COUNT * 3);
    const params = new Float32Array(DUST_COUNT * 3); // [radius, theta, phiSpeed]

    const warmA = new THREE.Color("#ffc266");
    const warmB = new THREE.Color("#ff7728");
    const cool = new THREE.Color("#5fb8c9");
    const temp = new THREE.Color();

    for (let i = 0; i < DUST_COUNT; i++) {
      const u = Math.random();
      const r = 0.16 + Math.pow(u, 1.5) * 0.65;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      params[i * 3] = r;
      params[i * 3 + 1] = theta;
      params[i * 3 + 2] = 0.3 + Math.random() * 0.8; // speed

      const roll = Math.random();
      if (roll < 0.6) {
        temp.copy(warmA);
      } else if (roll < 0.85) {
        temp.copy(warmB);
      } else {
        temp.copy(cool);
      }

      col[i * 3] = temp.r;
      col[i * 3 + 1] = temp.g;
      col[i * 3 + 2] = temp.b;
    }

    return [pos, col, params];
  }, []);

  const dustGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3),
    );
    geometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));
    return geometry;
  }, [dustPositions, dustColors]);

  const dustMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.014,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        toneMapped: false,
      }),
    [],
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const reveal = THREE.MathUtils.clamp(coreReveal.current ?? 0, 0, 1);
    const intro = THREE.MathUtils.clamp(introRef.current ?? 0, 0, 1);

    // Ominous Dune Cardiac Energy Pulse (Sub-harmonic heartbeat rhythm)
    const rawPulse = Math.sin(time * 2.4);
    const cardiacShock = Math.pow(Math.max(0, rawPulse), 4.0); // sharp cardiac expansion
    const breathingSlow = Math.sin(time * 0.8) * 0.08;
    const pulse = 0.94 + cardiacShock * 0.18 + breathingSlow;

    // Gyroscopic Ring Rotations (Counter-rotating gimbal axes)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.85;
      ring1Ref.current.rotation.y = time * 0.45;
      ring1Ref.current.rotation.z = Math.sin(time * 0.5) * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -time * 0.65;
      ring2Ref.current.rotation.y = time * 0.95;
      ring2Ref.current.rotation.z = Math.cos(time * 0.6) * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = time * 0.5;
      ring3Ref.current.rotation.y = -time * 0.75;
      ring3Ref.current.rotation.z = time * 0.6;
    }

    if (coreGroup.current) {
      coreGroup.current.rotation.y +=
        delta * THREE.MathUtils.lerp(0.12, 0.45, reveal);
      coreGroup.current.rotation.x = Math.sin(time * 0.4) * 0.04 * reveal;
    }

    if (crystalGroup.current) {
      crystalGroup.current.rotation.y = time * 0.55 + reveal * Math.PI * 0.5;
      crystalGroup.current.rotation.z = Math.sin(time * 0.5) * 0.04;
      const crystalScale = THREE.MathUtils.lerp(0.58, 1.32, reveal) * pulse;
      crystalGroup.current.scale.setScalar(crystalScale);
    }

    // Material transitions
    scratchA.copy(ember).lerp(spice, Math.min(1, reveal * 1.5));
    crystalMaterial.color.copy(scratchA);
    scratchB.copy(spice).lerp(hotCore, reveal);
    crystalMaterial.emissive.copy(scratchB);
    crystalMaterial.emissiveIntensity =
      (THREE.MathUtils.lerp(0.3, 4.8, reveal) + cardiacShock * 1.5) * intro;
    crystalMaterial.opacity = THREE.MathUtils.lerp(0.55, 0.96, reveal);

    scratchA.copy(spice).lerp(gold, reveal);
    (glowUniforms.uColor.value as THREE.Color).copy(scratchA);
    glowUniforms.uIntensity.value =
      (THREE.MathUtils.lerp(0.0, 3.6, reveal) + cardiacShock * 1.2) * intro;
    glowUniforms.uPower.value = THREE.MathUtils.lerp(3.0, 1.5, reveal);

    if (coreGroup.current) {
      const nucleus = coreGroup.current.getObjectByName("nucleus");
      if (nucleus) {
        const nucleusScale =
          (THREE.MathUtils.lerp(0.45, 1.45, reveal) + cardiacShock * 0.25) *
          intro;
        nucleus.scale.setScalar(nucleusScale);
        nucleusMaterial.opacity = THREE.MathUtils.lerp(0, 1.0, reveal) * intro;
      }
    }

    haloMaterial.opacity =
      (THREE.MathUtils.lerp(0, 0.25, reveal) + cardiacShock * 0.1) * intro;
    const coolReveal = THREE.MathUtils.smoothstep(reveal, 0.55, 1);
    coolHaloMaterial.opacity = coolReveal * 0.18 * pulse * intro;

    // Expanding Cardiac Shockwave Halo
    if (pulseHaloRef.current) {
      const shockwaveProg = (time * 1.2) % 1;
      pulseHaloRef.current.scale.setScalar(
        THREE.MathUtils.lerp(0.3, 1.8, shockwaveProg) * (0.8 + reveal * 0.6),
      );
      pulseHaloMaterial.opacity =
        (1 - shockwaveProg) * 0.25 * reveal * intro;
    }

    ringMaterials[0].opacity =
      THREE.MathUtils.lerp(0, 0.5, reveal) * pulse * intro;
    ringMaterials[1].opacity =
      THREE.MathUtils.lerp(0, 0.7, Math.max(0, reveal - 0.08)) * pulse * intro;
    ringMaterials[2].opacity =
      THREE.MathUtils.lerp(0, 0.8, Math.max(0, reveal - 0.15)) * pulse * intro;

    // Flare rays
    const flareReveal = THREE.MathUtils.smoothstep(reveal, 0.22, 0.88);
    flareMaterials.forEach((material, index) => {
      const shimmer = 0.8 + Math.sin(time * 2.5 + index * 1.4) * 0.2;
      material.opacity =
        (flareReveal * shimmer * 0.85 + cardiacShock * 0.2) * intro;
    });

    if (flareGroup.current) {
      flareGroup.current.quaternion.copy(camera.quaternion);
      const flareScale =
        (THREE.MathUtils.lerp(0.2, 1.28, flareReveal) + cardiacShock * 0.2) *
        pulse;
      flareGroup.current.scale.setScalar(flareScale);
      flareGroup.current.rotation.z = time * 0.05;
    }

    // Toroidal Magnetic Vortex Particle Swarm Animation
    dustMaterial.opacity = THREE.MathUtils.lerp(0, 0.9, reveal) * intro;

    if (dustGeometry.attributes.position) {
      const posAttr = dustGeometry.attributes.position;
      for (let i = 0; i < DUST_COUNT; i++) {
        const baseR = dustParams[i * 3] * (1 + reveal * 0.4);
        const theta = dustParams[i * 3 + 1];
        const spd = dustParams[i * 3 + 2];

        const curTheta =
          theta + time * spd * THREE.MathUtils.lerp(0.4, 1.8, reveal);
        const curPhi = Math.sin(time * 0.6 + i) * 0.6;

        posAttr.setXYZ(
          i,
          baseR * Math.cos(curTheta) * Math.cos(curPhi),
          baseR * Math.sin(curPhi) + Math.sin(time * 1.1 + i) * 0.02,
          baseR * Math.sin(curTheta) * Math.cos(curPhi),
        );
      }
      posAttr.needsUpdate = true;
    }

    // Dynamic inverse-square core lighting
    if (coreLight.current) {
      scratchA.copy(ember).lerp(gold, reveal);
      coreLight.current.color.copy(scratchA);
      coreLight.current.intensity =
        (THREE.MathUtils.lerp(0.15, 12.0, reveal) + cardiacShock * 4.0) * intro;
      coreLight.current.distance = THREE.MathUtils.lerp(2.2, 8.5, reveal);
    }

    if (fillLight.current) {
      fillLight.current.intensity =
        (THREE.MathUtils.lerp(0, 2.8, reveal) + cardiacShock * 0.8) * intro;
    }

    if (rimLight.current) {
      rimLight.current.intensity =
        THREE.MathUtils.lerp(0, 1.8, coolReveal) * intro;
    }
  });

  return (
    <group ref={coreGroup} position={[0, 0.05, 0]}>
      {/* Blinding White-Hot Energy Singularity */}
      <mesh name="nucleus" material={nucleusMaterial}>
        <sphereGeometry args={[0.058, 32, 32]} />
      </mesh>

      {/* Radiant Solar Halos */}
      <mesh material={haloMaterial} scale={1.2}>
        <sphereGeometry args={[0.19, 24, 24]} />
      </mesh>

      <mesh material={coolHaloMaterial} scale={1.6}>
        <sphereGeometry args={[0.19, 24, 24]} />
      </mesh>

      {/* Expanding Cardiac Shockwave Wire */}
      <mesh ref={pulseHaloRef} material={pulseHaloMaterial}>
        <sphereGeometry args={[0.22, 16, 16]} />
      </mesh>

      {/* Refractive Bipyramidal Hyper-Gemstone Cage */}
      <group ref={crystalGroup}>
        <mesh geometry={crystalGeometry} material={crystalMaterial} />
        <mesh geometry={crystalGeometryBottom} material={crystalMaterial} />
        <mesh geometry={innerDiamondGeometry} material={innerDiamondMaterial} />
        <mesh geometry={crystalGeometry} material={glowMaterial} scale={1.48} />
        <mesh
          geometry={crystalGeometryBottom}
          material={glowMaterial}
          scale={1.48}
        />
      </group>

      {/* 3 Gyroscopic Counter-Rotating Gimbal Rings */}
      <group>
        <mesh ref={ring1Ref} material={ringMaterials[0]}>
          <torusGeometry args={[0.23, 0.005, 12, 64]} />
        </mesh>
        <mesh ref={ring2Ref} material={ringMaterials[1]}>
          <torusGeometry args={[0.31, 0.004, 8, 64]} />
        </mesh>
        <mesh ref={ring3Ref} material={ringMaterials[2]}>
          <torusGeometry args={[0.39, 0.003, 8, 64]} />
        </mesh>
      </group>

      {/* Toroidal Magnetic Vortex Particle Swarm */}
      <points geometry={dustGeometry} material={dustMaterial} />

      {/* Volumetric Coronal Flares */}
      <group ref={flareGroup}>
        {BLADE_ANGLES.map((angle, index) => (
          <mesh
            key={angle}
            rotation={[0, 0, angle]}
            material={flareMaterials[index]}
          >
            <planeGeometry args={[0.045, 1.45]} />
          </mesh>
        ))}
      </group>

      {/* Inverse-Square Dynamic Point Lights */}
      <pointLight
        ref={coreLight}
        color="#e07e28"
        intensity={0.15}
        distance={2.8}
        decay={2}
      />
      <pointLight
        ref={fillLight}
        color="#ffd9a0"
        intensity={0}
        distance={4.0}
        decay={2}
      />
      <pointLight
        ref={rimLight}
        color="#5fb8c9"
        intensity={0}
        distance={2.5}
        decay={2}
      />
    </group>
  );
}
