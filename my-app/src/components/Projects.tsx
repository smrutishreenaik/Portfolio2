import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const rawProjects = [
  { title: 'E-Com Core', desc: '.NET Microservices', color: '#fca5a5' },
  { title: 'Health Dash', desc: 'React & D3', color: '#86efac' },
  { title: 'Crypto Track', desc: 'WebSockets', color: '#93c5fd' },
  { title: '3D Portfolio', desc: 'Three.js', color: '#c4b5fd' },
];
const projects = [...rawProjects, ...rawProjects];

const rawCaseStudies = [
  { title: 'Bank App', desc: 'Security Audit', color: '#fcd34d' },
  { title: 'Cloud Move', desc: 'Azure Migration', color: '#fb7185' },
  { title: 'AI Chatbot', desc: 'OpenAI Integ', color: '#2dd4bf' },
  { title: 'SaaS Scale', desc: '10k to 1M Users', color: '#a78bfa' },
];
const caseStudies = [...rawCaseStudies, ...rawCaseStudies];

const Projects = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const topStripRef = useRef<HTMLDivElement>(null);
  const bottomStripRef = useRef<HTMLDivElement>(null);

  const projectTitle = 'Projects';
  const caseTitle = 'Case Studies';
  const projTitleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const caseTitleRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useFrame(() => {
    const totalPages = 18;
    const startPage = 3;
    const pinLength = 3;

    const start = startPage / totalPages;
    const end = (startPage + pinLength) / totalPages;

    if (containerRef.current && topStripRef.current && bottomStripRef.current) {
      const scrollOffset = scroll.offset;

      // 1. VISIBILITY LOGIC
      if (scrollOffset < start) {
        const entranceStart = (startPage - 1) / totalPages;
        if (scrollOffset < entranceStart) {
          containerRef.current.style.display = 'none';
        } else {
          containerRef.current.style.display = 'block';
          const progress = (scrollOffset - entranceStart) / (start - entranceStart);
          containerRef.current.style.opacity = `${Math.max(0, progress)}`;
        }
        containerRef.current.style.pointerEvents = 'none';
      } else if (scrollOffset > end) {
        const exitEnd = (startPage + pinLength + 0.2) / totalPages;
        if (scrollOffset > exitEnd) {
          containerRef.current.style.display = 'none';
        } else {
          containerRef.current.style.display = 'block';
          const progress = (scrollOffset - end) / (exitEnd - end);
          containerRef.current.style.opacity = `${1 - progress}`;
        }
        containerRef.current.style.pointerEvents = 'none';
      } else {
        containerRef.current.style.display = 'block';
        containerRef.current.style.opacity = '1';
        containerRef.current.style.pointerEvents = 'none';
      }

      // 2. ANIMATION LOGIC
      if (containerRef.current.style.display !== 'none') {
        const progress = (scrollOffset - start) / (end - start);
        const safeProgress = Math.max(0, Math.min(1, progress));

        // --- A. TEXT REVEAL LOGIC (REVERSED) ---

        // 1. CASE STUDIES (Now appears FIRST: 0.0 to 0.25)
        const caseRevealProgress = Math.min(1, safeProgress / 0.25);
        const caseCharsToShow = Math.floor(caseTitle.length * caseRevealProgress);

        caseTitleRefs.current.forEach((char, i) => {
          if (char) {
            char.style.opacity = i < caseCharsToShow ? '1' : '0';
            char.style.transform = i < caseCharsToShow ? 'translateY(0)' : 'translateY(15px)';
          }
        });

        // 2. PROJECTS (Now appears SECOND: 0.25 to 0.50)
        const projRevealProgress = Math.min(1, Math.max(0, (safeProgress - 0.25) / 0.25));
        const projCharsToShow = Math.floor(projectTitle.length * projRevealProgress);

        projTitleRefs.current.forEach((char, i) => {
          if (char) {
            char.style.opacity = i < projCharsToShow ? '1' : '0';
            char.style.transform = i < projCharsToShow ? 'translateY(0)' : 'translateY(15px)';
          }
        });

        // --- B. STRIP MOVEMENT LOGIC ---
        const totalTravel = 200;

        const xTop = -totalTravel + safeProgress * totalTravel;
        topStripRef.current.style.transform = `translateX(${xTop}vw)`;

        const xBottom = -(safeProgress * totalTravel);
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
        {/* ================= PROJECT TITLE (CENTERED) ================= */}
        <div
          style={{
            position: 'absolute',
            top: '2%',
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              margin: 0,
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              display: 'flex',
            }}
          >
            {projectTitle.split('').map((char, i) => (
              <span
                key={i}
                ref={(el) => {
                  projTitleRefs.current[i] = el;
                }}
                style={{
                  opacity: 0,
                  transform: 'translateY(15px)',
                  transition: 'opacity 0.1s, transform 0.1s',
                  marginRight: char === ' ' ? '10px' : '0',
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* ================= TOP STRIP (PROJECTS) ================= */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: 0,
            width: '100%',
            height: '40%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            ref={topStripRef}
            style={{
              display: 'flex',
              width: 'max-content',
              willChange: 'transform',
              padding: '20px 0',
            }}
          >
            {projects.map((p, i) => (
              <div
                key={i}
                style={{
                  width: '20vw',
                  marginRight: '5vw',
                  height: '30vh',
                  background: p.color,
                  borderRadius: '24px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  padding: '25px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  boxSizing: 'border-box',
                  transform: 'translateZ(0)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.8rem',
                    margin: '0 0 10px 0',
                    color: '#111',
                    textAlign: 'center',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#333',
                    textAlign: 'center',
                    lineHeight: '1.4',
                  }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CASE STUDIES TITLE (CENTERED) ================= */}
        <div
          style={{
            position: 'absolute',
            top: '52%',
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              margin: 0,
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              display: 'flex',
            }}
          >
            {caseTitle.split('').map((char, i) => (
              <span
                key={i}
                ref={(el) => {
                  caseTitleRefs.current[i] = el;
                }}
                style={{
                  opacity: 0,
                  transform: 'translateY(15px)',
                  transition: 'opacity 0.1s, transform 0.1s',
                  marginRight: char === ' ' ? '10px' : '0',
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* ================= BOTTOM STRIP (CASE STUDIES) ================= */}
        <div
          style={{
            position: 'absolute',
            top: '58%',
            left: 0,
            width: '100%',
            height: '40%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            ref={bottomStripRef}
            style={{
              display: 'flex',
              width: 'max-content',
              willChange: 'transform',
              padding: '20px 0',
            }}
          >
            {caseStudies.map((c, i) => (
              <div
                key={i}
                style={{
                  width: '20vw',
                  marginRight: '5vw',
                  height: '30vh',
                  background: 'white',
                  border: `3px solid ${c.color}`,
                  borderRadius: '24px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                  padding: '25px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  boxSizing: 'border-box',
                  transform: 'translateZ(0)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.8rem',
                    margin: '0 0 10px 0',
                    color: '#111',
                    textAlign: 'center',
                  }}
                >
                  {c.title}
                </h3>
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#666',
                    textAlign: 'center',
                    lineHeight: '1.4',
                  }}
                >
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Projects;
