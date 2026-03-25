import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const IoTDevice = () => {
  const groupRef = useRef<any>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.8, 0.4]} />
        <meshStandardMaterial color={'#FF5500'} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0.6, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8]} />
        <meshStandardMaterial color={'#00F0FF'} emissive={'#00F0FF'} emissiveIntensity={0.3} />
      </mesh>

      {/* LED indicators */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.3 + i * 0.3, 0.35, 0.21]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={['#FF5500', '#00F0FF', '#FFD700'][i]} emissive={['#FF5500', '#00F0FF', '#FFD700'][i]} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const ConnectedNodes = () => {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.002;
    }
  });

  const positions = [
    [0, 0, 0],
    [2, 1.5, 0],
    [-2, 1.5, 0],
    [1, -1.5, 0],
    [-1, -1.5, 0],
  ];

  return (
    <group ref={groupRef}>
      {/* Central node */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={'#FF5500'} emissive={'#FF5500'} emissiveIntensity={0.5} />
      </mesh>

      {/* Connected nodes */}
      {positions.slice(1).map((pos, i) => (
        <group key={i}>
          <mesh position={pos as any}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color={'#00F0FF'} emissive={'#00F0FF'} emissiveIntensity={0.4} />
          </mesh>
          {/* Connecting lines */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, 0, pos[0], pos[1], pos[2]])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={'#00F0FF'} linewidth={2} />
          </line>
        </group>
      ))}
    </group>
  );
};

export const IoTDeviceViewer = () => {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      camera={{ position: [0, 0, 3] }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color={'#FF5500'} />
      <pointLight position={[-5, -5, 5]} intensity={1} color={'#00F0FF'} />
      
      <IoTDevice />
    </Canvas>
  );
};

export const NetworkVisualization = () => {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      camera={{ position: [0, 0, 5] }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={'#FF5500'} />
      <pointLight position={[-5, -5, 5]} intensity={1} color={'#00F0FF'} />
      
      <ConnectedNodes />
    </Canvas>
  );
};
