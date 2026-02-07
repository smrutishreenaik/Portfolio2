import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// 1. DATA: We repeat the data 3 times to create an "Infinite Strip" illusion
// This ensures the screen is always full, with no empty spaces on sides.
const rawProjects = [
  { title: 'E-Com Core', desc: '.NET Microservices', color: '#fca5a5' },
  { title: 'Health Dash', desc: 'React & D3', color: '#86efac' },
  { title: 'Crypto Track', desc: 'WebSockets', color: '#93c5fd' },
  { title: '3D Portfolio', desc: 'Three.js', color: '#c4b5fd' },
];
const projects = [...rawProjects, ...rawProjects, ...rawProjects];

const rawCaseStudies = [
  { title: 'Bank App', desc: 'Security Audit', color: '#fcd34d' },
  { title: 'Cloud Move', desc: 'Azure Migration', color: '#fb7185' },
  { title: 'AI Chatbot', desc: 'OpenAI Integ', color: '#2dd4bf' },
  { title: 'SaaS Scale', desc: '10k to 1M Users', color: '#a78bfa' },
];
const caseStudies = [...rawCaseStudies, ...rawCaseStudies, ...rawCaseStudies];

const Projects = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const topStripRef = useRef<HTMLDivElement>(null);
  const bottomStripRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const totalPages = 20;
    const startPage = 3;
    const pinLength = 3;

    const start = startPage / totalPages;
    const end = (startPage + pinLength) / totalPages;

    if (containerRef.current && topStripRef.current && bottomStripRef.current) {
      const scrollOffset = scroll.offset;

      // 1. VISIBILITY LOGIC
      if (scrollOffset < start) {
        // CASE A: Before the section (Intro/Bio)
        const entranceStart = (startPage - 1) / totalPages;

        // If we are REALLY far before (like at page 0 or 1), HIDE IT COMPLETELY
        if (scrollOffset < entranceStart) {
          containerRef.current.style.display = 'none'; // <--- KEY FIX
        } else {
          // We are approaching (Page 1.5 - 2.0), allow it to exist but be transparent
          containerRef.current.style.display = 'block';
          const progress = (scrollOffset - entranceStart) / (start - entranceStart);
          containerRef.current.style.opacity = `${Math.max(0, progress)}`;
        }
        containerRef.current.style.pointerEvents = 'none';
      } else if (scrollOffset > end) {
        // CASE B: After the section (Experience/Testimonials)
        const exitEnd = (startPage + pinLength + 0.2) / totalPages;

        // If we are fully past the exit animation, HIDE IT
        if (scrollOffset > exitEnd) {
          containerRef.current.style.display = 'none'; // <--- KEY FIX
        } else {
          containerRef.current.style.display = 'block';
          const progress = (scrollOffset - end) / (exitEnd - end);
          containerRef.current.style.opacity = `${1 - progress}`;
        }
        containerRef.current.style.pointerEvents = 'none';
      } else {
        // CASE C: Active Section (We are looking at it)
        containerRef.current.style.display = 'block';
        containerRef.current.style.opacity = '1';
        // Only here do we allow clicks (if you want cards to be clickable)
        // Note: Even with this, scrolling might feel 'heavy' over cards.
        // It's usually safer to keep this 'none' unless you absolutely need click interactions.
        containerRef.current.style.pointerEvents = 'none';
      }

      // 2. MOVEMENT LOGIC (Only run if visible)
      if (containerRef.current.style.display !== 'none') {
        // ... (Keep your existing movement math here) ...
        const progress = (scrollOffset - start) / (end - start);
        const totalTravel = 200;

        const xTop = -totalTravel + progress * totalTravel;
        topStripRef.current.style.transform = `translateX(${xTop}vw)`;

        const xBottom = -(progress * totalTravel);
        bottomStripRef.current.style.transform = `translateX(${xBottom}vw)`;
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
        overflow: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          opacity: 0,
        }}
      >
        {/* ================= TOP STRIP (PROJECTS) ================= */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '50%',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '4px solid white', // Separator line
            background: '#fff',
          }}
        >
          <div
            ref={topStripRef}
            style={{
              display: 'flex',
              // Use max-content so the div expands to fit all children exactly
              width: 'max-content',
              willChange: 'transform',
            }}
          >
            {projects.map((p, i) => (
              <div
                key={i}
                style={{
                  // FIXED WIDTH: 4 cards fill the screen exactly (100/4 = 25)
                  width: '25vw',
                  height: '50vh', // Full height of the strip
                  background: p.color,
                  // NO MARGINS (Continuous)
                  margin: 0,
                  // Border right to distinguish cards
                  borderRight: '1px solid rgba(0,0,0,0.1)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  boxSizing: 'border-box', // Important so padding doesn't break width
                }}
              >
                <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#111', textAlign: 'center' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#444', textAlign: 'center' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BOTTOM STRIP (CASE STUDIES) ================= */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '50%',
            display: 'flex',
            alignItems: 'center',
            background: '#fafafa',
          }}
        >
          <div
            ref={bottomStripRef}
            style={{
              display: 'flex',
              width: 'max-content',
              willChange: 'transform',
            }}
          >
            {caseStudies.map((c, i) => (
              <div
                key={i}
                style={{
                  width: '25vw',
                  height: '50vh',
                  background: 'white',
                  // Visual Style for Case Studies
                  borderRight: '1px solid #eee',
                  borderTop: `4px solid ${c.color}`,
                  margin: 0,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#111', textAlign: 'center' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Projects;
