import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import type { Group, Mesh } from "three";

/** react-three-fiber's own container measurement goes stale on first mount
 *  here — the canvas locks in the browser's 300×150 default and only
 *  self-corrects on a later resize event. Proven fix, verified directly:
 *  dispatching a real `resize` event on `window` makes react-three-fiber's
 *  internal ResizeObserver re-measure and correct itself immediately. A
 *  manual `gl.setSize` read at mount time (even deferred a frame) reads the
 *  same stale 300×150 — this isn't a timing race that a frame delay fixes,
 *  the container genuinely hasn't been measured correctly yet.
 *
 *  Dispatching resize on mount (plus once more after fonts finish loading, in
 *  case a late font swap reflows the hero) is the mechanism that's actually
 *  been confirmed to work.
 *
 *  Do not "harden" this with extra timers or a size-comparison poll. That was
 *  tried on 2026-07-29 against a headless, non-compositing browser pane where
 *  the canvas appeared stuck at 300×150, and every variant seemed to fail. The
 *  real explanation was that in a tab which never composites, animation frames
 *  never run, so r3f never starts its loop and never mounts this component at
 *  all — the effect below was firing zero times. The canvas is only mis-sized
 *  in exactly the situation where nothing is being drawn for anyone to see. */
function ResizeFix() {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    document.fonts?.ready?.then(fire).catch(() => {});
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}

/** Chiron's identity anchor: an armillary sphere pierced by the centaur's
 *  arrow. It replaces the previous 3D tome (2026-07-29 review), which read as
 *  cardboard — a convincing book needs leather, page thickness and contact
 *  shadow to carry it, whereas pure revolved geometry reads as a machined
 *  instrument almost for free. Same reasoning as the 2D mark: the arrow is the
 *  armillary's polar axis, so the bow and the instrument are one object. */

const METAL = "#2A3340";      // brushed iron, cool like the ink
const METAL_LIGHT = "#43505F";
const RUBRIC = "#D64545";

/** Ring speeds are mutually irrational-ish (no small common multiple), so the
 *  three rings never resynchronise into a visible repeating pose. Equal or
 *  harmonically related speeds make the whole thing look like one rigid body
 *  spinning, which defeats the point of an armillary. */
const SPEEDS = [0.17, 0.23, 0.31] as const;

function Ring({
  radius,
  tube,
  rotation,
  speed,
  axis,
  color,
}: {
  radius: number;
  tube: number;
  rotation: [number, number, number];
  speed: number;
  axis: "x" | "y" | "z";
  color: string;
}) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation[axis] += delta * speed;
  });
  return (
    <mesh ref={ref} rotation={rotation} castShadow>
      <torusGeometry args={[radius, tube, 20, 128]} />
      <meshStandardMaterial color={color} roughness={0.32} metalness={0.92} />
    </mesh>
  );
}

/** The polar axis: shaft, head and fletching. Static relative to the rings —
 *  it is the thing they turn around, so giving it its own spin would read as
 *  three unrelated objects rather than one instrument. */
function Arrow() {
  return (
    <group rotation={[0, 0, 0.32]}>
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 4.6, 16]} />
        <meshStandardMaterial color={METAL_LIGHT} roughness={0.4} metalness={0.85} />
      </mesh>
      {/* head */}
      <mesh position={[0, 2.42, 0]}>
        <coneGeometry args={[0.16, 0.62, 20]} />
        <meshStandardMaterial color={RUBRIC} roughness={0.25} metalness={0.5} emissive={RUBRIC} emissiveIntensity={0.35} />
      </mesh>
      {/* fletching — three vanes around the shaft */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -2.05, 0]} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <boxGeometry args={[0.34, 0.5, 0.012]} />
          <meshStandardMaterial color={RUBRIC} roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/** Emissive nodes where the rings' planes intersect — the detail that sells
 *  the object as an instrument with readings on it rather than three hoops. */
function Nodes() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.12;
    ref.current.scale.setScalar(pulse);
  });
  const positions: [number, number, number][] = [
    [1.95, 0, 0],
    [-1.95, 0, 0],
    [0, 1.62, 0.35],
    [0, -1.62, -0.35],
  ];
  return (
    <group ref={ref}>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color={RUBRIC} emissive={RUBRIC} emissiveIntensity={1.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function ArmillaryScene() {
  return (
    <group rotation={[0.28, 0, 0]}>
      <Ring radius={1.95} tube={0.045} rotation={[Math.PI / 2, 0, 0]} speed={SPEEDS[0]} axis="z" color={METAL} />
      <Ring radius={1.62} tube={0.04} rotation={[0, 0, 0.32]} speed={SPEEDS[1]} axis="y" color={METAL_LIGHT} />
      <Ring radius={1.28} tube={0.035} rotation={[0.9, 0.4, 0]} speed={SPEEDS[2]} axis="x" color={METAL} />
      <Arrow />
      <Nodes />
      <Sparkles count={44} scale={[3.4, 3.0, 2.4]} size={0.05} speed={0.35} color={RUBRIC} />
    </group>
  );
}

export default function Armillary() {
  return (
    <Canvas camera={{ position: [0, 0.4, 6.4], fov: 34 }} dpr={[1, 2]}>
      <ResizeFix />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-3, 1, -2]} intensity={0.45} color={RUBRIC} />
      <pointLight position={[0, 0, 0]} intensity={0.6} color={RUBRIC} distance={4} />
      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.3}>
        <ArmillaryScene />
      </Float>
    </Canvas>
  );
}
