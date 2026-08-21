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

/**
 * Builds a sculpted, faceted monolithic polyhedral relic.
 * Combines an elongated biconical polyhedron with crisp geometric chamfers,
 * planar facet emphasis, and subtle micro-mineral surface displacement.
 */
export function buildArtifactGeometry(seed: number = 42): THREE.BufferGeometry {
  const noise3D = createNoise3D(mulberry32(seed));
  const radius = 1.5;
  const geometry = new THREE.IcosahedronGeometry(radius, 5);
  const pos = geometry.attributes.position as THREE.BufferAttribute;

  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Height ratio from bottom (-radius) to top (+radius) in [0, 1]
    const t = (v.y + radius) / (radius * 2);

    // Sculpt into an elegant elongated faceted monolith
    const waist = Math.sin(t * Math.PI);
    const taper = 0.35 + 0.95 * Math.pow(waist, 0.7);

    // Give horizontal cross-section a faceted polyhedral symmetry
    const angle = Math.atan2(v.z, v.x);
    const facetMod = 1.0 + 0.08 * Math.cos(angle * 6.0) + 0.04 * Math.cos(angle * 12.0);

    v.x *= taper * facetMod;
    v.z *= taper * facetMod;
    v.y *= 1.28; // Majestic vertical elongation

    // Subtle planar snapping to create crisp, diamond-cut crystalline facets
    const norm = v.clone().normalize();
    const facetStrength = 0.06;
    norm.x = Math.round(norm.x * 4.0) / 4.0;
    norm.y = Math.round(norm.y * 4.0) / 4.0;
    norm.z = Math.round(norm.z * 4.0) / 4.0;
    norm.normalize();
    v.lerp(norm.multiplyScalar(v.length()), facetStrength);

    // Multi-octave natural mineral erosion noise for high realism
    let n = 0;
    let amp = 0.042;
    let freq = 1.8;
    for (let o = 0; o < 4; o++) {
      n += noise3D(v.x * freq, v.y * freq, v.z * freq) * amp;
      amp *= 0.45;
      freq *= 2.2;
    }

    // Carved central equatorial crevasse where energy emerges
    const equatorDist = Math.abs(t - 0.5);
    const crevasse = Math.exp(-Math.pow(equatorDist / 0.12, 2.0)) * 0.06;

    const dir = v.clone().normalize();
    v.addScaledVector(dir, n - crevasse);

    // Sharp pinnacle and anchor refinement
    if (t < 0.08) {
      const pull = 1 - t / 0.08;
      v.x *= 1 - pull * 0.75;
      v.z *= 1 - pull * 0.75;
    }
    if (t > 0.92) {
      const pull = (t - 0.92) / 0.08;
      v.x *= 1 - pull * 0.65;
      v.z *= 1 - pull * 0.65;
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Builds faceted orbital satellite crystal/obsidian shards that hover around the relic.
 */
export function buildShardGeometry(index: number = 0): THREE.BufferGeometry {
  const seed = 100 + index * 37;
  const noise3D = createNoise3D(mulberry32(seed));
  const baseSize = 0.18 + (index % 3) * 0.05;
  const geometry = new THREE.OctahedronGeometry(baseSize, 1);
  const pos = geometry.attributes.position as THREE.BufferAttribute;

  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // Elongate along vertical axis
    v.y *= 1.7;
    v.x *= 0.75;
    const n = noise3D(v.x * 3.5, v.y * 3.5, v.z * 3.5) * 0.035;
    v.addScaledVector(v.clone().normalize(), n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Multi-scale procedural canvas texture for obsidian/meteorite bump & micro-normals.
 */
export function buildRockDetailCanvas(): HTMLCanvasElement {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      // Multi-scale procedural layered noise (cracks, basalt pores, fine mineral grit)
      const nx = x / size;
      const ny = y / size;

      const largeGrain = Math.sin(nx * 18.0) * Math.cos(ny * 18.0);
      const medGrain = Math.sin(nx * 60.0 + largeGrain * 2.0) * Math.cos(ny * 60.0);
      const microGrit = (Math.random() - 0.5) * 0.35;

      // Slate vein streaks
      const vein = Math.sin(nx * 30.0 + ny * 20.0 + Math.sin(ny * 40.0) * 0.5);
      const veinValue = Math.exp(-Math.pow(vein / 0.25, 2)) * 0.25;

      const raw = 0.5 + 0.2 * largeGrain + 0.15 * medGrain + microGrit + veinValue;
      const val = Math.min(255, Math.max(0, Math.floor(raw * 255)));

      img.data[i] = val;
      img.data[i + 1] = val;
      img.data[i + 2] = val;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/**
 * Specular roughness map canvas: Creates polished facets contrasting with matte micro-pores.
 */
export function buildRockRoughnessCanvas(): HTMLCanvasElement {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const nx = x / size;
      const ny = y / size;

      // Facet zones with variable glossiness
      const facetNoise = Math.sin(nx * 12.0) * Math.cos(ny * 12.0);
      const isGlossy = facetNoise > 0.2 ? 0.35 : 0.85;
      const grit = (Math.random() - 0.5) * 0.1;

      const roughness = Math.min(255, Math.max(0, Math.floor((isGlossy + grit) * 255)));

      img.data[i] = roughness;
      img.data[i + 1] = roughness;
      img.data[i + 2] = roughness;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/**
 * High-definition radial exponential lens flare texture for the hyper-core singularity.
 */
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
  gradient.addColorStop(0, "rgba(255,250,235,1.0)");
  gradient.addColorStop(0.08, "rgba(255,215,140,0.95)");
  gradient.addColorStop(0.25, "rgba(255,160,70,0.5)");
  gradient.addColorStop(0.6, "rgba(220,95,25,0.15)");
  gradient.addColorStop(1.0, "rgba(180,60,10,0.0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}
