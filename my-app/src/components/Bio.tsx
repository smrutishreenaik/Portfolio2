import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/Bio.module.scss';

const Bio = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Update this to your actual bio text!
  const text =
    "Hi, I'm a full-stack developer passionate about building immersive digital experiences.";

  useFrame(() => {
    // --- TIMING CONFIGURATION ---
    const totalPages = 17;
    const startPage = 1; // Adjust this if your bio starts on a different page
    const duration = 1; // How many scrolls the bio stays on screen
    // ----------------------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;

    if (containerRef.current) {
      const scrollOffset = scroll.offset;

      // 1. CONTAINER VISIBILITY LOGIC
      if (scrollOffset < start - 0.5 / totalPages) {
        containerRef.current.style.display = 'none';
        containerRef.current.style.opacity = '0';
      } else if (scrollOffset > end + 0.5 / totalPages) {
        containerRef.current.style.display = 'none';
        containerRef.current.style.opacity = '0';
      } else {
        containerRef.current.style.display = 'flex';

        // Fade out slightly when transitioning to the next section
        const fadeOutProgress = (scrollOffset - end) / (1 / totalPages);
        containerRef.current.style.opacity = scrollOffset > end ? `${1 - fadeOutProgress}` : '1';

        // 2. INNER CONTENT ANIMATION
        const relativeProgress = (scrollOffset - start) / (end - start);
        const clampedProgress = Math.max(0, Math.min(1, relativeProgress));

        // --- Text Reveal ---
        const charsToShow = Math.floor(text.length * clampedProgress);
        charRefs.current.forEach((char, index) => {
          if (!char) return;
          if (index < charsToShow) {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0px)';
          } else {
            char.style.opacity = '0';
            char.style.transform = 'translateY(20px)';
          }
        });

        // --- Portrait Image Reveal ---
        if (imgRef.current) {
          // Slide up and fade in along with the text
          const imgY = 50 - clampedProgress * 50;
          imgRef.current.style.opacity = `${clampedProgress}`;
          imgRef.current.style.transform = `translateY(${imgY}px)`;
        }
      }
    }
  });

  return (
    <Html
      portal={{ current: document.body }}
      calculatePosition={() => [0, 0]}
      className={styles.htmlWrapper}
    >
      <div ref={containerRef} className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* LEFT SIDE: TEXT */}
          <div className={styles.textSection}>
            {text.split('').map((char, i) => (
              <span
                key={i}
                ref={(el) => {
                  charRefs.current[i] = el;
                }}
                className={`${styles.char} ${char === ' ' ? styles.space : ''}`}
              >
                {char}
              </span>
            ))}
          </div>

          {/* RIGHT SIDE: FULL PORTRAIT IMAGE */}
          <div className={styles.imageSection}>
            <img
              ref={imgRef}
              /* Replace this with your actual portrait photo URL */
              src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
              alt='My Portrait'
              className={styles.portraitImage}
            />
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Bio;
