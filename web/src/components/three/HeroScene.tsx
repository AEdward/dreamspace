"use client";

import { Canvas } from "@react-three/fiber";
import { LogoIcon3D } from "./LogoIcon3D";

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.6], fov: 38 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.6} />
      <pointLight position={[-4, -1.5, 2]} intensity={0.5} color="#f4600a" />
      <LogoIcon3D />
    </Canvas>
  );
}
