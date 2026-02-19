import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/Projects.module.scss'; // <--- Import Styles

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
    const totalPages = 17;
    const startPage = 4;
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

        // --- A. TEXT REVEAL LOGIC ---

        // 1. CASE STUDIES (0.0 to 0.25)
        const caseRevealProgress = Math.min(1, safeProgress / 0.25);
        const caseCharsToShow = Math.floor(caseTitle.length * caseRevealProgress);

        caseTitleRefs.current.forEach((char, i) => {
          if (char) {
            char.style.opacity = i < caseCharsToShow ? '1' : '0';
            char.style.transform = i < caseCharsToShow ? 'translateY(0)' : 'translateY(15px)';
          }
        });

        // 2. PROJECTS (0.25 to 0.50)
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
      className={styles.htmlWrapper}
    >
      <div ref={containerRef} className={styles.container}>
        {/* ================= PROJECT TITLE (CENTERED) ================= */}
        <div className={`${styles.titleWrapper} ${styles.top}`}>
          <h1 className={styles.mainTitle}>
            {projectTitle.split('').map((char, i) => (
              <span
                key={i}
                ref={(el) => {
                  projTitleRefs.current[i] = el;
                }}
                className={`${styles.char} ${char === ' ' ? styles.space : ''}`}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* ================= TOP STRIP (PROJECTS) ================= */}
        <div className={`${styles.stripContainer} ${styles.top}`}>
          <div ref={topStripRef} className={styles.strip}>
            {projects.map((p, i) => (
              <div
                key={i}
                className={`${styles.card} ${styles.projectCard}`}
                style={{ background: p.color }} // Dynamic Color
              >
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CASE STUDIES TITLE (CENTERED) ================= */}
        <div className={`${styles.titleWrapper} ${styles.bottom}`}>
          <h1 className={styles.mainTitle}>
            {caseTitle.split('').map((char, i) => (
              <span
                key={i}
                ref={(el) => {
                  caseTitleRefs.current[i] = el;
                }}
                className={`${styles.char} ${char === ' ' ? styles.space : ''}`}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* ================= BOTTOM STRIP (CASE STUDIES) ================= */}
        <div className={`${styles.stripContainer} ${styles.bottom}`}>
          <div ref={bottomStripRef} className={styles.strip}>
            {caseStudies.map((c, i) => (
              <div
                key={i}
                className={`${styles.card} ${styles.caseStudyCard}`}
                style={{ border: `3px solid ${c.color}` }} // Dynamic Border Color
              >
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Projects;
