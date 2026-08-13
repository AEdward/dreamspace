"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type * as THREE from "three";
import { RoomFurniture } from "./roomFurniture";

interface UnitModelProps {
  name: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
}

type RoomType = "bedroom" | "bathroom" | "living" | "hallway";

interface Room {
  x: number;
  y: number;
  w: number;
  h: number;
  type: RoomType;
}

interface WallSeg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** World-space positions along the segment where a doorway is cut in. */
  doors?: number[];
}

interface FloorPlan {
  width: number;
  depth: number;
  rooms: Room[];
  walls: WallSeg[];
}

// Room + wall layouts derived from the actual floor plan renders supplied
// for each unit type — every room opens onto a real hallway that leads to
// a single front door, not directly outside. Room counts (bedrooms,
// bathrooms, one open kitchen+living room) match the site's listed specs;
// exact wall positions are hand-authored to read cleanly, not pixel-traced.
const FLOOR_PLANS: Record<string, FloorPlan> = {
  "1 Bed Room": {
    width: 7.5,
    depth: 7.0,
    rooms: [
      { x: 0, y: 0, w: 2.8, h: 2.4, type: "bathroom" },
      { x: 0, y: 2.4, w: 2.8, h: 4.6, type: "bedroom" },
      { x: 2.8, y: 0, w: 1.2, h: 7.0, type: "hallway" },
      { x: 4.0, y: 0, w: 3.5, h: 7.0, type: "living" },
    ],
    walls: [
      { x1: 0, y1: 0, x2: 7.5, y2: 0, doors: [3.4] },
      { x1: 0, y1: 7.0, x2: 7.5, y2: 7.0 },
      { x1: 0, y1: 0, x2: 0, y2: 7.0 },
      { x1: 7.5, y1: 0, x2: 7.5, y2: 7.0 },
      { x1: 0, y1: 2.4, x2: 2.8, y2: 2.4 },
      { x1: 2.8, y1: 0, x2: 2.8, y2: 7.0, doors: [1.2, 4.7] },
      { x1: 4.0, y1: 0, x2: 4.0, y2: 7.0, doors: [3.5] },
    ],
  },
  "2 Bed Room": {
    width: 9.0,
    depth: 9.0,
    rooms: [
      { x: 0, y: 0, w: 4.0, h: 4.6, type: "bedroom" },
      { x: 0, y: 4.6, w: 4.0, h: 4.4, type: "bedroom" },
      { x: 4.0, y: 5.6, w: 1.4, h: 3.4, type: "bathroom" },
      { x: 4.0, y: 0, w: 1.4, h: 5.6, type: "hallway" },
      { x: 5.4, y: 0, w: 3.6, h: 9.0, type: "living" },
    ],
    walls: [
      { x1: 0, y1: 0, x2: 9.0, y2: 0, doors: [4.7] },
      { x1: 0, y1: 9.0, x2: 9.0, y2: 9.0 },
      { x1: 0, y1: 0, x2: 0, y2: 9.0 },
      { x1: 9.0, y1: 0, x2: 9.0, y2: 9.0 },
      { x1: 0, y1: 4.6, x2: 4.0, y2: 4.6 },
      { x1: 4.0, y1: 0, x2: 4.0, y2: 9.0, doors: [2.3, 6.8] },
      { x1: 4.0, y1: 5.6, x2: 5.4, y2: 5.6, doors: [4.7] },
      { x1: 5.4, y1: 0, x2: 5.4, y2: 9.0, doors: [2.8] },
    ],
  },
  "3 Bed Room": {
    width: 10.5,
    depth: 10.0,
    rooms: [
      { x: 0, y: 0, w: 2.9, h: 2.6, type: "bathroom" },
      { x: 0, y: 2.6, w: 2.9, h: 7.4, type: "bedroom" },
      { x: 2.9, y: 0, w: 1.2, h: 10.0, type: "hallway" },
      { x: 4.1, y: 0, w: 2.5, h: 2.8, type: "bathroom" },
      { x: 4.1, y: 2.8, w: 2.5, h: 3.6, type: "bedroom" },
      { x: 4.1, y: 6.4, w: 2.5, h: 3.6, type: "bedroom" },
      { x: 6.6, y: 0, w: 3.9, h: 10.0, type: "living" },
    ],
    walls: [
      { x1: 0, y1: 0, x2: 10.5, y2: 0, doors: [3.5] },
      { x1: 0, y1: 10.0, x2: 10.5, y2: 10.0 },
      { x1: 0, y1: 0, x2: 0, y2: 10.0 },
      { x1: 10.5, y1: 0, x2: 10.5, y2: 10.0 },
      { x1: 0, y1: 2.6, x2: 2.9, y2: 2.6 },
      { x1: 2.9, y1: 0, x2: 2.9, y2: 10.0, doors: [1.3, 6.3] },
      { x1: 4.1, y1: 0, x2: 4.1, y2: 10.0, doors: [1.4, 4.6, 8.2] },
      { x1: 4.1, y1: 2.8, x2: 6.6, y2: 2.8 },
      { x1: 4.1, y1: 6.4, x2: 6.6, y2: 6.4 },
      { x1: 6.6, y1: 0, x2: 6.6, y2: 10.0, doors: [4.6] },
    ],
  },
};

