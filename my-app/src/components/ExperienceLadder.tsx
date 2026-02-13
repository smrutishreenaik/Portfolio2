import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/ExperienceLadder.module.scss';

const jobs = [
  {
    id: 1,
    title: 'Junior Dev',
    company: 'Startup Inc',
    date: '2020 - 2021',
    details:
      'Started my journey building UI components with React. Learned the basics of CI/CD and agile workflows. Optimized legacy code for better performance.',
  },
  {
    id: 2,
    title: 'Mid-Level Engineer',
    company: 'Tech Corp',
    date: '2021 - 2023',
    details:
      'Led the migration to Next.js. Mentored 2 junior developers and introduced automated testing. Reduced server costs by 30% through optimized caching.',
  },
  {
    id: 3,
    title: 'Senior Architect',
    company: 'Big Data Systems',
    date: '2023 - Present',
    details:
      'Designing scalable microservices architecture. Managing cloud infrastructure on AWS. Directing technical strategy for high-traffic enterprise applications.',
  },
];

const ExperienceLadder = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 16;
    const startPage = 7;
    const duration = 3;
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;
    const scrollOffset = scroll.offset;

    if (containerRef.current && avatarRef.current) {
      const entranceStart = (startPage - 1) / totalPages;
      const exitEnd = (startPage + duration + 1) / totalPages;

      // 1. CONTAINER VISIBILITY (Slide In/Out)
      if (scrollOffset < start) {
        if (scrollOffset < entranceStart) {
          containerRef.current.style.transform = 'translateY(100vh)';
          containerRef.current.style.display = 'none'; // Optimize
        } else {
          containerRef.current.style.display = 'block';
          const progress = (scrollOffset - entranceStart) / (start - entranceStart);
          const yPos = (1 - progress) * 100;
          containerRef.current.style.transform = `translateY(${yPos}vh)`;
        }
      } else if (scrollOffset > end) {
        if (scrollOffset > exitEnd) {
          containerRef.current.style.transform = 'translateY(-100vh)';
          containerRef.current.style.display = 'none'; // Optimize
        } else {
          containerRef.current.style.display = 'block';
          const progress = (scrollOffset - end) / (exitEnd - end);
          const yPos = -progress * 100;
          containerRef.current.style.transform = `translateY(${yPos}vh)`;
        }
      } else {
        containerRef.current.style.display = 'block';
        containerRef.current.style.transform = 'translateY(0vh)';
      }
      containerRef.current.style.pointerEvents = 'none'; // Never block scroll

      // 2. ROCKET & CARD ANIMATION LOOP
      // STRICT CHECK: Are we actually inside the active ladder section?
      if (scrollOffset >= start && scrollOffset <= end) {
        // REVEAL ROCKET
        avatarRef.current.style.opacity = '1';
        avatarRef.current.style.transform = 'translate(-50%, -50%) scale(1)';

        const progress = (scrollOffset - start) / (end - start);

        // Move Rocket (Bottom to Top)
        const avatarTop = 90 - 80 * progress;
        avatarRef.current.style.top = `${avatarTop}%`;

        jobs.forEach((job, index) => {
          const card = cardRefs.current[index];
          const detail = detailRefs.current[index];

          const jobPosition = index / (jobs.length - 1);
          const distance = Math.abs(progress - jobPosition);
          const visibility = Math.max(0, 1 - distance * 5);

          if (card) {
            card.style.opacity = `${visibility}`;
            card.style.transform = `translate(20px, -50%) scale(${0.8 + visibility * 0.2})`;
          }

          if (detail) {
            detail.style.opacity = `${visibility}`;
            detail.style.transform = `translateY(-50%) scale(${0.95 + visibility * 0.05})`;
            detail.style.pointerEvents = visibility > 0.5 ? 'auto' : 'none';
          }
        });
      } else {
        // HIDE ROCKET if outside the section
        avatarRef.current.style.opacity = '0';
        avatarRef.current.style.transform = 'translate(-50%, -50%) scale(0)';
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
        {/* LEFT SIDE: DETAILS */}
        <div className={styles.detailsWrapper}>
          {jobs.map((job, index) => (
            <div
              key={`detail-${job.id}`}
              ref={(el) => {
                detailRefs.current[index] = el;
              }}
              className={styles.detailCard}
            >
              <h2>{job.title}</h2>
              <h4>{job.company}</h4>
              <p>{job.details}</p>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE: ROCKET & LADDER */}
        <div className={styles.ladderLine} />

        <div ref={avatarRef} className={styles.rocket}>
          🚀
        </div>

        {/* SMALL POPUP CARDS */}
        {jobs.map((job, index) => {
          const topPos = 90 - index * (80 / (jobs.length - 1));
          return (
            <div
              key={job.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={styles.popupCard}
              style={{ top: `${topPos}%` }}
            >
              <h3>{job.date}</h3>
              <div>{job.company}</div>
            </div>
          );
        })}
      </div>
    </Html>
  );
};

export default ExperienceLadder;
