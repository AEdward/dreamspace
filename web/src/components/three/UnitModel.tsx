"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import type * as THREE from "three";
import { RoomFurniture } from "./roomFurniture";

interface UnitModelProps {
  name: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
}

type RoomType = "bedroom" | "bathroom" | "living";

interface Room {
  x: number;
  y: number;
  w: number;
  h: number;
  type: RoomType;
  /** Which local wall gets a doorway gap: "south" (near z=0) or "west" (near x=0). */
  door?: "south" | "west";
}

interface FloorPlan {
  width: number;
  depth: number;
  rooms: Room[];
}

// Room layouts derived from the actual floor plan renders provided for each
// unit type — proportions and room counts match those images (and this
// site's bedroom/bathroom counts), not pixel-exact wall tracing. Values are
// in meters.
const FLOOR_PLANS: Record<string, FloorPlan> = {
  "1 Bed Room": {
    width: 7.5,
    depth: 7.0,
    rooms: [
      { x: 0, y: 3.0, w: 2.8, h: 4.0, type: "bedroom", door: "south" },
      { x: 2.8, y: 4.6, w: 1.4, h: 2.4, type: "bathroom", door: "west" },
      { x: 4.2, y: 0, w: 3.3, h: 7.0, type: "living", door: "west" },
    ],
  },
  "2 Bed Room": {
    width: 9.0,
    depth: 9.0,
    rooms: [
      { x: 0, y: 4.6, w: 4.0, h: 4.4, type: "bedroom", door: "south" },
      { x: 0, y: 0, w: 4.0, h: 4.6, type: "bedroom", door: "west" },
      { x: 4.0, y: 5.6, w: 1.4, h: 3.4, type: "bathroom", door: "south" },
      { x: 5.4, y: 0, w: 3.6, h: 9.0, type: "living", door: "west" },
    ],
  },
  "3 Bed Room": {
    width: 10.5,
    depth: 10.0,
    rooms: [
      { x: 0, y: 5.2, w: 3.2, h: 4.8, type: "bedroom", door: "south" },
      { x: 3.2, y: 5.2, w: 3.4, h: 4.8, type: "bedroom", door: "south" },
      { x: 2.0, y: 0, w: 2.4, h: 5.2, type: "bedroom", door: "west" },
      { x: 0, y: 0, w: 2.0, h: 5.2, type: "bathroom", door: "west" },
      { x: 4.4, y: 0, w: 2.2, h: 5.2, type: "bathroom", door: "west" },
      { x: 6.6, y: 0, w: 3.9, h: 10.0, type: "living", door: "west" },
    ],
  },
};

const FLOOR_COLOR: Record<RoomType, string> = {
  bedroom: "#e3cda3",
  bathroom: "#dcdad2",
  living: "#e6d2ab",
};

const WALL_COLOR = "#f2efe6";
const WALL_TOP_COLOR = "#e4ded0";
const WALL_HEIGHT = 1.9;
const WALL_THICKNESS = 0.09;
const DOOR_WIDTH = 0.95;

