import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Text, Float, Html } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

// Loading component đẹp hơn
function LoadingComponent() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <p className="mt-2 text-amber-700 font-medium">Loading Coffee Shop...</p>
      </div>
    </Html>
  )
}

// Coffee Cup with realistic materials
function RealisticCoffeeCup({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const cupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (cupRef.current) {
      cupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group position={position} ref={cupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Cup body - ceramic material */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.28, 0.6, 32]} />
          <meshPhysicalMaterial 
            color="#f8f8f8"
            roughness={0.1}
            metalness={0.0}
            clearcoat={0.3}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Coffee liquid with foam */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.32, 0.26, 0.08, 32]} />
          <meshStandardMaterial 
            color="#3d2914"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>

        {/* Foam layer */}
        <mesh position={[0, 0.31, 0]}>
          <cylinderGeometry args={[0.30, 0.24, 0.04, 32]} />
          <meshStandardMaterial 
            color="#f5f5dc"
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>

        {/* Handle with better geometry */}
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.18, 0.04, 16, 32, Math.PI]} />
          <meshPhysicalMaterial 
            color="#f8f8f8"
            roughness={0.1}
            metalness={0.0}
            clearcoat={0.3}
          />
        </mesh>

        {/* Saucer */}
        <mesh position={[0, -0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.03, 32]} />
          <meshPhysicalMaterial 
            color="#f8f8f8"
            roughness={0.1}
            metalness={0.0}
            clearcoat={0.3}
          />
        </mesh>
      </Float>
    </group>
  )
}

// Realistic Croissant với geometry tốt hơn
function RealisticCroissant({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Main croissant body - curved shape */}
        <mesh castShadow receiveShadow rotation={[0, 0.3, 0.1]}>
          <torusGeometry args={[0.2, 0.08, 8, 16, Math.PI * 1.2]} />
          <meshStandardMaterial 
            color="#daa520"
            roughness={0.8}
          />
        </mesh>
        
        {/* End tip */}
        <mesh position={[0.15, -0.05, 0.1]} rotation={[0, 0.8, 0.2]} castShadow>
          <coneGeometry args={[0.04, 0.12, 8]} />
          <meshStandardMaterial 
            color="#cd853f"
            roughness={0.8}
          />
        </mesh>

        {/* Texture details */}
        <mesh position={[0, 0, 0]} rotation={[0, 0.3, 0.1]}>
          <torusGeometry args={[0.2, 0.06, 6, 12, Math.PI * 1.2]} />
          <meshStandardMaterial 
            color="#b8860b"
            roughness={0.9}
          />
        </mesh>
      </Float>
    </group>
  )
}

// Modern Cafe Table
function ModernCafeTable() {
  return (
    <group>
      {/* Table top - wood texture */}
      <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.08, 64]} />
        <meshPhysicalMaterial 
          color="#8b4513"
          roughness={0.7}
          metalness={0.0}
          clearcoat={0.2}
        />
      </mesh>
      
      {/* Table edge */}
      <mesh position={[0, -0.29, 0]} castShadow>
        <cylinderGeometry args={[1.22, 1.22, 0.04, 64]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Modern pedestal base */}
      <mesh position={[0, -0.65, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.7, 32]} />
        <meshPhysicalMaterial 
          color="#2c2c2c"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      
      {/* Base plate */}
      <mesh position={[0, -1.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
        <meshPhysicalMaterial 
          color="#1a1a1a"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  )
}

// Coffee Beans scatter với shape tốt hơn
function CoffeeBeans() {
  const beans = []
  for (let i = 0; i < 15; i++) {
    const x = (Math.random() - 0.5) * 3
    const z = (Math.random() - 0.5) * 3
    beans.push(
      <group key={i} position={[x, -0.18, z]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.025, 8, 6]} />
          <meshStandardMaterial color="#3d2914" roughness={0.8} />
        </mesh>
        {/* Coffee bean split line */}
        <mesh>
          <boxGeometry args={[0.002, 0.04, 0.01]} />
          <meshStandardMaterial color="#2d1f0f" />
        </mesh>
      </group>
    )
  }
  return <>{beans}</>
}

// Steam effect
function SteamEffect({ position }: { position: [number, number, number] }) {
  const steamRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (steamRef.current) {
      steamRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + position[1] + 0.5
      steamRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={steamRef} position={position}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 2) * 0.05,
            i * 0.2,
            Math.cos(i * 2) * 0.05
          ]}
        >
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.3 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Ambient particles
function AmbientParticles() {
  const particlesRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 8,
            Math.random() * 3 + 1,
            (Math.random() - 0.5) * 8
          ]}
        >
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

const CoffeeScene3D = () => {
  return (
    <div className="w-full h-[700px] bg-gradient-to-b from-amber-50 to-orange-100 rounded-lg overflow-hidden shadow-2xl">
      <Canvas
        camera={{ position: [4, 3, 4], fov: 45 }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
      >
        <Suspense fallback={<LoadingComponent />}>
          {/* Professional Lighting Setup */}
          <ambientLight intensity={0.4} color="#ffeaa7" />
          
          {/* Key light */}
          <directionalLight 
            position={[5, 8, 5]} 
            intensity={1.0} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={20}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            color="#fff8dc"
          />
          
          {/* Fill light */}
          <directionalLight 
            position={[-3, 4, -2]} 
            intensity={0.4} 
            color="#ffd700"
          />
          
          {/* Rim light */}
          <pointLight 
            position={[0, 2, -3]} 
            intensity={0.6} 
            color="#ff6b35"
          />

          {/* HDRI Environment */}
          <Environment preset="city" />
          
          {/* Scene Objects */}
          <ModernCafeTable />
          
          {/* Coffee arrangements */}
          <RealisticCoffeeCup position={[0.4, 0, 0.3]} />
          <RealisticCoffeeCup position={[-0.5, 0, -0.2]} />
          <RealisticCoffeeCup position={[0.1, 0, -0.6]} />
          
          {/* Steam effects */}
          <SteamEffect position={[0.4, 0.3, 0.3]} />
          <SteamEffect position={[-0.5, 0.3, -0.2]} />
          <SteamEffect position={[0.1, 0.3, -0.6]} />
          
          {/* Pastries */}
          <RealisticCroissant position={[0.7, -0.15, -0.1]} />
          <RealisticCroissant position={[-0.3, -0.15, 0.4]} />
          
          {/* Coffee beans */}
          <CoffeeBeans />
          
          {/* Atmospheric particles */}
          <AmbientParticles />
          
          {/* Ground with realistic material */}
          <mesh position={[0, -1.15, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial 
              color="#f5f5dc" 
              roughness={0.8}
              metalness={0.0}
            />
          </mesh>
          
          {/* Contact shadows for realism */}
          <ContactShadows 
            position={[0, -1.1, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2}
            far={4}
          />
          
          {/* Cafe signage */}
          <Text
            position={[0, 2.5, -3]}
            fontSize={0.6}
            color="#8B4513"
            anchorX="center"
            anchorY="middle"
          >
            ☕ Aurora COFFEE ☕
          </Text>
          
          <Text
            position={[0, 1.9, -3]}
            fontSize={0.25}
            color="#CD853F"
            anchorX="center"
            anchorY="middle"
          >
            Premium Coffee Experience
          </Text>
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={false}
            minDistance={3}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default CoffeeScene3D