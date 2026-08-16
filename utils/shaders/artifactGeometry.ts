import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildArtifactGeometry(seed: number = 7): THREE.BufferGeometry {
  const noise3D = createNoise3D(mulberry32(seed));
  const radius = 1.6;
  const geometry = new THREE.IcosahedronGeometry(radius, 4);
  const pos = geometry.attributes.position as THREE.BufferAttribute;

  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    const t = (v.y + radius) / (radius * 2);

    const shoulder = Math.sin(Math.PI * Math.pow(t, 0.85));
    const taper = 0.22 + 0.92 * Math.pow(shoulder, 0.75);

    v.x *= taper;
    v.z *= taper;

    const dir = v.clone().normalize();
    let n = 0;
    let amp = 1;
    let freq = 1.6;
    for (let o = 0; o < 4; o++) {
      n += noise3D(dir.x * freq, dir.y * freq, dir.z * freq) * amp;
      amp *= 0.5;
      freq *= 2.1;
    }
    const displacement = n * 0.045;

    v.addScaledVector(dir, displacement);

    if (t < 0.08) {
      const pull = 1 - t / 0.08;
      v.x *= 1 - pull * 0.85;
      v.z *= 1 - pull * 0.85;
    }
    if (t > 0.93) {
      const pull = (t - 0.93) / 0.07;
      v.x *= 1 - pull * 0.6;
      v.z *= 1 - pull * 0.6;
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

export function buildRockDetailCanvas(): HTMLCanvasElement {
  const size = 500;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const base =
        128 +
        60 * Math.sin(x * 0.09) * Math.cos(y * 0.07) +
        (Math.random() - 0.5) * 90;
      const val = Math.min(255, Math.max(0, base));
      img.data[i] = val;
      img.data[i + 1] = val;
      img.data[i + 2] = val;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

export function buildFlareTexture(): HTMLCanvasElement {
  const size = 256;
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
  gradient.addColorStop(0, "rgba(255,240,214,1)");
  gradient.addColorStop(0.12, "rgba(255,214,158,0.95)");
  gradient.addColorStop(0.35, "rgba(255,184,113,0.4)");
  gradient.addColorStop(1, "rgba(255,184,113,0.5)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}
