import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const projects = [
  { title: 'E-Commerce Core', description: 'Microservices & .NET', color: '#fca5a5' },
  { title: 'Health Dashboard', description: 'React & D3.js', color: '#86efac' },
  { title: 'Crypto Tracker', description: 'WebSockets & Real-time', color: '#93c5fd' },
  { title: '3D Portfolio', description: 'R3F & Three.js', color: '#c4b5fd' },
];

const Projects = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 12; // Must match App.tsx
    const startPage = 2; // Starts after Intro/Bio
    const pinLength = 3; // Lasts for 3 pages
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + pinLength) / totalPages;

    if (containerRef.current) {
      const scrollOffset = scroll.offset;

      // 1. VISIBILITY (Fade In/Out)
      if (scrollOffset < start) {
        // Entrance: Fade in as we approach startPage
        const entranceStart = (startPage - 1) / totalPages;
        const progress = (scrollOffset - entranceStart) / (start - entranceStart);
        containerRef.current.style.opacity = `${Math.max(0, progress)}`;
        containerRef.current.style.pointerEvents = 'none';
      } else if (scrollOffset > end) {
        // Exit: Fade out
        const exitEnd = (startPage + pinLength + 0.5) / totalPages;
        const progress = (scrollOffset - end) / (exitEnd - end);
        containerRef.current.style.opacity = `${1 - progress}`;
        containerRef.current.style.pointerEvents = 'none';
      } else {
        // Active
        containerRef.current.style.opacity = '1';
        // Allow pointer events if you want clickable projects
        containerRef.current.style.pointerEvents = 'none';
      }

      // 2. HORIZONTAL SCROLL LOGIC
      // We are "In the zone" (between start and end)
      if (scrollOffset >= start && scrollOffset <= end) {
        // Calculate how far we are through the section (0 to 1)
        const progress = (scrollOffset - start) / (end - start);

        // --- MATH EXPLAINED ---
        // 100vw = Width of one screen
        // 400vw = Total width of our project strip (4 projects * 100vw)
        // We want to move from 0 to -300vw (so the last project aligns with screen)
        const totalMovement = (projects.length - 1) * 100;
        const translateX = progress * totalMovement;

        // Apply negative translateX to move strip LEFT (standard horizontal scroll)
        // To reverse direction (Left-to-Right), remove the '-' sign.
        containerRef.current.style.transform = `translateX(-${translateX}vw)`;
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
        overflow: 'hidden', // Hide the overflowing projects
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100vh',
          // The container is super wide to hold all projects horizontally
          width: `${projects.length * 100}vw`,
          display: 'flex',
          zIndex: 500, // Below Testimonials (1000) but above Overlay
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      >
        {projects.map((p, i) => (
          <div
            key={i}
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Project Card */}
            <div
              style={{
                width: '80%',
                height: '70%',
                background: p.color,
                borderRadius: '20px',
                padding: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h1 style={{ fontSize: '4rem', color: '#111' }}>{p.title}</h1>
              <p style={{ fontSize: '1.5rem', color: '#333' }}>{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Html>
  );
};

export default Projects;
