"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fresnelVertex, fresnelFragment } from "@/utils/shaders/fresnelRim";
import { buildFlareTexture } from "@/utils/shaders/artifactGeometry";

const BLADE_ANGLES = [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4];
const DUST_COUNT = 70;

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
  const ringGroup = useRef<THREE.Group>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const fillLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.PointLight>(null);
  const { camera, gl } = useThree();

  const ember = useMemo(() => new THREE.Color("#5c2a16"), []);
  const spice = useMemo(() => new THREE.Color("#d88932"), []);
  const gold = useMemo(() => new THREE.Color("#ffbd67"), []);
  const hotCore = useMemo(() => new THREE.Color("#fff1cf"), []);
  const coolAccent = useMemo(() => new THREE.Color("#2f5b66"), []);
  const coolAccentBright = useMemo(() => new THREE.Color("#5fb8c9"), []);
  const scratchA = useMemo(() => new THREE.Color(), []);
  const scratchB = useMemo(() => new THREE.Color(), []);

  const crystalGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.105, 0.17, 6, 2);
    geometry.rotateY(Math.PI / 6);
    geometry.translate(0, 0.085, 0);
    return geometry;
  }, []);

  const crystalGeometryBottom = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.105, 0.17, 6, 2);
    geometry.rotateY(Math.PI / 6);
    geometry.rotateX(Math.PI);
    geometry.translate(0, -0.085, 0);
    return geometry;
  }, []);

  const crystalMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: spice.clone(),
        emissive: gold.clone(),
        emissiveIntensity: 0.7,
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.72,
        thickness: 0.42,
        ior: 1.42,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      }),
    [spice, gold],
  );

  const nucleusMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: hotCore.clone(),
        transparent: true,
        opacity: 0.95,
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
      uPower: { value: 2.4 },
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

  const ringMaterials = useMemo(
    () => [
      new THREE.MeshBasicMaterial({
        color: coolAccentBright.clone(),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
      new THREE.MeshBasicMaterial({
        color: spice.clone(),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
      new THREE.MeshBasicMaterial({
        color: gold.clone(),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    ],
    [coolAccentBright, spice, gold],
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

  const dustPositions = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const random = () => Math.random();
    for (let i = 0; i < DUST_COUNT; i++) {
      const radius = 0.16 + Math.pow(random(), 1.8) * 0.45;
      const angle = random() * Math.PI * 2;
      const height = (random() - 0.5) * 0.55;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  const dustColors = useMemo(() => {
    const colors = new Float32Array(DUST_COUNT * 3);
    const warm = new THREE.Color("#ffbd67");
    const cool = new THREE.Color("#5fb8c9");
    for (let i = 0; i < DUST_COUNT; i++) {
      const c = Math.random() > 0.3 ? warm : cool;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return colors;
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
        size: 0.009,
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

    const breathing =
      0.5 + Math.sin(time * 1.35) * 0.22 + Math.sin(time * 2.1) * 0.08;
    const pulse = 0.92 + breathing * 0.12;

    if (coreGroup.current) {
      coreGroup.current.rotation.y +=
        delta * THREE.MathUtils.lerp(0.08, 0.28, reveal);
      coreGroup.current.rotation.x = Math.sin(time * 0.35) * 0.035 * reveal;
    }

    if (crystalGroup.current) {
      crystalGroup.current.rotation.y = time * 0.38 + reveal * Math.PI * 0.35;
      crystalGroup.current.rotation.z = Math.sin(time * 0.4) * 0.025;
      const crystalScale = THREE.MathUtils.lerp(0.52, 1.18, reveal) * pulse;
      crystalGroup.current.scale.setScalar(crystalScale);
    }

    scratchA.copy(ember).lerp(spice, Math.min(1, reveal * 1.6));
    crystalMaterial.color.copy(scratchA);
    scratchB.copy(spice).lerp(hotCore, reveal);
    crystalMaterial.emissive.copy(scratchB);
    crystalMaterial.emissiveIntensity =
      THREE.MathUtils.lerp(0.15, 3.8, reveal) * pulse * intro;
    crystalMaterial.opacity = THREE.MathUtils.lerp(0.48, 0.92, reveal);

    scratchA.copy(spice).lerp(gold, reveal);
    (glowUniforms.uColor.value as THREE.Color).copy(scratchA);
    glowUniforms.uIntensity.value =
      THREE.MathUtils.lerp(0.0, 2.8, reveal) * pulse * intro;
    glowUniforms.uPower.value = THREE.MathUtils.lerp(3.4, 1.7, reveal);

    if (coreGroup.current) {
      const nucleus = coreGroup.current.getObjectByName("nucleus");
      if (nucleus) {
        const nucleusScale = THREE.MathUtils.lerp(0.35, 1.35, reveal) * pulse;
        nucleus.scale.setScalar(nucleusScale);
        nucleusMaterial.opacity = THREE.MathUtils.lerp(0, 0.95, reveal) * intro;
      }
    }

    haloMaterial.opacity =
      THREE.MathUtils.lerp(0, 0.16, reveal) * pulse * intro;
    const coolReveal = THREE.MathUtils.smoothstep(reveal, 0.55, 1);
    coolHaloMaterial.opacity = coolReveal * 0.12 * pulse * intro;

    if (ringGroup.current) {
      ringGroup.current.rotation.y = time * 0.22;
      ringGroup.current.rotation.x = Math.sin(time * 0.45) * 0.18;
      ringGroup.current.rotation.z = time * 0.08;
      const ringScale = THREE.MathUtils.lerp(0.2, 1.15, reveal);
      ringGroup.current.scale.setScalar(ringScale);
    }

    ringMaterials[0].opacity =
      THREE.MathUtils.lerp(0, 0.3, reveal) * pulse * intro;
    ringMaterials[1].opacity =
      THREE.MathUtils.lerp(0, 0.38, Math.max(0, reveal - 0.1)) * pulse * intro;
    ringMaterials[2].opacity =
      THREE.MathUtils.lerp(0, 0.46, Math.max(0, reveal - 0.2)) * pulse * intro;

    const flareReveal = THREE.MathUtils.smoothstep(reveal, 0.28, 0.82);
    flareMaterials.forEach((material, index) => {
      const shimmer = 0.82 + Math.sin(time * 2.2 + index * 1.7) * 0.18;
      material.opacity = flareReveal * shimmer * 0.7 * intro;
    });

    if (flareGroup.current) {
      flareGroup.current.quaternion.copy(camera.quaternion);
      const flareScale = THREE.MathUtils.lerp(0.15, 1.15, flareReveal) * pulse;
      flareGroup.current.scale.setScalar(flareScale);
      flareGroup.current.rotation.z = time * 0.035;
    }

    dustMaterial.opacity = THREE.MathUtils.lerp(0, 0.75, reveal) * intro;

    if (dustGeometry.attributes.position) {
      const position = dustGeometry.attributes.position;
      for (let i = 0; i < DUST_COUNT; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);
        const angle = Math.atan2(z, x);
        const radius = Math.sqrt(x * x + z * z);
        const newAngle =
          angle + delta * THREE.MathUtils.lerp(0.015, 0.12, reveal);
        position.setX(i, Math.cos(newAngle) * radius);
        position.setZ(i, Math.sin(newAngle) * radius);
        position.setY(i, y + Math.sin(time * 0.7 + i) * 0.0004);
      }
      position.needsUpdate = true;
    }

    if (coreLight.current) {
      scratchA.copy(ember).lerp(gold, reveal);
      coreLight.current.color.copy(scratchA);
      coreLight.current.intensity =
        THREE.MathUtils.lerp(0.05, 8, reveal) * pulse * intro;
      coreLight.current.distance = THREE.MathUtils.lerp(1.5, 6.5, reveal);
    }

    if (fillLight.current) {
      fillLight.current.intensity =
        THREE.MathUtils.lerp(0, 1.8, reveal) * intro;
    }

    if (rimLight.current) {
      rimLight.current.intensity =
        THREE.MathUtils.lerp(0, 1.1, coolReveal) * intro;
    }
  });

  return (
    <group ref={coreGroup} position={[0, 0.05, 0]}>
      <mesh name="nucleus" material={nucleusMaterial}>
        <sphereGeometry args={[0.045, 16, 16]} />
      </mesh>

      <mesh material={haloMaterial} scale={1}>
        <sphereGeometry args={[0.16, 24, 24]} />
      </mesh>

      <mesh material={coolHaloMaterial} scale={1.4}>
        <sphereGeometry args={[0.16, 24, 24]} />
      </mesh>

      <group ref={crystalGroup}>
        <mesh geometry={crystalGeometry} material={crystalMaterial} />
        <mesh geometry={crystalGeometryBottom} material={crystalMaterial} />
        <mesh geometry={crystalGeometry} material={glowMaterial} scale={1.55} />
        <mesh
          geometry={crystalGeometryBottom}
          material={glowMaterial}
          scale={1.55}
        />
      </group>

      <group ref={ringGroup}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={ringMaterials[0]}>
          <torusGeometry args={[0.19, 0.004, 8, 64]} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.2, 0]} material={ringMaterials[1]}>
          <torusGeometry args={[0.25, 0.0025, 6, 64]} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, 0.4, 0]} material={ringMaterials[2]}>
          <torusGeometry args={[0.31, 0.0018, 6, 64]} />
        </mesh>
      </group>

      <points geometry={dustGeometry} material={dustMaterial} />

      <group ref={flareGroup}>
        {BLADE_ANGLES.map((angle, index) => (
          <mesh
            key={angle}
            rotation={[0, 0, angle]}
            material={flareMaterials[index]}
          >
            <planeGeometry args={[0.035, 1.15]} />
          </mesh>
        ))}
      </group>

      <pointLight
        ref={coreLight}
        color="#5c2a16"
        intensity={0.05}
        distance={2}
        decay={2}
      />
      <pointLight
        ref={fillLight}
        color="#ffd9a0"
        intensity={0}
        distance={2.5}
        decay={2}
      />
      <pointLight
        ref={rimLight}
        color="#5fb8c9"
        intensity={0}
        distance={1.8}
        decay={2}
      />
    </group>
  );
}
