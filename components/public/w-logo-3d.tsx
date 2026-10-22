'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function ribbonGeometry(pts: [number, number][], width: number, depth: number) {
  const left: [number, number][] = [];
  const right: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    left.push([pts[i][0] + (nx * width) / 2, pts[i][1] + (ny * width) / 2]);
    right.unshift([pts[i][0] - (nx * width) / 2, pts[i][1] - (ny * width) / 2]);
  }
  const shape = new THREE.Shape();
  [...left, ...right].forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4, curveSegments: 8,
  });
  geo.center();
  return geo;
}

function Ribbon({ points, color, delay }: { points: [number, number][]; color: string; delay: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => ribbonGeometry(points, 0.95, 0.16), [points]);

  useEffect(() => {
    if (mesh.current) mesh.current.material = new THREE.MeshPhysicalMaterial({
      color, roughness: 0.16, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.18,
      transparent: true, opacity: 0, emissive: new THREE.Color(color), emissiveIntensity: 2.2,
      envMapIntensity: 1.2, side: THREE.DoubleSide,
    });
  }, [color]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now() + delay;
    const animate = () => {
      const t = Math.min(1, Math.max(0, (performance.now() - start) / 1500));
      const e = 1 - Math.pow(2, -10 * t);
      if (mesh.current) {
        mesh.current.scale.setScalar(0.25 + 0.75 * e);
        mesh.current.rotation.y = -2.4 * (1 - e);
        const m = mesh.current.material as THREE.MeshPhysicalMaterial;
        m.opacity = e;
        m.emissiveIntensity = 2.2 * (1 - t) + 0.12;
      }
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [delay]);

  return <mesh ref={mesh} geometry={geo} />;
}

function Rig({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (group.current) {
        group.current.rotation.y += (pointer.current.x * 0.35 - group.current.rotation.y) * 0.06;
        group.current.rotation.x += (pointer.current.y * 0.2 - group.current.rotation.x) * 0.06;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pointer]);
  return <group ref={group} />;
}

export default function WLogo3D() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const left = useMemo<[number, number][]>(() => [[-2.15, 1.7], [-1.05, -1.7], [0, 1.5]], []);
  const right = useMemo<[number, number][]>(() => [[0, 1.5], [1.05, -1.7], [2.15, 1.7]], []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.6], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      data-testid="w-logo-3d"
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[-4, 2, 4]} intensity={70} color="#0EA5FF" />
      <pointLight position={[4, -1, 4]} intensity={70} color="#7C3AED" />
      <directionalLight position={[0, 4, 6]} intensity={1.4} />
      <Rig pointer={pointer} />
      <Float speed={2} rotationIntensity={0.35} floatIntensity={0.7}>
        <Ribbon points={left} color="#0EA5FF" delay={150} />
        <Ribbon points={right} color="#7C3AED" delay={450} />
      </Float>
      <Sparkles count={90} scale={8} size={2.4} speed={0.45} color="#9ad8ff" opacity={0.65} />
    </Canvas>
  );
}
