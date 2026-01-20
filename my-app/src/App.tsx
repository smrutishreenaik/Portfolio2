import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

function App() {
  return (
    // '100vh' ensures the canvas takes the full screen
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Ambient light for general visibility */}
        <ambientLight intensity={0.5} />
        {/* Directional light to create shadows/depth */}
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* pages={3}: Defines how long the scroll page is (300vh).
          damping={0.25}: Adds "weight" to the scroll for smoothness.
        */}
        <ScrollControls pages={6} damping={0.25}>
          {/* Layer 1: The 3D Content */}
          <Experience />

          {/* Layer 2: The HTML Content (Overlay) */}
          <Scroll html style={{ width: '100%' }}>
            <Overlay />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}

export default App;
