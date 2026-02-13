import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Intro = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 16;
    const end = 1 / totalPages;

    if (containerRef.current && boxRef.current && arrowRef.current) {
      const scrollOffset = scroll.offset;

      if (scrollOffset <= end) {
        const progress = scrollOffset / end;

        // 1. MAIN BOX LOGIC (Zoom In)
        const boxScale = 1 + progress * 15;
        const opacity = 1 - Math.pow(progress, 3);

        containerRef.current.style.display = 'flex';
        containerRef.current.style.opacity = `${Math.max(0, opacity)}`;
        boxRef.current.style.transform = `scale(${boxScale})`;

        // ==========================================
        // 2. PROJECTILE IMAGE LOGIC
        // ==========================================

        const targetX = 45;
        const targetY = 45;
        const arcHeight = 30;

        const arrowX = progress * targetX;
        const arrowY = progress * targetY - Math.sin(progress * Math.PI) * arcHeight;

        // --- SIZE FIX ---
        // Changed the multiplier from 14 to 5.
        // It will still grow as it comes towards you, but it won't be massive.
        const arrowScale = 1 + progress * 5;

        const dx = targetX;
        const dy = targetY - Math.cos(progress * Math.PI) * Math.PI * arcHeight;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        arrowRef.current.style.transform = `translate(${arrowX}vw, ${arrowY}vh) scale(${arrowScale}) rotate(${angle}deg)`;
      } else {
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
          position: 'relative',
        }}
      >
        {/* THE BLUE BOX */}
        <div
          ref={boxRef}
          style={{
            padding: '40px 60px',
            backgroundColor: '#3b82f6',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <h1 style={{ color: 'white', fontSize: '3rem', margin: 0, whiteSpace: 'nowrap' }}>
            Scroll to Enter My World
          </h1>
        </div>

        {/* THE PROJECTILE IMAGE */}
        <div
          ref={arrowRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            // --- BASE SIZE FIX ---
            // Reduced the base starting size of the container
            width: '30px',
            height: '30px',
            marginLeft: '-15px', // Must be exactly half of width
            marginTop: '-15px', // Must be exactly half of height
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            willChange: 'transform',
          }}
        >
          {/* REPLACE WITH YOUR PNG */}
          <img
            src='/arrow.png' // <-- Put your image in the 'public' folder and update this path
            alt='flying object'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain', // Ensures the PNG maintains its aspect ratio
              filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.5))',
            }}
          />
        </div>
      </div>
    </Html>
  );
};

export default Intro;
