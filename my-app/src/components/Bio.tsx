import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

// Replace these with your actual image paths
const img1 =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
const img2 =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';

const Bio = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const coinRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 18;
    const startPage = 1;
    const duration = 1;
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;

    if (containerRef.current) {
      const scrollOffset = scroll.offset;
      const entranceStart = (startPage - 1) / totalPages;
      const exitEnd = (startPage + duration + 1) / totalPages;

      // ============================================
      // 1. SLIDING LOGIC (Transform Y)
      // ============================================
      if (scrollOffset < start) {
        if (scrollOffset < entranceStart) {
          containerRef.current.style.transform = 'translateY(100vh)';
        } else {
          const progress = (scrollOffset - entranceStart) / (start - entranceStart);
          const yPos = (1 - progress) * 100;
          containerRef.current.style.transform = `translateY(${yPos}vh)`;
        }
      } else if (scrollOffset > end) {
        if (scrollOffset > exitEnd) {
          containerRef.current.style.transform = 'translateY(-100vh)';
        } else {
          const progress = (scrollOffset - end) / (exitEnd - end);
          const yPos = -progress * 100;
          containerRef.current.style.transform = `translateY(${yPos}vh)`;
        }
      } else {
        containerRef.current.style.transform = 'translateY(0vh)';
      }

      // ============================================
      // 2. TEXT & SEQUENTIAL COIN ANIMATION
      // ============================================
      if (scrollOffset >= start && scrollOffset <= end) {
        // Overall progress from 0.0 to 1.0
        const progress = (scrollOffset - start) / (end - start);

        // --- A. TEXT REVEAL ---
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

        // --- B. COIN ENLARGE THEN FLIP ---
        if (coinRef.current) {
          // Phase 1: Enlarge (0.0 to 0.5 progress)
          // Multiply by 2 so it reaches 100% scale halfway through the scroll
          const scaleProgress = Math.min(1, progress * 2);
          const scale = scaleProgress;

          // Phase 2: Flip (0.5 to 1.0 progress)
          // Subtract 0.5 so it starts calculating only after the halfway mark,
          // then multiply by 2 so it completes the full 180 degrees by the end.
          const flipProgress = Math.max(0, (progress - 0.5) * 2);
          const rotateY = flipProgress * 180;

          // Apply 3D transform
          coinRef.current.style.transform = `scale(${scale}) rotateY(${rotateY}deg)`;
        }
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
          background: '#ffffff',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: '90%',
            maxWidth: '1200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '50px',
          }}
        >
          {/* ================= LEFT SIDE: TEXT ================= */}
          <div
            style={{
              flex: 1,
              fontSize: '2rem',
              lineHeight: '1.5',
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
                  transition: 'opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease',
                  marginRight: char === ' ' ? '8px' : '0',
                  display: 'inline-block',
                  willChange: 'opacity, transform, filter',
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* ================= RIGHT SIDE: COIN IMAGE ================= */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1000px',
            }}
          >
            {/* The Coin Element */}
            <div
              ref={coinRef}
              style={{
                width: '350px',
                height: '350px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: 'scale(0) rotateY(0deg)', // Initial state
                willChange: 'transform',
              }}
            >
              {/* FACE 1 (Front) */}
              <img
                src={img1}
                alt='Me 1'
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  backfaceVisibility: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  border: '8px solid white',
                }}
              />

              {/* FACE 2 (Back) */}
              <img
                src={img2}
                alt='Me 2'
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)', // Image mapped to the back
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  border: '8px solid white',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Bio;
