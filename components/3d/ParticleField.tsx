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
  gradient.addColorStop(0, "rgba(255,255,255,1.0)");
  gradient.addColorStop(0.2, "rgba(255,220,160,0.85)");
  gradient.addColorStop(0.5, "rgba(255,160,80,0.35)");
  gradient.addColorStop(1, "rgba(255,140,50,0.0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const COUNT = 100;

export default function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const texture = useMemo(
    () => (typeof document !== "undefined" ? buildDotTexture() : null),
    [],
  );

  const [positions, colors, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    const phs = new Float32Array(COUNT);

    const warmA = new THREE.Color("#ffc470");
    const warmB = new THREE.Color("#ff8838");
    const cool = new THREE.Color("#5fb8c9");
    const temp = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 7 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      spd[i] = 0.04 + Math.random() * 0.08;
      phs[i] = Math.random() * Math.PI * 2;

      const r = Math.random();
      if (r < 0.65) {
        temp.copy(warmA);
      } else if (r < 0.88) {
        temp.copy(warmB);
      } else {
        temp.copy(cool);
      }

      col[i * 3] = temp.r;
      col[i * 3 + 1] = temp.g;
      col[i * 3 + 2] = temp.b;
    }
    return [pos, col, spd, phs];
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    const time = performance.now() * 0.001;
    const arr = points.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      const idx = i * 3;
      // Upward thermal drift
      arr[idx + 1] += speeds[i] * delta;
      arr[idx] += Math.sin(time * 0.35 + phases[i]) * 0.001;

      // Reset when floating too high
      if (arr[idx + 1] > 3.8) {
        arr[idx + 1] = -2.8;
        arr[idx] = (Math.random() - 0.5) * 14;
        arr[idx + 2] = (Math.random() - 0.5) * 12;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!texture) return null;

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>

      <pointsMaterial
        size={0.05}
        map={texture}
        vertexColors
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
