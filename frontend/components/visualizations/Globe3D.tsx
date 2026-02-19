'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Supply route data (sample cities)
const cities = [
  { name: 'Shanghai', lat: 31.23, lon: 121.47 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
  { name: 'Hamburg', lat: 53.55, lon: 9.99 },
  { name: 'Singapore', lat: 1.35, lon: 103.82 },
  { name: 'Dubai', lat: 25.20, lon: 55.27 },
  { name: 'Mumbai', lat: 19.08, lon: 72.88 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69 },
];

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Cinematic Dotted Globe
function DottedGlobe() {
  const globeRef = useRef<THREE.Group>(null);
  const dotsRef = useRef<THREE.Points>(null);

  // Generate dots for the globe surface
  const points = useMemo(() => {
    const pts = [];
    const radius = 2;
    const count = 4000;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      pts.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Surface Points (The Digital Look) */}
      <points ref={dotsRef} geometry={points}>
        <pointsMaterial
          color="#E63946"
          size={0.015}
          transparent
          opacity={0.4}
          sizeAttenuation={true}
        />
      </points>

      {/* Internal Glow Core */}
      <Sphere args={[1.9, 32, 32]}>
        <meshBasicMaterial color="#E63946" transparent opacity={0.05} />
      </Sphere>

      {/* Grid Wireframe (Subtle) */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial
          color="#E63946"
          wireframe
          transparent
          opacity={0.03}
        />
      </Sphere>

      {/* Atmospheric Halo */}
      <Sphere args={[2.5, 32, 32]}>
        <meshBasicMaterial
          color="#E63946"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </Sphere>

      <CityMarkers />
      <SupplyRoutes />
    </group>
  );
}

// Pulsing City Markers
function CityMarkers() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const s = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      groupRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef}>
      {cities.map((city, index) => {
        const pos = latLonToVector3(city.lat, city.lon, 2);
        return (
          <group key={index} position={pos}>
            <mesh>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial
                color="#E63946"
                emissive="#E63946"
                emissiveIntensity={4}
              />
            </mesh>
            {/* Outer Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.05, 0.07, 32]} />
              <meshBasicMaterial color="#E63946" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Animated Supply Route Arcs
function SupplyRoutes() {
  const routes = useMemo(() => {
    const pairs: [typeof cities[0], typeof cities[0]][] = [
      [cities[0], cities[1]], // Shanghai to LA
      [cities[1], cities[2]], // LA to Hamburg
      [cities[3], cities[5]], // Singapore to Mumbai
      [cities[4], cities[2]], // Dubai to Hamburg
      [cities[0], cities[3]], // Shanghai to Singapore
    ];
    return pairs;
  }, []);

  return (
    <>
      {routes.map(([start, end], index) => {
        const startVec = latLonToVector3(start.lat, start.lon, 2);
        const endVec = latLonToVector3(end.lat, end.lon, 2);

        const mid = new THREE.Vector3()
          .addVectors(startVec, endVec)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(2.4);

        const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
        const points = curve.getPoints(60);

        return (
          <group key={index}>
            <LinePoints points={points} color="#E63946" />
          </group>
        );
      })}
    </>
  );
}

// Helper for animated dashed lines
function LinePoints({ points, color }: { points: THREE.Vector3[], color: string }) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (lineRef.current) {
      // Pulsing opacity
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = 0.2 + Math.sin(state.clock.getElapsedTime() * 3 + points[0].x) * 0.1;
    }
  });

  return (
    <line ref={lineRef as any}>
      <bufferGeometry attach="geometry" setFromPoints={points} />
      <lineBasicMaterial attach="material" color={color} transparent opacity={0.3} linewidth={1} />
    </line>
  );
}

// Main Canvas Scene
export default function Globe3D() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#E63946" />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <DottedGlobe />
        </Float>
      </Canvas>
    </div>
  );
}
