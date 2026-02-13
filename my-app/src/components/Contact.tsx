import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/Contact.module.scss'; // <--- Import Styles

const Contact = () => {
  const scroll = useScroll();

  const text = "Let's work together.";
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const formRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 16;
    const startPage = 15;
    const duration = 1;
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;

    if (containerRef.current && cardRef.current) {
      const scrollOffset = scroll.offset;

      // 1. VISIBILITY & RISING ANIMATION
      if (scrollOffset < start - 1 / totalPages) {
        containerRef.current.style.display = 'none';
        containerRef.current.style.pointerEvents = 'none';
      } else {
        containerRef.current.style.display = 'flex';
        containerRef.current.style.pointerEvents = 'none';

        const riseStart = (startPage - 1) / totalPages;
        const riseEnd = start;
        const riseProgress = (scrollOffset - riseStart) / (riseEnd - riseStart);
        const cleanRise = Math.max(0, Math.min(1, riseProgress));

        const translateY = (1 - cleanRise) * 100;
        cardRef.current.style.transform = `translateY(${translateY}vh)`;
        cardRef.current.style.opacity = '1';
      }

      // 2. INNER CONTENT ANIMATION (Text & Form)
      if (scrollOffset > start - 0.5 / totalPages) {
        const relativeProgress = (scrollOffset - start) / (end - start);
        const clampedProgress = Math.max(0, Math.min(1, relativeProgress));
        const charsToShow = Math.floor(text.length * clampedProgress);

        // Animate Text Characters
        charRefs.current.forEach((char, index) => {
          if (!char) return;
          if (index < charsToShow) {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0px)';
            char.style.color = '#fff';
          } else {
            char.style.opacity = '0.1';
            char.style.transform = 'translateY(10px)';
            char.style.color = '#555';
          }
        });

        // Animate Form Fields
        formRefs.current.forEach((field, index) => {
          if (!field) return;
          const fieldStart = index * 0.15;
          const fieldEnd = fieldStart + 0.4;
          const fieldProgress = (clampedProgress - fieldStart) / (fieldEnd - fieldStart);
          const cleanFieldProgress = Math.max(0, Math.min(1, fieldProgress));

          const translateX = 50 - cleanFieldProgress * 50;
          const opacity = cleanFieldProgress;

          field.style.transform = `translateX(${translateX}px)`;
          field.style.opacity = `${opacity}`;
        });
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
        {/* ================= THE CARD ================= */}
        <div ref={cardRef} className={styles.card}>
          {/* LEFT SIDE (TEXT) */}
          <div className={styles.textSection}>
            <h1>
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
            </h1>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className={styles.formSection}>
            <form className={styles.form}>
              {['Name', 'Email', 'Message', 'Button'].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    formRefs.current[i] = el;
                  }}
                  className={styles.fieldWrapper}
                >
                  {item === 'Button' ? (
                    <button type='button' className={styles.button}>
                      Send Message
                    </button>
                  ) : item === 'Message' ? (
                    <div>
                      <label className={styles.label}>{item}</label>
                      <textarea rows={4} className={styles.textarea} />
                    </div>
                  ) : (
                    <div>
                      <label className={styles.label}>{item}</label>
                      <input type='text' className={styles.input} />
                    </div>
                  )}
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Contact;
