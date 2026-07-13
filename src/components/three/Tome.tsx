import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Text3D, Center, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";

function BookPage({ position, rotation, color, width = 2, height = 2.8, depth = 0.04 }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  width?: number;
  height?: number;
  depth?: number;
}) {
  const ref = useRef<Mesh>(null);
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

function BookCover({ position, rotation, color }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[2.2, 3, 0.08]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.3} />
    </mesh>
  );
}

function FloatingQuill() {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
  });

  return (
    <group ref={ref as any} position={[1.8, 0.5, 0]}>
      <mesh position={[0, 0.6, 0]} rotation={[0.2, 0.3, -0.3]}>
        <coneGeometry args={[0.04, 0.6, 6]} />
        <meshStandardMaterial color="#A63446" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.1, 0]} rotation={[0.2, 0.3, -0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 6]} />
        <meshStandardMaterial color="#d4a574" roughness={0.6} />
      </mesh>
    </group>
  );
}

function TomeScene() {
  const pageColors = useMemo(() => ["#f5e6c8", "#efe0b8", "#e8d9a8", "#e2d29a", "#dccb8c"], []);
  const spread = 0.08;

  return (
    <group>
      {/* Back cover */}
      <BookCover position={[0, 0, -0.04]} rotation={[0, 0, 0]} color="#3B2A20" />

      {/* Pages — slightly offset to show the book opening */}
      {pageColors.map((color, i) => (
        <BookPage
          key={i}
          position={[0, 0, spread * i]}
          rotation={[0, 0, 0]}
          color={color}
        />
      ))}

      {/* Left half of open pages */}
      {pageColors.map((color, i) => (
        <BookPage
          key={`left-${i}`}
          position={[-1.05 + spread * i * 0.3, 0, spread * i]}
          rotation={[0, -0.3 + i * 0.02, 0.02]}
          color={color}
          width={1}
        />
      ))}

      {/* Right half of open pages */}
      {pageColors.map((color, i) => (
        <BookPage
          key={`right-${i}`}
          position={[1.05 - spread * i * 0.3, 0, spread * i]}
          rotation={[0, 0.3 - i * 0.02, -0.02]}
          color={color}
          width={1}
        />
      ))}

      {/* Front cover (right side) */}
      <BookCover
        position={[1.05, 0, 0.3]}
        rotation={[0, 0.3, 0]}
        color="#4A3828"
      />

      {/* Spine */}
      <mesh position={[0, 0, -0.08]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 3, 0.3]} />
        <meshStandardMaterial color="#2A1A0E" roughness={0.7} />
      </mesh>

      {/* Floating quill */}
      <FloatingQuill />

      {/* Sparkle particles */}
      <Sparkles count={50} scale={4} size={0.05} speed={0.4} color="#A63446" />
    </group>
  );
}

export default function Tome() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0.5, 5], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 3, 4]} intensity={0.8} />
        <directionalLight position={[-2, 1, -1]} intensity={0.3} color="#A63446" />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <TomeScene />
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
