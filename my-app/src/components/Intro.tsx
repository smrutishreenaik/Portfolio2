import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/Intro.module.scss'; // <--- Import Styles

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

        // Multiplier set to 5 so it grows but isn't massive
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
      className={styles.htmlWrapper}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <div ref={containerRef} className={styles.container}>
        {/* THE BLUE BOX */}
        <div ref={boxRef} className={styles.blueBox}>
          <h1>Scroll to Enter My World</h1>
        </div>

        {/* THE PROJECTILE IMAGE */}
        <div ref={arrowRef} className={styles.projectile}>
          <img
            src='/arrow.png' // Ensure this exists in your public folder
            alt='flying object'
            className={styles.projectileImage}
          />
        </div>
      </div>
    </Html>
  );
};

export default Intro;
