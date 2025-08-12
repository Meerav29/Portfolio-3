"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

const ORBIT_RADIUS = 2.1;
const ORBIT_TILT: [number, number, number] = [Math.PI / 2.8, 0.2, 0];

// ===== 3D Scene Components =====
function Planet() {
  const planetRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.1; // slow spin
    }
  });
  return (
    <mesh ref={planetRef} position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[1.2, 96, 96]} />
      {/* Rich, dark material with slight sheen */}
      <meshStandardMaterial
        color="#10131a"
        roughness={0.75}
        metalness={0.05}
      />
      {/* Subtle city/night lights tint */}
      <meshPhongMaterial
        attach="material-1"
        color="#0f1a2a"
        shininess={10}
        opacity={0.12}
        transparent
        blending={1}
      />
    </mesh>
  );
}

function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2.8, 0.2, 0]}> {/* tilt for aesthetics */}
      <torusGeometry args={[2.1, 0.01, 16, 256]} />
      <meshBasicMaterial color="#dbeafe" opacity={0.3} transparent />
    </mesh>
  );
}

function MoonOrbit() {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.4; // orbit speed
    }
  });
  return (
    <group ref={group} rotation={[0.25, 0.2, 0]}> {/* slight inclination */}
      <mesh position={[2.1, 0, 0]} castShadow>
        <sphereGeometry args={[0.25, 48, 48]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.05} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      {/* Key light */}
      <directionalLight
        position={[3, 2, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Rim light for glow */}
      <pointLight position={[-4, -2, -3]} intensity={0.6} />
    </>
  );
}

function FallbackNoWebGL() {
  return (
    <div className="text-center text-slate-200/80">
      <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-gradient-to-br from-slate-600 to-slate-900 shadow-lg" />
      <p className="text-sm">Your browser can't render 3D. Showing a placeholder.</p>
    </div>
  );
}

/** Simple feature check to decide whether to render 3D or a static fallback */
function useHasWebGL() {
  const [has, setHas] = React.useState(true);
  React.useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok =
        typeof window !== "undefined" &&
        !!(window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      setHas(ok);
    } catch {
      setHas(false);
    }
  }, []);
  return has;
}

// ===== UI Components =====
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/30">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="text-lg font-semibold tracking-tight">Meerav Shah</a>
        <ul className="hidden gap-6 md:flex text-sm text-slate-300">
          <li><a className="hover:text-white" href="#experience">Experience</a></li>
          <li><a className="hover:text-white" href="#projects">Projects</a></li>
          <li><a className="hover:text-white" href="#about">About</a></li>
          <li><a className="hover:text-white" href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

function ScrollIndicator() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-slate-300">
      <div className="flex flex-col items-center gap-2">
        <svg width="28" height="44" viewBox="0 0 28 44" fill="none" aria-hidden="true">
          <rect x="1.25" y="1.25" width="25.5" height="41.5" rx="12.75" stroke="currentColor" strokeWidth="2.5" />
          <circle id="wheel" cx="14" cy="10" r="3" fill="currentColor" />
        </svg>
        <span className="text-xs">Scroll</span>
      </div>
      <style jsx>{`
        @keyframes wheel {
          0% { transform: translateY(0); opacity: 1; }
          70% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        #wheel { animation: wheel 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { #wheel { animation: none; } }
      `}</style>
    </div>
  );
}

// ===== Hero Section =====
function Hero3D() {
  const hasWebGL = useHasWebGL();
  return (
    <section id="home" className="relative isolate flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black text-white">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.8)_0%,rgba(0,0,0,0.8)_55%,rgba(0,0,0,1)_100%)]"/>

      {/* 3D Canvas */}
      {hasWebGL ? (
      <Canvas
        className="absolute inset-0"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000");
        }}
      >
        <Lights />
        <Planet />
        <OrbitRing />
        <MoonOrbit />
      </Canvas>
    ) : (
      <div className="absolute inset-0 grid place-items-center">
        <FallbackNoWebGL />
      </div>
    )}

      {/* Optional overlay title (kept minimal per request) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        {/* Keep clean; add headline later if desired */}
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}

// ===== Placeholder Sections (content to be added later) =====
function Placeholder({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-24 px-6 py-28 text-slate-200">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-slate-400">Placeholder content. We'll fill this in later.</p>
    </section>
  );
}

// ===== Page Export =====
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-slate-100">
      <Header />
      <main>
        <Hero3D />
        <Placeholder id="experience" title="Experience" />
        <Placeholder id="projects" title="Projects" />
        <Placeholder id="about" title="About" />
        <Placeholder id="contact" title="Contact" />
      </main>
      <footer className="border-t border-white/5 py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Meerav Shah
      </footer>
    </div>
  );
}