const FLOOR_COLOR: Record<RoomType, string> = {
  bedroom: "#e3cda3",
  bathroom: "#dcdad2",
  living: "#e6d2ab",
  hallway: "#ece5d6",
};

const WALL_COLOR = "#f2efe6";
const WALL_TOP_COLOR = "#e4ded0";
const WALL_HEIGHT = 1.9;
const WALL_THICKNESS = 0.09;
const DOOR_WIDTH = 0.85;
const DOOR_COLOR = "#c9a876";

function DoorLeaf({ x, z, horizontal }: { x: number; z: number; horizontal: boolean }) {
  // Hinged at one edge of the opening, swung ~50° into the interior.
  const rotationY = horizontal ? -0.9 : 0.9 + Math.PI / 2;
  const hingeOffset = DOOR_WIDTH * 0.86 * 0.5;
  const hx = horizontal ? x - hingeOffset : x;
  const hz = horizontal ? z : z - hingeOffset;
  return (
    <group position={[hx, 0, hz]} rotation={[0, rotationY, 0]}>
      <mesh position={[DOOR_WIDTH * 0.43, WALL_HEIGHT * 0.44, 0]} castShadow>
        <boxGeometry args={[DOOR_WIDTH * 0.86, WALL_HEIGHT * 0.86, 0.035]} />
        <meshStandardMaterial color={DOOR_COLOR} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Wall({ seg }: { seg: WallSeg }) {
  const isHorizontal = seg.y1 === seg.y2;
  const from = isHorizontal ? seg.x1 : seg.y1;
  const to = isHorizontal ? seg.x2 : seg.y2;
  const length = Math.abs(to - from);
  const fixed = isHorizontal ? seg.y1 : seg.x1;
  const doors = (seg.doors ?? []).slice().sort((a, b) => a - b);

  const intervals: { start: number; end: number; isDoor: boolean }[] = [];
  let cursor = 0;
  for (const doorPos of doors) {
    const local = doorPos - from;
    const gapStart = Math.max(0, local - DOOR_WIDTH / 2);
    const gapEnd = Math.min(length, local + DOOR_WIDTH / 2);
    if (gapStart > cursor) intervals.push({ start: cursor, end: gapStart, isDoor: false });
    intervals.push({ start: gapStart, end: gapEnd, isDoor: true });
    cursor = gapEnd;
  }
  if (cursor < length) intervals.push({ start: cursor, end: length, isDoor: false });

  return (
    <>
      {intervals.map((iv, i) => {
        if (iv.isDoor) {
          const center = from + (iv.start + iv.end) / 2;
          return (
            <DoorLeaf
              key={i}
              x={isHorizontal ? center : fixed}
              z={isHorizontal ? fixed : center}
              horizontal={isHorizontal}
            />
          );
        }
        const segLen = iv.end - iv.start;
        if (segLen < 0.05) return null;
        const center = from + (iv.start + iv.end) / 2;
        const pos: [number, number, number] = isHorizontal
          ? [center, WALL_HEIGHT / 2, fixed]
          : [fixed, WALL_HEIGHT / 2, center];
        const size: [number, number, number] = isHorizontal
          ? [segLen, WALL_HEIGHT, WALL_THICKNESS]
          : [WALL_THICKNESS, WALL_HEIGHT, segLen];
        const capPos: [number, number, number] = [pos[0], WALL_HEIGHT + 0.02, pos[2]];
        const capSize: [number, number, number] = isHorizontal
          ? [segLen, 0.05, WALL_THICKNESS + 0.02]
          : [WALL_THICKNESS + 0.02, 0.05, segLen];
        return (
          <group key={i}>
            <mesh position={pos} castShadow receiveShadow>
              <boxGeometry args={size} />
              <meshStandardMaterial color={WALL_COLOR} roughness={0.5} />
            </mesh>
            <mesh position={capPos} castShadow>
              <boxGeometry args={capSize} />
              <meshStandardMaterial color={WALL_TOP_COLOR} roughness={0.45} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function RoomFloorAndFurniture({ room }: { room: Room }) {
  const { w, h: d, type } = room;
  return (
    <group position={[room.x, 0, room.y]}>
      <mesh position={[w / 2, 0.02, d / 2]} receiveShadow>
        <boxGeometry args={[w * 0.98, 0.04, d * 0.98]} />
        <meshStandardMaterial color={FLOOR_COLOR[type]} roughness={0.7} />
      </mesh>
      {type !== "hallway" && <RoomFurniture type={type} w={w} d={d} />}
    </group>
  );
}

/**
 * There's no real CAD/3D scan data for the actual buildings, so this
 * reconstructs a furnished architectural "dollhouse" model from the 2D
 * floor plan renders supplied for each unit type: real rooms connected by
 * an actual hallway to a single front door, full-height walls with door
 * openings (swung door leaves, not just gaps), and low-poly furniture in
 * the same warm neutral palette as those renders — no roof, so the layout
 * reads clearly from above. Falls back to a plain grid of rooms (no
 * hallway) if a unit's name doesn't match a known floor plan.
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
    }));
    for (let i = 0; i < Math.max(bathrooms, 1); i++) {
      rooms.push({ x: side + 0.15, y: i * 2, w: 1.6, h: 1.8, type: "bathroom" });
    }
    const width = side + 1.9;
    const depth = side;
    const walls: WallSeg[] = [
      { x1: 0, y1: 0, x2: width, y2: 0 },
      { x1: 0, y1: depth, x2: width, y2: depth },
      { x1: 0, y1: 0, x2: 0, y2: depth },
      { x1: width, y1: 0, x2: width, y2: depth },
    ];
    return { width, depth, rooms, walls };
  }, [name, sqm, bedrooms, bathrooms]);

  const scale = 2.6 / Math.max(plan.width, plan.depth);
  const offsetX = -plan.width / 2;
  const offsetZ = -plan.depth / 2;
  const padding = Math.max(plan.width, plan.depth) * 0.22;

  return (
    <group ref={group} scale={[scale, scale, scale]}>
      <group position={[offsetX, 0, offsetZ]}>
        <mesh position={[plan.width / 2, -0.06, plan.depth / 2]} receiveShadow>
          <boxGeometry args={[plan.width + padding, 0.1, plan.depth + padding]} />
          <meshStandardMaterial color="#f4f5f3" roughness={0.85} />
        </mesh>
        <ContactShadows
          position={[plan.width / 2, -0.005, plan.depth / 2]}
          opacity={0.35}
          scale={Math.max(plan.width, plan.depth) + padding}
          blur={2.2}
          far={2.5}
          color="#5a5348"
        />
        {plan.rooms.map((room, i) => (
          <RoomFloorAndFurniture key={i} room={room} />
        ))}
        {plan.walls.map((seg, i) => (
          <Wall key={i} seg={seg} />
        ))}
      </group>
    </group>
  );
}

export function UnitModel(props: UnitModelProps) {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.5]}
      camera={{ position: [1.9, 4.6, 2.1], fov: 32 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[4, 7, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0015}
      />
      <pointLight position={[-3, 2, -2]} intensity={0.25} color="#f4600a" />
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
