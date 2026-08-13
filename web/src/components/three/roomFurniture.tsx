"use client";

// Procedural low-poly furniture, positioned in room-local meters (origin at
// the room's near corner, x/z spanning its width/depth). Colors match the
// warm neutral palette of the reference floor plan renders — no navy/orange.

const WOOD = "#c9a876";
const WOOD_DARK = "#a9835a";
const LINEN = "#f2ead9";
const LINEN_DARK = "#d9c9a8";
const SOFA = "#e6dcc8";
const FIXTURE = "#f0efe9";
const METAL = "#9a9488";
const COUNTER = "#8f8477";

function Box({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
    </mesh>
  );
}

function Cyl({ position, radius, height, color }: { position: [number, number, number]; radius: number; height: number; color: string }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius, radius, height, 20]} />
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
    </mesh>
  );
}

function BedroomFurniture({ w, d }: { w: number; d: number }) {
  const bedW = Math.min(w * 0.72, 1.5);
  const bedD = Math.min(d * 0.42, 2.0);
  const cx = w / 2;
  const cz = d - bedD / 2 - 0.12;
  const wardrobeW = Math.min(w * 0.3, 0.85);

  return (
    <group>
      <Box position={[cx, 0.22, cz]} size={[bedW, 0.34, bedD]} color={LINEN} />
      <Box position={[cx, 0.42, cz - bedD / 2 + 0.16]} size={[bedW * 0.9, 0.14, bedD * 0.28]} color="#ffffff" />
      <Box position={[cx, 0.5, cz + bedD / 2 - 0.03]} size={[bedW, 0.6, 0.06]} color={LINEN_DARK} />
      <Box position={[cx - bedW / 2 - 0.22, 0.2, cz + bedD / 2 - 0.25]} size={[0.36, 0.4, 0.36]} color={WOOD} />
      <Box position={[w - wardrobeW / 2 - 0.08, 0.4, 0.3]} size={[wardrobeW, 0.8, 0.48]} color={WOOD_DARK} />
    </group>
  );
}

function BathroomFurniture({ w, d }: { w: number; d: number }) {
  const hasTub = w >= 1.9 && d >= 4.4;
  return (
    <group>
      <Cyl position={[w - 0.32, 0.18, d - 0.32]} radius={0.22} height={0.36} color={FIXTURE} />
      <Box position={[w - 0.32, 0.42, d - 0.5]} size={[0.34, 0.32, 0.16]} color={FIXTURE} />
      <Box position={[0.3, 0.35, d - 0.25]} size={[0.5, 0.14, 0.4]} color={FIXTURE} />
      <Cyl position={[0.3, 0.44, d - 0.25]} radius={0.14} height={0.06} color={METAL} />
      {hasTub && <Box position={[0.42, 0.22, d / 2]} size={[0.7, 0.42, Math.min(d * 0.55, 1.7)]} color={FIXTURE} />}
    </group>
  );
}

function LivingFurniture({ w, d }: { w: number; d: number }) {
  const kitchenDepth = Math.min(d * 0.28, 2.4);
  const diningZ = kitchenDepth + Math.min(d * 0.22, 1.8);
  const sofaZ = d - Math.min(d * 0.22, 1.6);
  const counterLen = Math.min(w * 0.85, 2.6);
  const sofaLen = Math.min(w * 0.78, 2.1);
  const chairOffsets: [number, number][] = [
    [-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55],
  ];

  return (
    <group>
      {/* kitchen counter (far wall) */}
      <Box position={[w / 2, 0.42, 0.28]} size={[counterLen, 0.84, 0.5]} color={COUNTER} />
      <Box position={[w / 2, 0.86, 0.28]} size={[counterLen * 0.96, 0.05, 0.46]} color="#ffffff" />
      <Cyl position={[w / 2 - counterLen / 4, 0.9, 0.28]} radius={0.09} height={0.02} color={METAL} />
      <Cyl position={[w / 2 + counterLen / 4, 0.9, 0.28]} radius={0.09} height={0.02} color={METAL} />

      {/* dining set (middle) */}
      <Cyl position={[w / 2, 0.38, diningZ]} radius={0.06} height={0.76} color={WOOD} />
      <Cyl position={[w / 2, 0.78, diningZ]} radius={0.58} height={0.05} color={WOOD} />
      {chairOffsets.map(([ox, oz], i) => (
        <Box key={i} position={[w / 2 + ox, 0.24, diningZ + oz]} size={[0.36, 0.48, 0.36]} color={WOOD_DARK} />
      ))}

      {/* sofa + coffee table (near entrance) */}
      <Box position={[w / 2, 0.2, sofaZ]} size={[sofaLen, 0.38, 0.8]} color={SOFA} />
      <Box position={[w / 2, 0.5, sofaZ + 0.34]} size={[sofaLen, 0.42, 0.14]} color={SOFA} />
      <Box position={[w / 2, 0.18, sofaZ - 0.6]} size={[sofaLen * 0.5, 0.14, 0.5]} color={WOOD} />
    </group>
  );
}

export function RoomFurniture({ type, w, d }: { type: "bedroom" | "bathroom" | "living"; w: number; d: number }) {
  if (type === "bedroom") return <BedroomFurniture w={w} d={d} />;
  if (type === "bathroom") return <BathroomFurniture w={w} d={d} />;
  return <LivingFurniture w={w} d={d} />;
}
