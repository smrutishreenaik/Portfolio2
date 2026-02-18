import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/Testimonials.module.scss';

// Updated data with Images and LinkedIn URLs
const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Senior Architect @ TechCorp',
    text: 'Top notch Microservices work. Completely transformed our backend architecture.',
    image: 'https://i.pravatar.cc/150?img=11', // Placeholder: Replace with real URL
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'Product Manager @ CloudNet',
    text: 'Delivered the Azure migration ahead of time with zero downtime. Exceptional professional.',
    image: 'https://i.pravatar.cc/150?img=44',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Tech Lead @ Innovate',
    text: 'Incredible attention to detail in the frontend. The 3D integration was flawless.',
    image: 'https://i.pravatar.cc/150?img=33',
    linkedin: 'https://linkedin.com/',
  },
];

const Testimonials = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    const totalPages = 16;
    const startPage = 12;
    const pinLength = 2;

    const start = startPage / totalPages;
    const end = (startPage + pinLength) / totalPages;

    if (containerRef.current) {
      const scrollOffset = scroll.offset;

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
        containerRef.current.style.pointerEvents = 'none'; // Re-enable so we can click links!
      }
    }

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

      const translateY = (1 - range) * 100 - 10 + offset;

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
              zIndex: index + 1,
              transform: 'translate(-50%, calc(-50% + 90vh))',
              opacity: 0,
            }}
          >
            {/* Decorative Quote Mark */}
            <span className={styles.quoteMark}>"</span>

            {/* Testimonial Text */}
            <p className={styles.quote}>{t.text}</p>

            {/* Bottom Row: Profile & Link */}
            <div className={styles.authorContainer}>
              <div className={styles.authorInfo}>
                <img src={t.image} alt={t.name} className={styles.profilePic} />
                <div className={styles.authorText}>
                  <span className={styles.authorName}>{t.name}</span>
                  <span className={styles.authorRole}>{t.role}</span>
                </div>
              </div>

              <a
                href={t.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.linkedinBtn}
              >
                {/* Inline SVG for LinkedIn Logo */}
                <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
                Connect
              </a>
            </div>
          </div>
        ))}
      </div>
    </Html>
  );
};

export default Testimonials;
