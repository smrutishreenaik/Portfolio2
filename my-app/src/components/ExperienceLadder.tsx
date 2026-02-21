import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import styles from '../styles/ExperienceLadder.module.scss';

// --- UPDATED DATA WITH URLS AND .NET PROGRESSION ---
const jobs = [
  {
    id: 1,
    title: 'Software Developer',
    company: 'Tech Solutions Inc',
    url: 'https://example.com/tech-solutions', // Add your actual links here!
    date: '2022 - 2024',
    details:
      'Developed and maintained enterprise applications using C# and ASP.NET. Collaborated with the team to design database schemas in SQL Server and implemented RESTful APIs.',
  },
  {
    id: 2,
    title: 'Full-Stack .NET Developer',
    company: 'Innovate Corp',
    url: 'https://example.com/innovate',
    date: '2024 - Present',
    details:
      'Leading the development of full-stack features utilizing .NET Core Web API, Entity Framework, and React. Architecting scalable cloud solutions deployed on Azure with automated CI/CD pipelines.',
  },
  {
    id: 3,
    title: 'Senior Architect',
    company: 'Big Data Systems',
    date: '2023 - Present',
    url: 'https://example.com/innovate',
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
    // ... (Keep ALL your useFrame animation logic exactly the same) ...
    const totalPages = 17;
    const startPage = 8;
    const duration = 3;

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;
    const scrollOffset = scroll.offset;

    if (containerRef.current && avatarRef.current) {
      const entranceStart = (startPage - 1) / totalPages;
      const exitEnd = (startPage + duration + 1) / totalPages;

      if (scrollOffset < start) {
        if (scrollOffset < entranceStart) {
          containerRef.current.style.transform = 'translateY(100vh)';
          containerRef.current.style.display = 'none';
        } else {
          containerRef.current.style.display = 'block';
          const progress = (scrollOffset - entranceStart) / (start - entranceStart);
          const yPos = (1 - progress) * 100;
          containerRef.current.style.transform = `translateY(${yPos}vh)`;
        }
      } else if (scrollOffset > end) {
        if (scrollOffset > exitEnd) {
          containerRef.current.style.transform = 'translateY(-100vh)';
          containerRef.current.style.display = 'none';
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
      containerRef.current.style.pointerEvents = 'none';

      if (scrollOffset >= start && scrollOffset <= end) {
        avatarRef.current.style.opacity = '1';
        avatarRef.current.style.transform = 'translate(-50%, -50%) scale(1)';

        const progress = (scrollOffset - start) / (end - start);
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
    >
      <div ref={containerRef} className={styles.container}>
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

              {/* --- NEW: Clickable Company Link with External SVG Arrow --- */}
              <h4>
                <a
                  href={job.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.companyLink}
                >
                  {job.company}
                  <svg
                    className={styles.linkIcon}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                    <polyline points='15 3 21 3 21 9'></polyline>
                    <line x1='10' y1='14' x2='21' y2='3'></line>
                  </svg>
                </a>
              </h4>

              <p>{job.details}</p>
            </div>
          ))}
        </div>

        <div className={styles.ladderLine} />

        <div ref={avatarRef} className={styles.rocket}>
          🚀
        </div>

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
