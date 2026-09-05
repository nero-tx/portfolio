"use client";

import { useEffect, useState } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";

export default function Ground() {
  const [isLowPower, setIsLowPower] = useState(true);

  useEffect(() => {
    const isMobileOrCoarse =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsLowPower(isMobileOrCoarse);
  }, []);

  return (
    <group position={[0, -1.72, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!isLowPower}>
        <planeGeometry args={[48, 48]} />
        {isLowPower ? (
          <meshStandardMaterial
            color="#090705"
            roughness={0.8}
            metalness={0.35}
          />
        ) : (
          <MeshReflectorMaterial
            blur={[120, 30]}
            resolution={256}
            mixBlur={1.0}
            mixStrength={20}
            roughness={0.75}
            depthScale={1.0}
            minDepthThreshold={0.45}
            maxDepthThreshold={1.2}
            color="#0a0806"
            metalness={0.45}
            mirror={0.55}
          />
        )}
      </mesh>
    </group>
  );
}
