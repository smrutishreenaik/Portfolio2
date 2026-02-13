import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

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

      // ==========================================
      // 1. SLIDING LOGIC (Rise from Bottom)
      // ==========================================

      if (scrollOffset < start) {
        // --- ENTRANCE PHASE ---
        if (scrollOffset < entranceStart) {
          // Hidden below screen
          containerRef.current.style.transform = 'translateY(100vh)';
          containerRef.current.style.pointerEvents = 'none';
        } else {
          // Rising Up: 100vh -> 0vh
          const progress = (scrollOffset - entranceStart) / (start - entranceStart);
          const yPos = (1 - progress) * 100;
          containerRef.current.style.transform = `translateY(${yPos}vh)`;
          containerRef.current.style.pointerEvents = 'none';
        }
      } else if (scrollOffset > end) {
        // --- EXIT PHASE ---
        if (scrollOffset > exitEnd) {
          // Hidden above screen
          containerRef.current.style.transform = 'translateY(-100vh)';
          containerRef.current.style.pointerEvents = 'none';
        } else {
          // Rising Out: 0vh -> -100vh
          const progress = (scrollOffset - end) / (exitEnd - end);
          const yPos = -progress * 100;
          containerRef.current.style.transform = `translateY(${yPos}vh)`;
          containerRef.current.style.pointerEvents = 'none';
        }
      } else {
        // --- ACTIVE PHASE ---
        containerRef.current.style.transform = 'translateY(0vh)';
        containerRef.current.style.pointerEvents = 'none';
      }

      // ==========================================
      // 2. ROCKET & CARD ANIMATION
      // ==========================================
      if (scrollOffset >= start && scrollOffset <= end) {
        const progress = (scrollOffset - start) / (end - start);

        // Rocket moves Bottom (90%) to Top (10%)
        const avatarTop = 90 - 80 * progress;
        avatarRef.current.style.top = `${avatarTop}%`;

        jobs.forEach((job, index) => {
          const card = cardRefs.current[index];
          const detail = detailRefs.current[index];

          const jobPosition = index / (jobs.length - 1);
          const distance = Math.abs(progress - jobPosition);
          const visibility = Math.max(0, 1 - distance * 5);

          // Update Small Card (Right)
          if (card) {
            card.style.opacity = `${visibility}`;
            card.style.transform = `scale(${0.8 + visibility * 0.2}) translateX(20px)`;
          }

          // Update Big Details Card (Left)
          if (detail) {
            detail.style.opacity = `${visibility}`;
            detail.style.transform = `translateY(-50%) scale(${0.95 + visibility * 0.05})`;
            detail.style.boxShadow = `0 ${20 + visibility * 10}px ${40 + visibility * 10}px -10px rgba(0,0,0,${0.1 + visibility * 0.1})`;
          }
        });
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
          position: 'relative',

          // --- CHANGE 1: SOLID WHITE BACKGROUND ---
          background: '#ffffff',

          willChange: 'transform',
        }}
      >
        {/* ================= LEFT SIDE: DETAILS ================= */}
        <div
          style={{
            position: 'absolute',
            left: '10%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50%',
            height: 'auto',
            pointerEvents: 'none',
            display: 'grid',
            placeItems: 'center start',
          }}
        >
          {jobs.map((job, index) => (
            <div
              key={`detail-${job.id}`}
              ref={(el) => {
                detailRefs.current[index] = el;
              }}
              style={{
                gridArea: '1 / 1',
                opacity: 0,
                transition: 'opacity 0.1s linear, box-shadow 0.1s linear',
                transform: 'translateY(-50%)',
                width: '100%',
                background: 'white', // Cards match background
                padding: '40px',

                // --- CHANGE 2: DARK TEXT & STYLING ---
                border: '1px solid #eee', // Subtle border for definition
                borderRadius: '24px',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
              }}
            >
              <h2 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: '#111' }}>{job.title}</h2>
              <h4
                style={{
                  fontSize: '1.5rem',
                  margin: '0 0 20px 0',
                  color: '#555',
                  fontWeight: '400',
                }}
              >
                {job.company}
              </h4>
              <p
                style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#333', maxWidth: '600px' }}
              >
                {job.details}
              </p>
            </div>
          ))}
        </div>

        {/* ================= RIGHT SIDE: ROCKET & LADDER ================= */}

        {/* THE LADDER LINE */}
        <div
          style={{
            position: 'absolute',
            left: '80%',
            top: '10%',
            bottom: '10%',
            width: '4px',
            // Made slightly darker so it's visible on white
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '2px',
          }}
        />

        {/* THE CLIMBER (Rocket) */}
        <div
          ref={avatarRef}
          style={{
            position: 'absolute',
            left: '80%',
            top: '90%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            background: '#3b82f6',
            borderRadius: '50%',
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          🚀
        </div>

        {/* THE SMALL CARDS (Popups) */}
        {jobs.map((job, index) => {
          const topPos = 90 - index * (80 / (jobs.length - 1));

          return (
            <div
              key={job.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              style={{
                position: 'absolute',
                top: `${topPos}%`,
                left: '80%',
                transform: `translate(20px, -50%)`,
                marginLeft: '40px',
                width: '180px',
                padding: '15px',
                background: 'white',
                borderRadius: '12px',

                // Dark text for small cards too
                color: '#111',
                border: '1px solid #f0f0f0',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',

                opacity: 0,
                transition: 'transform 0.1s linear',
                textAlign: 'left',
                pointerEvents: 'none',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#111' }}>{job.date}</h3>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>{job.company}</div>
            </div>
          );
        })}
      </div>
    </Html>
  );
};

export default ExperienceLadder;