function Wall({ start, end, gapCenter }: { start: [number, number]; end: [number, number]; gapCenter?: number }) {
  const isHorizontal = start[1] === end[1];
  const length = isHorizontal ? Math.abs(end[0] - start[0]) : Math.abs(end[1] - start[1]);
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[1] + end[1]) / 2;

  const segments: { center: number; len: number }[] = [];
  if (gapCenter !== undefined && length > DOOR_WIDTH + 0.6) {
    const from = isHorizontal ? start[0] : start[1];
    const localGapCenter = gapCenter - from;
    const gapStart = Math.max(0.15, localGapCenter - DOOR_WIDTH / 2);
    const gapEnd = Math.min(length - 0.15, localGapCenter + DOOR_WIDTH / 2);
    if (gapEnd > gapStart) {
      if (gapStart > 0.1) segments.push({ center: gapStart / 2, len: gapStart });
      if (length - gapEnd > 0.1) segments.push({ center: gapEnd + (length - gapEnd) / 2, len: length - gapEnd });
    } else {
      segments.push({ center: length / 2, len: length });
    }
  } else {
    segments.push({ center: length / 2, len: length });
  }

  return (
    <>
      {segments.map((seg, i) => {
        const from = isHorizontal ? start[0] : start[1];
        const t = from + seg.center;
        const pos: [number, number, number] = isHorizontal
          ? [t, WALL_HEIGHT / 2, midZ]
          : [midX, WALL_HEIGHT / 2, t];
        const size: [number, number, number] = isHorizontal
          ? [seg.len, WALL_HEIGHT, WALL_THICKNESS]
          : [WALL_THICKNESS, WALL_HEIGHT, seg.len];
        const capPos: [number, number, number] = [pos[0], WALL_HEIGHT + 0.02, pos[2]];
        const capSize: [number, number, number] = isHorizontal
          ? [seg.len, 0.05, WALL_THICKNESS + 0.02]
          : [WALL_THICKNESS + 0.02, 0.05, seg.len];
        return (
          <group key={i}>
            <mesh position={pos}>
              <boxGeometry args={size} />
              <meshStandardMaterial color={WALL_COLOR} roughness={0.55} />
            </mesh>
            <mesh position={capPos}>
              <boxGeometry args={capSize} />
              <meshStandardMaterial color={WALL_TOP_COLOR} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function RoomBox({ room }: { room: Room }) {
  const { w, h: d, type } = room;
  const southGap = room.door === "south" ? w / 2 : undefined;
  const westGap = room.door === "west" ? d / 2 : undefined;

  return (
    <group position={[room.x, 0, room.y]}>
      <mesh position={[w / 2, 0.02, d / 2]}>
        <boxGeometry args={[w * 0.98, 0.04, d * 0.98]} />
        <meshStandardMaterial color={FLOOR_COLOR[type]} roughness={0.75} />
      </mesh>
      <Wall start={[0, 0]} end={[w, 0]} gapCenter={southGap} />
      <Wall start={[0, d]} end={[w, d]} />
      <Wall start={[0, 0]} end={[0, d]} gapCenter={westGap} />
      <Wall start={[w, 0]} end={[w, d]} />
      <RoomFurniture type={type} w={w} d={d} />
    </group>
  );
}

/**
 * There's no real CAD/3D scan data for the actual buildings, so this
 * reconstructs a furnished architectural "dollhouse" model from the 2D
 * floor plan renders supplied for each unit type: real room shapes and
 * positions, full-height walls with doorway cutouts, and low-poly
 * furniture (bed, sofa, dining set, kitchen counter, bathroom fixtures) in
 * the same warm neutral palette as those renders — no roof, so the layout
 * reads clearly from above. Falls back to a plain grid of rooms if a
 * unit's name doesn't match a known floor plan.
 */
function Massing({ name, sqm, bedrooms, bathrooms }: UnitModelProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  const plan = useMemo<FloorPlan>(() => {
    if (FLOOR_PLANS[name]) return FLOOR_PLANS[name];
    const side = 3 + Math.min(sqm / 20, 5);
    const cols = Math.ceil(Math.sqrt(Math.max(bedrooms, 1)));
    const cell = side / cols;
    const rooms: Room[] = Array.from({ length: Math.max(bedrooms, 1) }, (_, i) => ({
      x: (i % cols) * cell,
      y: Math.floor(i / cols) * cell,
      w: cell * 0.92,
      h: cell * 0.92,
      type: "bedroom" as const,
      door: "south" as const,
    }));
    for (let i = 0; i < Math.max(bathrooms, 1); i++) {
      rooms.push({ x: side + 0.15, y: i * 2, w: 1.6, h: 1.8, type: "bathroom", door: "west" });
    }
    return { width: side + 1.9, depth: side, rooms };
  }, [name, sqm, bedrooms, bathrooms]);

  const scale = 2.6 / Math.max(plan.width, plan.depth);
  const offsetX = -plan.width / 2;
  const offsetZ = -plan.depth / 2;
  const padding = Math.max(plan.width, plan.depth) * 0.22;

  return (
    <group ref={group} scale={[scale, scale, scale]}>
      <group position={[offsetX, 0, offsetZ]}>
        <mesh position={[plan.width / 2, -0.06, plan.depth / 2]}>
          <boxGeometry args={[plan.width + padding, 0.1, plan.depth + padding]} />
          <meshStandardMaterial color="#eef1f4" roughness={0.9} />
        </mesh>
        <Grid
          position={[plan.width / 2, -0.005, plan.depth / 2]}
          args={[plan.width + padding, plan.depth + padding]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#c7cdd4"
          sectionSize={0}
          fadeDistance={30}
          fadeStrength={0}
          infiniteGrid={false}
        />
        {plan.rooms.map((room, i) => (
          <RoomBox key={i} room={room} />
        ))}
      </group>
    </group>
  );
}

export function UnitModel(props: UnitModelProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [1.9, 4.6, 2.1], fov: 32 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 7, 4]} intensity={1.3} />
      <pointLight position={[-3, 2, -2]} intensity={0.2} color="#f4600a" />
      <Massing {...props} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.6}
      />
    </Canvas>
  );
}
