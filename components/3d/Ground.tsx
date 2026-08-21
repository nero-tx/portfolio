"use client";

import { MeshReflectorMaterial } from "@react-three/drei";

export default function Ground() {
  return (
    <group position={[0, -1.72, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[48, 48]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1.2}
          mixStrength={45}
          roughness={0.7}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0806"
          metalness={0.45}
          mirror={0.65}
        />
      </mesh>
    </group>
  );
}
