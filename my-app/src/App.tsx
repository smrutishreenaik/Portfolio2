import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Experience from './components/Experience';
import Overlay from './components/Overlay';
import Testimonials from './components/Testimonials';
import Projects from './components/Projects';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Increase pages to accommodate the "Stop" duration */}
        <ScrollControls pages={10} damping={0.3}>
          <Experience />

          {/* 1. The Normal HTML Content (Intro, About, etc.) */}
          <Scroll html style={{ width: '100%' }}>
            <Overlay />
          </Scroll>

          <Projects />

          <Testimonials />
        </ScrollControls>
      </Canvas>
    </div>
  );
}

export default App;
