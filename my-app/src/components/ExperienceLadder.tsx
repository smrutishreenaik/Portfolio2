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
    const totalPages = 18;
    const startPage = 7;
    const duration = 3;
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;
    const scrollOffset = scroll.offset;

    if (containerRef.current && avatarRef.current) {
      const safeZone = 6.5 / totalPages;
      if (scrollOffset < safeZone) {
        containerRef.current.style.opacity = '0';
        containerRef.current.style.pointerEvents = 'none';
      }
      // 1. VISIBILITY LOGIC
      else if (scrollOffset < start) {
        const entranceStart = safeZone;
        const fade = (scrollOffset - entranceStart) / (start - entranceStart);
        containerRef.current.style.opacity = `${Math.max(0, fade)}`;
        containerRef.current.style.pointerEvents = 'none';
      } else if (scrollOffset > end) {
        const exitEnd = (startPage + duration + 0.5) / totalPages;
        const fade = (scrollOffset - end) / (exitEnd - end);
        containerRef.current.style.opacity = `${1 - fade}`;
        containerRef.current.style.pointerEvents = 'none';
      } else {
        containerRef.current.style.opacity = '1';
        containerRef.current.style.pointerEvents = 'none';
      }

      // 2. ANIMATION LOOP
      if (scrollOffset >= start && scrollOffset <= end) {
        const progress = (scrollOffset - start) / (end - start);

        // --- ROCKET LOGIC (Moves Bottom to Top) ---
        const avatarTop = 90 - 80 * progress;
        avatarRef.current.style.top = `${avatarTop}%`;

        // --- CARDS & DETAILS LOGIC ---
        jobs.forEach((job, index) => {
          const card = cardRefs.current[index];
          const detail = detailRefs.current[index];

          // Calculate Timing
          const jobPosition = index / (jobs.length - 1);
          const distance = Math.abs(progress - jobPosition);

          // Visibility Bell Curve (Tightened for distinct phases)
          const visibility = Math.max(0, 1 - distance * 5);

          // Update Ladder Card (Small Popup)
          if (card) {
            card.style.opacity = `${visibility}`;
            // Pop out to the RIGHT (20px)
            card.style.transform = `scale(${0.8 + visibility * 0.2}) translateX(20px)`;
          }

          // Update Details Text (Big Description Card)
          if (detail) {
            detail.style.opacity = `${visibility}`;
            // Fade in place (Scale effect only)
            detail.style.transform = `translateY(-50%) scale(${0.95 + visibility * 0.05})`;
            // Ensure only the active one handles pointer events
            detail.style.pointerEvents = visibility > 0.5 ? 'none' : 'none';
            // Add a subtle shadow pop when active
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
        style={{ width: '100%', height: '100%', position: 'relative', opacity: 0 }}
      >
        {/* ================= LEFT SIDE: DETAILS (CENTERED CARD) ================= */}
        <div
          style={{
            position: 'absolute',
            left: '10%',
            top: '50%', // CENTERED VERTICALLY
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

                // --- CARD STYLING ADDED HERE ---
                background: 'white',
                padding: '40px',
                borderRadius: '24px',
                // Initial soft shadow (animated in useFrame)
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                // -------------------------------
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
              {/* Removed the borderLeft from here as it looks cleaner inside the card */}
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

                // POPUP TO THE RIGHT
                transform: `translate(20px, -50%)`,
                marginLeft: '40px',

                width: '180px',
                padding: '15px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
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
