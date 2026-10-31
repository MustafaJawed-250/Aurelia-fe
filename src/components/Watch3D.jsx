import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural luxury watch built from primitives.
 * Replace with a production GLB by loading useGLTF('/models/watch.glb')
 * and swapping the group content. See docs in README.
 */
function WatchModel({ scrollProgress = 0, autoRotate = true }) {
  const group = useRef();
  const secondHand = useRef();

  useFrame((_, delta) => {
    if (secondHand.current) {
      secondHand.current.rotation.z -= delta * 0.1;
    }
    if (group.current && autoRotate) {
      // Subtle base rotation influenced by scroll
      group.current.rotation.y = scrollProgress * Math.PI * 1.2 + Math.sin(Date.now() * 0.0003) * 0.05;
      group.current.rotation.x = 0.15 + scrollProgress * 0.25;
      group.current.position.y = -scrollProgress * 0.3;
    }
  });

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c9a96e',
        metalness: 0.92,
        roughness: 0.18,
        envMapIntensity: 1.2,
      }),
    []
  );

  const steelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b8b8b8',
        metalness: 0.95,
        roughness: 0.22,
        envMapIntensity: 1.1,
      }),
    []
  );

  const dialMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        metalness: 0.3,
        roughness: 0.6,
      }),
    []
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        metalness: 0,
        roughness: 0,
        transmission: 0.9,
        thickness: 0.05,
        transparent: true,
        opacity: 0.3,
      }),
    []
  );

  const leatherMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3d2b1f',
        metalness: 0.05,
        roughness: 0.85,
      }),
    []
  );

  // Link chain
  const links = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const r = 1.35;
      arr.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        rotY: -angle,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={group} position={[0, 0, 0]} scale={1.1}>
      {/* Case */}
      <mesh material={goldMat} castShadow>
        <cylinderGeometry args={[0.85, 0.88, 0.22, 64]} />
      </mesh>
      {/* Bezel */}
      <mesh position={[0, 0.12, 0]} material={steelMat}>
        <torusGeometry args={[0.82, 0.06, 16, 64]} />
      </mesh>
      {/* Dial */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} material={dialMat}>
        <circleGeometry args={[0.72, 64]} />
      </mesh>
      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const isMajor = i % 3 === 0;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.58, 0.09, Math.cos(a) * 0.58]}
            rotation={[0, a, 0]}
            material={goldMat}
          >
            <boxGeometry args={[isMajor ? 0.04 : 0.02, 0.01, isMajor ? 0.12 : 0.06]} />
          </mesh>
        );
      })}
      {/* Hands */}
      <mesh position={[0, 0.1, 0.15]} rotation={[0, 0, -0.4]} material={goldMat}>
        <boxGeometry args={[0.035, 0.01, 0.4]} />
      </mesh>
      <mesh position={[0, 0.11, -0.1]} rotation={[0, 0, 0.8]} material={goldMat}>
        <boxGeometry args={[0.025, 0.01, 0.55]} />
      </mesh>
      <mesh ref={secondHand} position={[0, 0.12, 0]} material={steelMat}>
        <boxGeometry args={[0.01, 0.008, 0.62]} />
      </mesh>
      {/* Center pin */}
      <mesh position={[0, 0.13, 0]} material={goldMat}>
        <sphereGeometry args={[0.04, 16, 16]} />
      </mesh>
      {/* Crystal */}
      <mesh position={[0, 0.14, 0]} material={glassMat}>
        <cylinderGeometry args={[0.78, 0.78, 0.04, 64]} />
      </mesh>
      {/* Crown */}
      <mesh position={[0.92, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={goldMat}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
      </mesh>
      {/* Lugs + strap approximation (leather) */}
      <mesh position={[0, -0.05, 0.95]} material={leatherMat}>
        <boxGeometry args={[0.55, 0.08, 0.9]} />
      </mesh>
      <mesh position={[0, -0.05, -0.95]} material={leatherMat}>
        <boxGeometry args={[0.55, 0.08, 0.9]} />
      </mesh>
      {/* Subtle chain links around for visual interest */}
      {links.slice(0, 0).map((l, i) => (
        <mesh key={i} position={[l.x, -0.3, l.z]} rotation={[0, l.rotY, 0]} material={steelMat}>
          <boxGeometry args={[0.18, 0.06, 0.28]} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ scrollProgress, interactive }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow color="#fff5e6" />
      <directionalLight position={[-4, 3, -2]} intensity={0.4} color="#a0b0c0" />
      <spotLight position={[0, 6, 2]} intensity={0.8} angle={0.4} penumbra={0.5} color="#c9a96e" />
      <Environment preset="studio" />
      {interactive ? (
        <PresentationControls
          global
          snap
          rotation={[0.15, 0.3, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <WatchModel scrollProgress={scrollProgress} autoRotate={!interactive} />
        </PresentationControls>
      ) : (
        <WatchModel scrollProgress={scrollProgress} autoRotate />
      )}
      <ContactShadows position={[0, -1.4, 0]} opacity={0.45} scale={8} blur={2.5} />
    </>
  );
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return mobile;
}

export default function Watch3D({ scrollProgress = 0, interactive = false, className = '' }) {
  const isMobile = useIsMobile();
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    return (
      <div className={`watch3d-fallback ${className}`}>
        <div className="watch3d-fallback__inner">
          <span className="display h2 gold">Aurelia</span>
          <p className="muted">Premium timepieces</p>
        </div>
      </div>
    );
  }

  // Closer camera / wider FOV on small screens so the watch stays visible
  const camera = isMobile
    ? { position: [0, 0.9, 5.2], fov: 38 }
    : { position: [0, 1.2, 4.2], fov: 35 };

  return (
    <div className={`watch3d-canvas ${className}`}>
      <Canvas
        camera={camera}
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: isMobile ? 'low-power' : 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} interactive={interactive} />
        </Suspense>
      </Canvas>
    </div>
  );
}