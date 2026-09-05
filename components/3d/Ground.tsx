"use client";

export default function Ground() {
  return (
    <group position={[0, -1.72, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial
          color="#080604"
          roughness={0.82}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}
