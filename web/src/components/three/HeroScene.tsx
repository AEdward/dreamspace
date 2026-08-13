"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type * as THREE from "three";

interface Block {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

const BLOCKS: Block[] = [
  { position: [-1.7, -0.5, 0], size: [0.9, 1.6, 0.9], color: "#0a3550" },
  { position: [0, -1, 0.3], size: [1.15, 2.7, 1.15], color: "#07283b" },
  { position: [1.8, -0.3, -0.2], size: [0.8, 2.05, 0.8], color: "#0e4468" },
  { position: [-0.5, 0.55, 0.9], size: [0.55, 0.55, 0.55], color: "#f4600a" },
];

function Blocks() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={group}>
      {BLOCKS.map((block, i) => (
        <Float key={i} speed={1.1} rotationIntensity={0.12} floatIntensity={0.5}>
          <mesh position={block.position}>
            <boxGeometry args={block.size} />
            <meshStandardMaterial color={block.color} roughness={0.35} metalness={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [4.2, 2.1, 6], fov: 40 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 5]} intensity={1.5} />
      <pointLight position={[-4, -1.5, -1]} intensity={0.6} color="#f4600a" />
      <Blocks />
    </Canvas>
  );
}
