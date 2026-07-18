import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import type { Group } from "three";

/** react-three-fiber's own container measurement goes stale on first mount
 *  here — the canvas locks in the browser's 300×150 default and only
 *  self-corrects on a later resize event. Proven fix, verified directly:
 *  dispatching a real `resize` event on `window` makes react-three-fiber's
 *  internal ResizeObserver re-measure and correct itself immediately. A
 *  manual `gl.setSize` read at mount time (even deferred a frame) reads the
 *  same stale 300×150 — this isn't a timing race that a frame delay fixes,
 *  the container genuinely hasn't been measured correctly yet. Dispatching
 *  resize on mount (plus once more after fonts finish loading, in case a
 *  late font swap reflows the hero) is the mechanism that's actually been
 *  confirmed to work. */
function ResizeFix() {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    document.fonts?.ready?.then(fire).catch(() => {});
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}

/** An open tome, hinged at a center spine: covers and pages both fan outward
 *  by rotating around the spine axis (x=0), not by being offset-and-rotated
 *  independently — that's what the previous version got wrong. It had two
 *  full-width (2.2 unit) cover boxes overlapping each other (the "front"
 *  cover sat at x=1.05 but kept its full width, so it spanned from -0.05 to
 *  2.15) plus three separate, overlapping page stacks (a centered width-2
 *  stack plus a left and a right width-1 stack, all covering the same
 *  region). Every mesh here fans from the same spine instead. */

const COVER_COLOR_L = "#3B2A20";
const COVER_COLOR_R = "#4A3828";
const QUILL_RED = "#A63446";
const QUILL_SHAFT = "#d4a574";

function BookCover({ side, angle }: { side: -1 | 1; angle: number }) {
  const w = 1.15, h = 1.6, d = 0.05;
  return (
    <group rotation={[0, side * angle, 0]}>
      <mesh position={[side * (w / 2), 0, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={side < 0 ? COVER_COLOR_L : COVER_COLOR_R} roughness={0.8} metalness={0.25} />
      </mesh>
    </group>
  );
}

function Pages() {
  const pages = useMemo(() => {
    const colors = ["#f5e6c8", "#efe0b8", "#e8d9a8", "#e2d29a", "#dccb8c", "#e8d9a8", "#f5e6c8"];
    return colors.map((color, i) => ({
      color,
      angle: (i / (colors.length - 1) - 0.5) * 0.82,
      y: i * 0.006,
    }));
  }, []);
  const w = 1.0, h = 1.55, d = 0.01;

  return (
    <>
      {pages.map((p, i) => (
        <mesh key={i} position={[0, p.y, 0]} rotation={[0, p.angle, 0]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={p.color} roughness={0.65} metalness={0.05} />
        </mesh>
      ))}
    </>
  );
}

function FloatingQuill() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
  });

  return (
    <group ref={ref} position={[1.35, 0.5, 0.15]}>
      <mesh position={[0, 0.34, 0]} rotation={[0.2, 0.3, -0.3]}>
        <coneGeometry args={[0.03, 0.42, 6]} />
        <meshStandardMaterial color={QUILL_RED} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[0.2, 0.3, -0.3]}>
        <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
        <meshStandardMaterial color={QUILL_SHAFT} roughness={0.6} />
      </mesh>
    </group>
  );
}

function TomeScene() {
  return (
    <group rotation={[0.35, 0, 0]}>
      {/* Spine */}
      <mesh castShadow>
        <boxGeometry args={[0.08, 1.62, 0.2]} />
        <meshStandardMaterial color="#2A1A0E" roughness={0.7} />
      </mesh>

      <BookCover side={-1} angle={0.5} />
      <BookCover side={1} angle={0.5} />
      <Pages />
      <FloatingQuill />

      <Sparkles count={40} scale={[2.6, 2.2, 1.8]} size={0.05} speed={0.4} color={QUILL_RED} />
    </group>
  );
}

export default function Tome() {
  return (
    <Canvas camera={{ position: [0, 0.3, 5.2], fov: 34 }} dpr={[1, 2]}>
      <ResizeFix />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
      <directionalLight position={[-2, 1, -1]} intensity={0.3} color={QUILL_RED} />
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.25}>
        <TomeScene />
      </Float>
    </Canvas>
  );
}
