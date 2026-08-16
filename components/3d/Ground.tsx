"use client";

import { MeshReflectorMaterial } from "@react-three/drei";

export default function Ground() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.72, 0]}
      receiveShadow
    >
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={35}
        roughness={1}
        depthScale={1.1}
        minDepthThreshold={0.85}
        maxDepthThreshold={1.2}
        color="#0c0906"
        metalness={0.4}
        mirror={0}
      />
    </mesh>
  );
}
