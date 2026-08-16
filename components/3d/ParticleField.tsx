"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function buildDotTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,214,150,0.9)");
  gradient.addColorStop(1, "rgba(255,214,150,0.2)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const COUNT = 500;

export default function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const texture = useMemo(
    () => (typeof document !== "undefined" ? buildDotTexture() : null),
    [],
  );

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = Math.random() * 5 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
      spd[i] = 0.05 + Math.random() * 0.12;
    }
    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    const arr = points.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      arr[i * 3] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.0007;
      if (arr[i * 3 + 1] > 3) arr[i * 3 + 1] = -2;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!texture) return null;

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>

      <pointsMaterial
        size={0.045}
        map={texture}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#e8a94a"
      />
    </points>
  );
}
