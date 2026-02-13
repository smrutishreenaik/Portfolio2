import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/Bio.module.scss'; // <--- Import your new SCSS module

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

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
    const totalPages = 16;
    const startPage = 1;
    const duration = 1;
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;

    if (containerRef.current) {
      const scrollOffset = scroll.offset;
      const entranceStart = (startPage - 1) / totalPages;
      const exitEnd = (startPage + duration + 1) / totalPages;

      // 1. SLIDING LOGIC (Transform Y)
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

      // 2. TEXT & COIN ANIMATION
      if (scrollOffset >= start && scrollOffset <= end) {
        const progress = (scrollOffset - start) / (end - start);

        // A. TEXT REVEAL
        const charsToShow = Math.floor(text.length * progress);
        charRefs.current.forEach((char, index) => {
          if (!char) return;
          if (index < charsToShow) {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0px)';
            char.style.filter = 'blur(0px)';
          } else {
            char.style.opacity = '0.2';
            char.style.transform = 'translateY(10px)';
            char.style.filter = 'blur(4px)';
          }
        });

        // B. COIN ENLARGE & FLIP
        if (coinRef.current) {
          const scale = Math.min(1, progress * 2);
          const flipProgress = Math.max(0, (progress - 0.5) * 2);
          const rotateY = flipProgress * 180;

          coinRef.current.style.transform = `scale(${scale}) rotateY(${rotateY}deg)`;
        }
      }
    }
  });

  return (
    <Html
      portal={{ current: document.body }}
      calculatePosition={() => [0, 0]}
      // Apply the wrapper class from SCSS
      className={styles.htmlWrapper}
      style={{
        // These inline styles are required by @react-three/drei to force positioning
        width: '100vw',
        height: '100vh',
      }}
    >
      <div ref={containerRef} className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* LEFT: TEXT */}
          <div className={styles.textSection}>
            {text.split('').map((char, i) => (
              <span
                key={i}
                ref={(el) => {
                  charRefs.current[i] = el;
                }}
                // Use conditional class for spacing
                className={`${styles.char} ${char === ' ' ? styles.space : ''}`}
                style={{ opacity: 0.2 }} // Initial state
              >
                {char}
              </span>
            ))}
          </div>

          {/* RIGHT: COIN */}
          <div className={styles.coinSection}>
            <div ref={coinRef} className={styles.coin}>
              <img src={img1} alt='Me 1' className={styles.coinFace} />
              <img src={img2} alt='Me 2' className={`${styles.coinFace} ${styles.coinBack}`} />
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Bio;
