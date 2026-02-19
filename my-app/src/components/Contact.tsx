import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/Contact.module.scss';

// --- UPDATED: Use your own image paths here ---
const floatingIconsData = [
  {
    id: 1,
    imgSrc: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
    top: '-10%',
    left: '-5%',
    start: 0.25,
    end: 0.55,
  },
  {
    id: 2,
    imgSrc: 'https://cdn-icons-png.flaticon.com/512/732/732200.png',
    top: '15%',
    left: '95%',
    start: 0.4,
    end: 0.7,
  },
  {
    id: 3,
    imgSrc: 'https://cdn-icons-png.flaticon.com/512/1370/1370907.png',
    top: '75%',
    left: '-8%',
    start: 0.55,
    end: 0.85,
  },
  {
    id: 4,
    imgSrc: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
    top: '85%',
    left: '90%',
    start: 0.7,
    end: 0.95,
  },
];

const Contact = () => {
  const scroll = useScroll();

  const text = "Let's work together.";
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const formRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const iconRefs = useRef<(HTMLImageElement | null)[]>([]); // Note: Updated to HTMLImageElement

  useFrame(() => {
    const totalPages = 17;
    const startPage = 16;
    const duration = 1;

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;

    if (containerRef.current && cardRef.current) {
      const scrollOffset = scroll.offset;

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

      if (scrollOffset > start - 0.5 / totalPages) {
        const relativeProgress = (scrollOffset - start) / (end - start);
        const clampedProgress = Math.max(0, Math.min(1, relativeProgress));
        const charsToShow = Math.floor(text.length * clampedProgress);

        charRefs.current.forEach((char, index) => {
          if (!char) return;
          if (index < charsToShow) {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0px)';
            char.style.color = '#000000';
          } else {
            char.style.opacity = '0.1';
            char.style.transform = 'translateY(10px)';
            char.style.color = '#aaaaaa';
          }
        });

        if (imgRef.current) {
          if (clampedProgress > 0.2) {
            imgRef.current.classList.add(styles.popped);
          } else {
            imgRef.current.classList.remove(styles.popped);
          }
        }

        floatingIconsData.forEach((data, index) => {
          const el = iconRefs.current[index];
          if (el) {
            if (clampedProgress >= data.start && clampedProgress <= data.end) {
              el.classList.add(styles.activeIcon);
            } else {
              el.classList.remove(styles.activeIcon);
            }
          }
        });

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
    >
      <div ref={containerRef} className={styles.container}>
        <div ref={cardRef} className={styles.card}>
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

            <div className={styles.imageContainer}>
              <img
                ref={imgRef}
                src='https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80'
                alt="Let's work together"
                className={styles.contactImage}
              />

              {/* --- UPDATED: Rendering <img> tags instead of <div> --- */}
              {floatingIconsData.map((data, index) => (
                <img
                  key={data.id}
                  ref={(el) => {
                    iconRefs.current[index] = el;
                  }}
                  src={data.imgSrc}
                  alt='floating decoration'
                  className={styles.floatingIcon}
                  style={{ top: data.top, left: data.left }}
                />
              ))}
            </div>
          </div>

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
