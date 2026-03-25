import { Canvas, useFrame } from "@react-three/fiber";
import {
  Image,
  Text,
  Environment,
  useCursor,
  RoundedBox,
} from "@react-three/drei";
import { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

const CARDS = [
  {
    id: 1,
    title: "Sophie Watzfeld",
    role: "Artist",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Farouk Alao",
    role: "Artist",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Teona Toderel",
    role: "Artist",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Erin J Coholan",
    role: "Artist",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Generic Artist",
    role: "Artist",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Another One",
    role: "Artist",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "And Another",
    role: "Artist",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Last One",
    role: "Artist",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
  },
];

function Card({
  url,
  title,
  role,
  index,
  count,
  radius,
  setHovered,
  onSelect,
}) {
  const ref = useRef();

  // Calculate position in the circle
  const theta = (index / count) * Math.PI * 2;
  const x = Math.sin(theta) * radius;
  const z = Math.cos(theta) * radius;
  const rotationY = theta;

  const [localHovered, setLocalHovered] = useState(false);
  useCursor(localHovered);

  useFrame((state) => {
    if (ref.current) {
      // Get world position to determine depth
      const worldPos = new THREE.Vector3();
      ref.current.getWorldPosition(worldPos);

      // Normalize Z (typically -1.6 to +1.6 based on radius)
      // Adjust these values based on actual scene scale
      const z = worldPos.z;

      // Z is roughly radius * cos(theta). Front is +Z.
      // Map Z to Opacity.
      // Logic: Front (High Z) = Dark/Opaque (~0.9)
      // Back (Low Z) = Dim/Transparent (~0.2)

      // Clamp and Lerp
      const minZ = -radius;
      const maxZ = radius;
      const normalized = THREE.MathUtils.clamp(
        (z - minZ) / (maxZ - minZ),
        0,
        1,
      );

      // Easing for smoother transition
      const opacity = THREE.MathUtils.lerp(0.1, 0.85, normalized * normalized);

      // Update materials
      if (ref.current.material) {
        ref.current.material.opacity = opacity;
        ref.current.material.transparent = true;
      }

      // Optional: Scale effect based on Z
      const scale = THREE.MathUtils.lerp(0.8, 1.0, normalized);
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <RoundedBox
        ref={ref}
        args={[1.15, 1.6, 0.1]} // Width, Height, Depth
        radius={0.05} // Rounded corners
        smoothness={4}
        onPointerOver={() => {
          setHovered(true);
          setLocalHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setLocalHovered(false);
        }}
        onClick={() => onSelect(index)}
      >
        <meshStandardMaterial
          color="black"
          roughness={0.2}
          metalness={0.5}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </RoundedBox>

      <Text
        position={[-0.42, 0.6, 0.06]} // Sit on surface (0.05 + small offset)
        color="white"
        fontSize={0.1}
        anchorX="left"
        anchorY="top"
      >
        {title}
      </Text>
      <Text
        position={[-0.42, 0.45, 0.06]}
        color="white"
        fontSize={0.06}
        anchorX="left"
        anchorY="top"
        fillOpacity={0.7}
      >
        {role}
      </Text>
    </group>
  );
}

function Rig({ radius = 4, count = 6, children, isPaused }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (!isPaused && group.current) {
      group.current.rotation.y += delta * 0.5; // Faster uniform speed
    }
  });

  return <group ref={group}>{children}</group>;
}

export default function Carousel3D({ className }) {
  const [hovered, setHovered] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedItem = CARDS.find((item) => item.id === selectedId);

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {/* 3D Scene */}
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 12 : 8],
          fov: isMobile ? 45 : 35,
        }}
      >
        <ambientLight intensity={1.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
        />
        <pointLight position={[-10, -10, -10]} intensity={1} />

        <Suspense fallback={null}>
          <group
            position={[-0.05, -0.1, 0]}
            rotation={[0, 0, 0.55]}
            scale={isMobile ? 0.45 : isTablet ? 0.65 : 1}
          >
            <Rig
              radius={2} // Tighter radius
              count={CARDS.length}
              isPaused={!!selectedId || hovered}
            >
              {CARDS.map((card, i) => (
                <Card
                  key={card.id}
                  index={i}
                  count={CARDS.length}
                  radius={1.85} // Match Rig radius
                  url={card.image}
                  title={card.title}
                  role={card.role}
                  setHovered={setHovered}
                  onSelect={(idx) => setSelectedId(card.id)}
                />
              ))}
            </Rig>
          </group>

          {/* Environment removed for debugging */}
        </Suspense>
      </Canvas>

      {/* Overlay for Selected Card */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center p-8 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedId(null)} // Click outside to close
          >
            <motion.div
              className="bg-black text-white p-8 rounded-xl max-w-md w-full shadow-2xl border border-gray-800"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card content
            >
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-3xl font-bold mb-2">{selectedItem.title}</h2>
              <p className="text-gray-400 mb-4">{selectedItem.role}</p>
              <p className="text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <button
                className="mt-6 px-4 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
                onClick={() => setSelectedId(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title Overlay */}
    </div>
  );
}
