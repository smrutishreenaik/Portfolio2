import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const jobs = [
  { id: 1, title: 'Junior Dev', company: 'Startup Inc', date: '2020 - 2021', side: 'left' },
  { id: 2, title: 'Mid-Level Engineer', company: 'Tech Corp', date: '2021 - 2023', side: 'right' },
  {
    id: 3,
    title: 'Senior Architect',
    company: 'Big Data Systems',
    date: '2023 - Present',
    side: 'left',
  },
];

const ExperienceLadder = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // We need refs for the cards to trigger animations
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 18; // Increased total pages in App.tsx
    const startPage = 7; // Starts after Projects
    const duration = 3; // Lasts for 3 pages
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;
    const scrollOffset = scroll.offset;

    if (containerRef.current && avatarRef.current) {
      // 1. VISIBILITY LOGIC (Same as others)
      if (scrollOffset < start) {
        // Entrance
        const entranceStart = (startPage - 0.5) / totalPages;
        const fade = (scrollOffset - entranceStart) / (start - entranceStart);
        containerRef.current.style.opacity = `${Math.max(0, fade)}`;
        containerRef.current.style.pointerEvents = 'none';
      } else if (scrollOffset > end) {
        // Exit
        const exitEnd = (startPage + duration + 0.2) / totalPages;
        const fade = (scrollOffset - end) / (exitEnd - end);
        containerRef.current.style.opacity = `${1 - fade}`;
        containerRef.current.style.pointerEvents = 'none';
      } else {
        // Active
        containerRef.current.style.opacity = '1';
        containerRef.current.style.pointerEvents = 'none';
      }

      // 2. CLIMBING LOGIC
      if (scrollOffset >= start && scrollOffset <= end) {
        // 'progress' goes from 0 to 1 as we scroll through this section
        const progress = (scrollOffset - start) / (end - start);

        // Invert it: We want to start at Bottom (90%) and move to Top (10%)
        // Formula: StartPos - (Distance * Progress)
        const avatarTop = 90 - 80 * progress;

        avatarRef.current.style.top = `${avatarTop}%`;

        // 3. TRIGGER CARDS
        // We check where the avatar is relative to the "zones"
        jobs.forEach((job, index) => {
          const card = cardRefs.current[index];
          if (!card) return;

          // Each job sits at a specific height (e.g., 33%, 66%, etc.)
          // We map the job index to a position on the ladder (0 to 1)
          const jobPosition = index / (jobs.length - 1);

          // But visually, Job 1 is at bottom, Job 3 is at top.
          // So Job 1 triggers when progress is low (~0.1), Job 3 when high (~0.9)

          // Calculate distance between current Scroll Progress and Job's "Time"
          const distance = Math.abs(progress - jobPosition);

          // If we are close (within 15% range), show the card
          // We use a bell curve logic for smooth pop-in/pop-out
          const visibility = Math.max(0, 1 - distance * 4);

          card.style.opacity = `${visibility}`;
          card.style.transform = `scale(${0.8 + visibility * 0.2}) translateX(${job.side === 'left' ? '-10px' : '10px'})`;
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
        {/* THE LADDER (Vertical Line) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '10%',
            bottom: '10%',
            width: '4px',
            background: 'rgba(0,0,0,0.1)',
            transform: 'translateX(-50%)',
            borderRadius: '2px',
          }}
        />

        {/* THE CLIMBER (Avatar) */}
        <div
          ref={avatarRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '90%', // Starts at bottom
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            background: '#3b82f6', // Blue Avatar
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
          🚀 {/* Cartoon Icon */}
        </div>

        {/* THE EXPERIENCE CARDS */}
        {jobs.map((job, index) => {
          // Calculate fixed positions for the cards based on the ladder height
          // Job 1 (index 0) = Bottom (90%), Job 3 (index 2) = Top (10%)
          const topPos = 90 - index * (80 / (jobs.length - 1));

          return (
            <div
              key={job.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              style={{
                position: 'absolute',
                top: `${topPos}%`, // Fixed position on screen
                left: '50%',
                // If side is left, move left (-350px), else move right
                transform: `translate(${job.side === 'left' ? '-120%' : '20%'}, -50%)`,
                width: '300px',
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
                opacity: 0, // Hidden by default, handled by useFrame
                transition: 'transform 0.1s linear', // Smooth scale effect
                textAlign: job.side === 'left' ? 'right' : 'left',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#111' }}>{job.title}</h3>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                {job.company}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#999', fontWeight: 'bold' }}>
                {job.date}
              </div>
            </div>
          );
        })}
      </div>
    </Html>
  );
};

export default ExperienceLadder;
