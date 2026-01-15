import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Image } from '@react-three/drei';
import * as THREE from 'three';

const Experience = () => {
  const scroll = useScroll();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // 1. Get scroll offset (0 at top, 1 at bottom)
    const r1 = scroll.range(0, 1/3); // Active during first 3rd of scroll
    
    // 2. Move Camera Forward
    // We start at Z=5. As we scroll, we move to Z=0 (inside the object)
    // The 'lerp' function interpolates smoothly between values.
    const targetZ = THREE.MathUtils.lerp(5, 0, r1); 
    state.camera.position.z = targetZ;

    // 3. Optional: Rotate the object slightly as you scroll for effect
    if (meshRef.current) {
        meshRef.current.rotation.x = THREE.MathUtils.lerp(0, -0.5, r1);
    }
  });

  return (
    <group>
      {/* This Box represents the "Screen" or "Laptop". 
        Later, you can replace this <mesh> with a <Primitive object={gltf.scene} /> 
      */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        {/* Width: 3, Height: 2, Depth: 0.1 (Laptop screen shape) */}
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#4f46e5" wireframe={false} />
      </mesh>
      
      {/* Background particles or stars could go here */}
    </group>
  );
};

export default Experience;