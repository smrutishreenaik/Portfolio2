import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/Testimonials.module.scss';

const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Senior Architect',
    text: 'Top notch Microservices work.',
    color: '#e0f2fe',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'Product Manager',
    text: 'Delivered the Azure migration ahead of time.',
    color: '#fef3c7',
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Tech Lead',
    text: 'Incredible attention to detail in the frontend.',
    color: '#dcfce7',
  },
  {
    id: 4,
    name: 'Emily Davis',
    role: 'CTO',
    text: 'A true full-stack talent.',
    color: '#fce7f3',
  },
];

const Testimonials = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    // --- TIMING CONFIGURATION ---
    const totalPages = 16;
    const startPage = 12;
    const pinLength = 2;
    // ----------------------------

    const start = startPage / totalPages;
    const end = (startPage + pinLength) / totalPages;

    if (containerRef.current) {
      const scrollOffset = scroll.offset;

      // 1. CONTAINER VISIBILITY LOGIC
      if (scrollOffset < start) {
        const entranceStart = (startPage - 1) / totalPages;
        const progress = (scrollOffset - entranceStart) / (start - entranceStart);
        containerRef.current.style.opacity = `${Math.max(0, progress)}`;
        containerRef.current.style.pointerEvents = 'none';
      } else if (scrollOffset > end) {
        const exitEnd = (startPage + pinLength + 1) / totalPages;
        const progress = (scrollOffset - end) / (exitEnd - end);
        containerRef.current.style.opacity = `${1 - progress}`;
        containerRef.current.style.pointerEvents = 'none';
      } else {
        containerRef.current.style.opacity = '1';
        containerRef.current.style.pointerEvents = 'none';
      }
    }

    // 2. CARD ANIMATION LOGIC
    testimonials.forEach((_, index) => {
      const card = cardRefs.current[index];
      if (!card) return;

      const adjustedStart = startPage - 0.5;
      const relativeStart = adjustedStart + index * (pinLength / testimonials.length);
      const cardStart = relativeStart / totalPages;
      const cardDuration = pinLength / testimonials.length / totalPages;

      const range = scroll.range(cardStart, cardDuration);

      const gap = 4;
      const offset = index * gap;

      // Math: Starts at 100vh (off bottom), stops at -10vh (covers title slightly above center)
      const translateY = (1 - range) * 100 + offset;

      // Bulletproof calc() transform
      card.style.transform = `translate(-50%, calc(-50% + ${translateY}vh))`;
      card.style.opacity = `${range}`;
    });
  });

  return (
    <Html
      portal={{ current: document.body }}
      calculatePosition={() => [0, 0]}
      className={styles.htmlWrapper}
    >
      <div ref={containerRef} className={styles.container}>
        <h2 className={styles.title}>What People Say</h2>

        {testimonials.map((t, index) => (
          <div
            key={t.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={styles.card}
            style={{
              backgroundColor: t.color,
              zIndex: index + 1,
              // Starting position matching the calc() logic
              transform: 'translate(-50%, calc(-50% + 90vh))',
              opacity: 0,
            }}
          >
            <p className={styles.quote}>"{t.text}"</p>

            <div className={styles.authorBlock}>
              <strong className={styles.authorName}>{t.name}</strong>
              <span className={styles.authorRole}>{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </Html>
  );
};

export default Testimonials;
