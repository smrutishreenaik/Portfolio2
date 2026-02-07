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
    const startPage = 1; // Starts after Intro
    const duration = 1; // Lasts for 1 page
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;

    if (containerRef.current) {
      const scrollOffset = scroll.offset;

      // 1. CONTAINER VISIBILITY (Fade the White Background In/Out)
      if (scrollOffset < start) {
        // Entrance: Fade white page in over the 3D scene
        const entranceStart = (startPage - 0.5) / totalPages;
        const progress = (scrollOffset - entranceStart) / (start - entranceStart);

        containerRef.current.style.display = 'flex';
        containerRef.current.style.opacity = `${Math.max(0, progress)}`;
        containerRef.current.style.pointerEvents = 'none';
      } else if (scrollOffset > end) {
        // Exit: Fade white page out
        const exitEnd = (startPage + duration + 0.5) / totalPages;
        const progress = (scrollOffset - end) / (exitEnd - end);

        containerRef.current.style.display = 'flex';
        containerRef.current.style.opacity = `${1 - progress}`;
        containerRef.current.style.pointerEvents = 'none';
      } else {
        // Active: Fully White, Fully Visible
        containerRef.current.style.display = 'flex';
        containerRef.current.style.opacity = '1';
        containerRef.current.style.pointerEvents = 'none';
      }

      // 2. TEXT REVEAL ANIMATION
      if (scrollOffset >= start && scrollOffset <= end) {
        const progress = (scrollOffset - start) / (end - start);
        const charsToShow = Math.floor(text.length * progress);

        charRefs.current.forEach((char, index) => {
          if (!char) return;

          if (index < charsToShow) {
            // Active: BLACK and Opaque
            char.style.opacity = '1';
            char.style.color = '#000000'; // Pitch Black
            char.style.transform = 'translateY(0px)';
            char.style.filter = 'blur(0px)';
          } else {
            // Inactive: Light Gray and Faded
            char.style.opacity = '0.2'; // Very faint
            char.style.color = '#000000'; // Still black base, but transparent
            char.style.transform = 'translateY(10px)'; // Slight offset
            char.style.filter = 'blur(4px)'; // Blurry effect for unread text
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
          // --- CHANGE 1: SOLID WHITE BACKGROUND ---
          background: '#ffffff',
          opacity: 0, // Hidden initially
          transition: 'opacity 0.1s linear',
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
            // --- CHANGE 2: Ensure text defaults to black ---
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
                display: 'inline-block', // Required for transform to work on spans
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
