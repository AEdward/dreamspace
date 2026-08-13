"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type * as THREE from "three";

interface UnitModelProps {
  sqm: number;
  bedrooms: number;
  bathrooms: number;
}

/**
 * There are no real 3D scans/CAD models of the actual units, so this is a
 * stylized architectural massing model: a footprint slab sized off sqm,
 * with one raised block per bedroom and a smaller block per bathroom.
 * It's illustrative of scale/room count, not a floor plan.
 */
function Massing({ sqm, bedrooms, bathrooms }: UnitModelProps) {
  const group = useRef<THREE.Group>(null);
  const footprint = 1.4 + Math.min(sqm / 60, 1.6);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  const bedroomBlocks = Array.from({ length: Math.max(bedrooms, 1) }, (_, i) => {
    const cols = Math.ceil(Math.sqrt(bedrooms || 1));
    const row = Math.floor(i / cols);
    const col = i % cols;
    const spacing = footprint / cols;
    return {
      position: [
        -footprint / 2 + spacing * col + spacing / 2,
        0.5,
        -footprint / 2 + spacing * (row + 0.5),
      ] as [number, number, number],
      size: [spacing * 0.78, 0.9, spacing * 0.78] as [number, number, number],
    };
  });

  const bathroomBlocks = Array.from({ length: Math.max(bathrooms, 1) }, (_, i) => ({
    position: [footprint / 2 - 0.35, 0.3, -footprint / 2 + 0.35 + i * 0.5] as [number, number, number],
    size: [0.4, 0.5, 0.4] as [number, number, number],
  }));

  return (
    <group ref={group}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[footprint, 0.1, footprint]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
      {bedroomBlocks.map((b, i) => (
        <mesh key={`bed-${i}`} position={b.position}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color="#07283b" roughness={0.4} metalness={0.15} />
        </mesh>
      ))}
      {bathroomBlocks.map((b, i) => (
        <mesh key={`bath-${i}`} position={b.position}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color="#f4600a" roughness={0.4} metalness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

export function UnitModel(props: UnitModelProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [3.2, 2.4, 3.6], fov: 40 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 4]} intensity={1.3} />
      <pointLight position={[-3, 1, -2]} intensity={0.4} color="#f4600a" />
      <Massing {...props} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
