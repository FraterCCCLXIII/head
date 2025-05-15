import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './styles.css';

// This is a placeholder component for a 3D head using Three.js
// In a real implementation, you would use a proper 3D model and animations

interface ThreeJSHeadProps {
  expression?: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised' | 'angry';
  speaking?: boolean;
  containerStyle?: React.CSSProperties;
}

// Simple head model component
const HeadModel = ({ expression = 'neutral', speaking = false }: { expression?: string, speaking?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const mouthIntervalRef = useRef<any>(null);
  
  // Speaking animation effect
  useEffect(() => {
    if (!speaking) {
      setMouthOpen(false);
      if (mouthIntervalRef.current) {
        clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
      return;
    }
    
    mouthIntervalRef.current = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 150);
    
    return () => {
      if (mouthIntervalRef.current) {
        clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
    };
  }, [speaking]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Simple idle animation
      meshRef.current.rotation.y += delta * 0.2;
      
      // Expression-based animations
      switch (expression) {
        case 'happy':
          meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
          break;
        case 'sad':
          meshRef.current.scale.y = 1 - Math.sin(state.clock.elapsedTime) * 0.03;
          break;
        case 'thinking':
          meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
          break;
        case 'surprised':
          meshRef.current.scale.x = meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
          break;
      }
    }
  });

  return (
    <group>
      {/* Head */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={hovered ? '#FFE0C0' : '#FFD8B4'} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.3, 0.3, 0.85]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </mesh>
      
      <mesh position={[0.3, 0.3, 0.85]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, -0.3, 0.85]} scale={[0.5, mouthOpen ? 0.2 : 0.05, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#FF9999" />
      </mesh>
    </group>
  );
};

const ThreeJSHead: React.FC<ThreeJSHeadProps> = ({ 
  expression = 'neutral',
  speaking = false,
  containerStyle = {}
}) => {
  // Listen for chat response events
  useEffect(() => {
    const handleChatResponse = (event: CustomEvent) => {
      // You can add more sophisticated animation logic here based on the message content
      // For now, we'll just use the speaking prop that's passed in
    };

    window.addEventListener('chatResponse' as any, handleChatResponse);
    
    return () => {
      window.removeEventListener('chatResponse' as any, handleChatResponse);
    };
  }, []);

  return (
    <div className="threejs-head-container" style={containerStyle}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <HeadModel expression={expression} speaking={speaking} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default ThreeJSHead;