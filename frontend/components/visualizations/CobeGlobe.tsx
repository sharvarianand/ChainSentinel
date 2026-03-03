"use client";
import createGlobe from "cobe";
import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * Generates a texture with the brand name repeated horizontally.
 */
function createTextTexture(text: string, color: string, font: string) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Configuration
    const width = 2048; // Increased resolution to prevent overlap
    const height = 256; // Taller band
    const repeats = 4; // How many times to repeat the text around the ring

    canvas.width = width;
    canvas.height = height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background - transparent
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, width, height);

    // Text Style
    ctx.fillStyle = color;
    // Attempt to use the font variable if possible, or fallback
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw text repeated
    const segmentWidth = width / repeats;
    for (let i = 0; i < repeats; i++) {
        const x = segmentWidth * i + segmentWidth / 2;
        ctx.fillText(text, x, height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
}

function TextRing({ radius }: { radius: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Create texture once
    const texture = useMemo(() => {
        // Red color #E63946
        return createTextTexture("CHAINSENTINEL", "#FFFFFF", "bold 40px 'Space Grotesk', sans-serif");
    }, []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Sync rotation speed with the globe (approx 0.003 rad/frame or similar)
            // Rotating negative Y to match standard globe spin direction if needed
            meshRef.current.rotation.y -= 0.2 * delta;
        }
    });

    if (!texture) return null;

    return (
        <mesh ref={meshRef}>
            {/* 
        CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded) 
        Open ended true to remove caps.
      */}
            <cylinderGeometry args={[radius, radius, 0.6, 64, 1, true]} />
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={0.9}
                side={THREE.FrontSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false} // Allow seeing through to the back (helper for avoiding z-fighting, but we want occlusion)
            // Actually we want depthWrite=true? No, we handle occlusion with the sphere.
            // But the text is transparent.
            />
        </mesh>
    );
}

/**
 * An invisible sphere that writes to the depth buffer to occlude the back of the ring.
 */
function OcclusionSphere({ radius }: { radius: number }) {
    return (
        <mesh>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshBasicMaterial colorWrite={false} />
        </mesh>
    );
}

export const CobeGlobe = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const phiRef = useRef(0);

    useEffect(() => {
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize);
        onResize();

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 800 * 2,
            height: 800 * 2,
            phi: 0,
            theta: 0, // No tilt in Cobe to keep it simple, we tilt ring/camera if needed
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.05, 0.09, 0.16], // Deep Slate
            markerColor: [0.9, 0.22, 0.27], // E63946
            glowColor: [0.9, 0.22, 0.27], // E63946
            markers: [
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
                { location: [31.2304, 121.4737], size: 0.05 },
                { location: [51.5074, -0.1278], size: 0.05 },
                { location: [28.6139, 77.209], size: 0.05 },
                { location: [-33.8688, 151.2093], size: 0.05 },
                { location: [1.3521, 103.8198], size: 0.05 },
                { location: [25.2048, 55.2708], size: 0.05 },
            ],
            onRender: (state) => {
                state.phi = phiRef.current;
                phiRef.current += 0.003;
            },
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div
            className={cn(
                "relative w-full h-full aspect-square flex items-center justify-center",
                className
            )}
        >
            {/* 1. The Cobe Globe (Bottom Layer) */}
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    aspectRatio: "1",
                    opacity: 1,
                }}
                className="relative z-10"
            />

            {/* 2. Three.js Overlay for the Ring (Top Layer) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                    <ambientLight intensity={1} />

                    {/* 
               Calibration:
               Cobe globe fills the canvas. width=800.
               We need to match the R3F sphere radius to this visual size.
               Visual tuning: A radius of ~1.3 at Z=3.5 approximately matches the filled Cobe globe.
            */}

                    {/* The Text Ring - slightly larger than the globe */}
                    <TextRing radius={1.4} />

                    {/* The Occlusion Sphere - Matches the globe size to hide back-face text */}
                    <OcclusionSphere radius={1.15} />

                </Canvas>
            </div>
        </div>
    );
};
