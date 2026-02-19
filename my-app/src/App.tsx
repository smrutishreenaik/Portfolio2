import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Experience from './components/Experience';
import Overlay from './components/Overlay';
import Testimonials from './components/Testimonials';
import Projects from './components/Projects';
import ExperienceLadder from './components/ExperienceLadder';
import Bio from './components/Bio';
import Intro from './components/Intro';
import Contact from './components/Contact';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Increase pages to accommodate the "Stop" duration */}
        <ScrollControls pages={17} damping={0.3}>
          <Experience />

          {/* 1. The Normal HTML Content (Intro, About, etc.) */}
          <Scroll html style={{ width: '100%' }}>
            <Overlay />
          </Scroll>

          <Intro />

          <Bio />

          <Projects />

          <ExperienceLadder />

          <Testimonials />
          <Contact />
        </ScrollControls>
      </Canvas>
    </div>
  );
}

export default App;
