import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

const Bio = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 20;
    const startPage = 1; // Active start
    const duration = 1; // Active duration
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;

    if (containerRef.current) {
      const scrollOffset = scroll.offset;

      // We assume the entrance takes 1 full page (Page 0 to 1)
      const entranceStart = (startPage - 1) / totalPages;

      // We assume exit takes 1 full page (Page 2 to 3)
      const exitEnd = (startPage + duration + 1) / totalPages;

      // ============================================
      // 1. SLIDING LOGIC (Transform Y)
      // ============================================

      if (scrollOffset < start) {
        // --- ENTRANCE PHASE (Scroll Down -> Slides Up from Bottom) ---
        if (scrollOffset < entranceStart) {
          // Before entrance: Hide below screen
          containerRef.current.style.transform = 'translateY(100vh)';
        } else {
          // Sliding In: Interpolate from 100vh to 0vh
          const progress = (scrollOffset - entranceStart) / (start - entranceStart);
          // progress 0 = 100vh (bottom), progress 1 = 0vh (center)
          const yPos = (1 - progress) * 100;
          containerRef.current.style.transform = `translateY(${yPos}vh)`;
        }
      } else if (scrollOffset > end) {
        // --- EXIT PHASE (Scroll Down -> Slides Up to Top) ---
        if (scrollOffset > exitEnd) {
          // After exit: Hide above screen
          containerRef.current.style.transform = 'translateY(-100vh)';
        } else {
          // Sliding Out: Interpolate from 0vh to -100vh
          const progress = (scrollOffset - end) / (exitEnd - end);
          const yPos = -progress * 100;
          containerRef.current.style.transform = `translateY(${yPos}vh)`;
        }
      } else {
        // --- ACTIVE PHASE (Locked on Screen) ---
        containerRef.current.style.transform = 'translateY(0vh)';
      }

      // ============================================
      // 2. TEXT ANIMATION (Same as before)
      // ============================================
      if (scrollOffset >= start && scrollOffset <= end) {
        const progress = (scrollOffset - start) / (end - start);
        const charsToShow = Math.floor(text.length * progress);

        charRefs.current.forEach((char, index) => {
          if (!char) return;
          if (index < charsToShow) {
            char.style.opacity = '1';
            char.style.color = 'black';
            char.style.transform = 'translateY(0px)';
            char.style.filter = 'blur(0px)';
          } else {
            char.style.opacity = '0.2';
            char.style.color = 'black';
            char.style.transform = 'translateY(10px)';
            char.style.filter = 'blur(4px)';
          }
        });
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
          background: '#ffffff', // Solid White
          // REMOVED: opacity transition
          willChange: 'transform', // Optimized for sliding
        }}
      >
        <div
          style={{
            width: '80%',
            maxWidth: '800px',
            fontSize: '2.5rem',
            lineHeight: '1.4',
            fontWeight: '600',
            display: 'flex',
            flexWrap: 'wrap',
            pointerEvents: 'none',
            color: 'black',
          }}
        >
          {text.split('').map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                charRefs.current[i] = el;
              }}
              style={{
                opacity: 0.2,
                transition: 'opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease',
                marginRight: char === ' ' ? '10px' : '0',
                display: 'inline-block',
                willChange: 'opacity, transform, filter',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </Html>
  );
};

export default Bio;
