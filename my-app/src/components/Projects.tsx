import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/Projects.module.scss';

// Updated data with Images and 10-word notes
const rawProjects = [
  {
    title: 'E-Com Core',
    note: 'Scalable .NET microservices handling thousands of daily transactions seamlessly.',
    image:
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Health Dash',
    note: 'Interactive React and D3 dashboards for real-time patient monitoring analytics.',
    image:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Crypto Track',
    note: 'High-performance WebSocket integration delivering live cryptocurrency market data updates.',
    image:
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: '3D Portfolio',
    note: 'Immersive WebGL experience built with Three.js and React Fiber.',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
];
const projects = [...rawProjects, ...rawProjects];

const rawCaseStudies = [
  {
    title: 'Bank App',
    note: 'Comprehensive security audit and penetration testing for financial mobile application.',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Cloud Move',
    note: 'Flawless zero-downtime migration of legacy systems to Microsoft Azure infrastructure.',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'AI Chatbot',
    note: 'OpenAI integration streamlining customer support workflows and reducing response times.',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'SaaS Scale',
    note: 'Architectural overhaul scaling a startup platform from 10k to 1M users.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
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
        const caseRevealProgress = Math.min(1, safeProgress / 0.25);
        const caseCharsToShow = Math.floor(caseTitle.length * caseRevealProgress);

        caseTitleRefs.current.forEach((char, i) => {
          if (char) {
            char.style.opacity = i < caseCharsToShow ? '1' : '0';
            char.style.transform = i < caseCharsToShow ? 'translateY(0)' : 'translateY(15px)';
          }
        });

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
        {/* ================= PROJECT TITLE ================= */}
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
              <div key={i} className={styles.card}>
                <img src={p.image} alt={p.title} className={styles.cardImage} />
                <div className={styles.cardOverlay} />

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardNote}>{p.note}</p>
                  <button type='button' className={styles.viewButton}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CASE STUDIES TITLE ================= */}
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
              <div key={i} className={styles.card}>
                <img src={c.image} alt={c.title} className={styles.cardImage} />
                <div className={styles.cardOverlay} />

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <p className={styles.cardNote}>{c.note}</p>
                  <button type='button' className={styles.viewButton}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Projects;
