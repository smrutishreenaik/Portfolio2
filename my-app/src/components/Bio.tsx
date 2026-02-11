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
  const coinRef = useRef<HTMLDivElement>(null); // New ref for the 3D coin

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 20;
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
      // 2. TEXT & COIN FLIP ANIMATION
      // ============================================
      if (scrollOffset >= start && scrollOffset <= end) {
        // Progress goes from 0.0 to 1.0 within this page section
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

        // --- B. COIN FLIP & SCALE ---
        if (coinRef.current) {
          // Scale from 0 to 1
          const scale = progress;
          // Rotate from 0 to 180 degrees (Flip)
          const rotateY = progress * 180;

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
        {/* NEW LAYOUT: Flex container splitting screen into Left and Right */}
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
              fontSize: '2rem', // Slightly smaller to fit side-by-side
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
              // perspective is required on the parent wrapper to make the 3D rotation look deep/realistic
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
                transformStyle: 'preserve-3d', // Crucial for 3D flip effect
                transform: 'scale(0) rotateY(0deg)', // Initial state (hidden and flat)
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
                  backfaceVisibility: 'hidden', // Hides this face when looking at the back
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  border: '8px solid white', // Optional: Gives a nice frame
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
                  backfaceVisibility: 'hidden', // Hides this face when looking at the front
                  transform: 'rotateY(180deg)', // This places the image on the back of the coin
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
