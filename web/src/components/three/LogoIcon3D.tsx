"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Traced from public/brand/logo.png's icon mark, normalized to a shared
// coordinate space (canvas-center origin) so the flag and rectangle stay
// aligned relative to each other without extra repositioning math.
const FLAG_POINTS: [number, number][] = [
  [-0.38, 1.2225],
  [0.84, 1.2225],
  [-0.075, 0.2125],
  [-0.075, -1.2225],
  [-1.225, -1.2225],
  [-1.225, 0.3025],
];

const RECT = { x: 0.585, y: -1.2075, width: 0.64, height: 1.12 };
const DEPTH = 0.22;

export function LogoIcon3D() {
  const group = useRef<THREE.Group>(null);

  const flagGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(FLAG_POINTS[0][0], FLAG_POINTS[0][1]);
    for (let i = 1; i < FLAG_POINTS.length; i++) {
      shape.lineTo(FLAG_POINTS[i][0], FLAG_POINTS[i][1]);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    });
  }, []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
  });

  return (
    <Float speed={1.3} rotationIntensity={0.35} floatIntensity={0.8}>
      <group ref={group} rotation={[0.15, 0.5, 0]}>
        <mesh geometry={flagGeometry} position={[0, 0, -DEPTH / 2]}>
          <meshStandardMaterial color="#f4600a" roughness={0.35} metalness={0.15} />
        </mesh>
        <mesh position={[RECT.x + RECT.width / 2, RECT.y + RECT.height / 2, 0]}>
          <boxGeometry args={[RECT.width, RECT.height, DEPTH]} />
          <meshStandardMaterial color="#07283b" roughness={0.35} metalness={0.15} />
        </mesh>
      </group>
    </Float>
  );
}
