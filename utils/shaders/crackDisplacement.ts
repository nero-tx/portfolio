import * as THREE from "three";
import { simplexNoise3D } from "./fresnelRim";

export interface CrackUniforms {
  uCrackIntensity: { value: number };
  uCrackSeed: { value: number };
}

/**
 * Mutates a MeshStandardMaterial in place, injecting:
 * - vertex displacement along the normal near noise "seams" (fracture-opening look)
 * - emissive vein-flare boost in the fragment shader, tied to the same noise field
 */
export function applyCrackDisplacement(
  material: THREE.MeshStandardMaterial,
  uniforms: CrackUniforms,
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCrackIntensity = uniforms.uCrackIntensity;
    shader.uniforms.uCrackSeed = uniforms.uCrackSeed;

    // --- vertex: displace along normal, and pass crack value to fragment ---
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uCrackIntensity;
        uniform float uCrackSeed;
        varying float vCrackNoise;
        ${simplexNoise3D}`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float crackN = snoise(position * 3.1 + uCrackSeed);
        float crackFactor = smoothstep(0.15, 0.9, crackN) * uCrackIntensity;
        transformed += normal * crackFactor * 0.09;
        vCrackNoise = crackFactor;`,
      );

    // --- fragment: flare emissive along the same seams ---
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying float vCrackNoise;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        vec3 crackGlow = vec3(1.0, 0.55, 0.18) * vCrackNoise * 2.4;
        totalEmissiveRadiance += crackGlow;`,
      );

    material.userData.shader = shader;
  };

  material.needsUpdate = true;
}
