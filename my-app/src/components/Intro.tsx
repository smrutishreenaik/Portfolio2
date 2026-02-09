import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Intro = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 20;

    // We only care about the very start of the scroll (Page 0 to 1)
    const end = 1 / totalPages;

    if (containerRef.current && boxRef.current) {
      const scrollOffset = scroll.offset;

      // 1. ANIMATION LOGIC
      if (scrollOffset <= end) {
        // Calculate progress for just the first page (0 to 1)
        const progress = scrollOffset / end;

        // SCALE: Start at 1, Zoom in to 10x size
        const scale = 1 + progress * 15;

        // OPACITY: Fade out as it gets too big (around 80% progress)
        const opacity = 1 - Math.pow(progress, 3); // Exponential fade for drama

        containerRef.current.style.display = 'flex';
        containerRef.current.style.opacity = `${Math.max(0, opacity)}`;

        // Apply the Zoom to the BOX, not the text (optional, or both)
        boxRef.current.style.transform = `scale(${scale})`;
      } else {
        // If we are past Page 1, hide it completely
        containerRef.current.style.display = 'none';
      }
    }
  });

  return (
    <Html
      portal={{ current: document.body }}
      calculatePosition={() => [0, 0]}
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'opacity',
        }}
      >
        {/* THE BLUE BOX */}
        <div
          ref={boxRef}
          style={{
            padding: '40px 60px',
            backgroundColor: '#3b82f6', // The "Blue Box" color
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform', // Optimized for zoom
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontSize: '3rem',
              margin: 0,
              whiteSpace: 'nowrap', // Keep text on one line
            }}
          >
            Scroll to Enter My World
          </h1>
        </div>
      </div>
    </Html>
  );
};

export default Intro;
