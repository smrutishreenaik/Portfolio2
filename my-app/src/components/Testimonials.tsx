import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Senior Architect',
    text: 'Top notch Microservices work.',
    color: '#e0f2fe',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'Product Manager',
    text: 'Delivered the Azure migration ahead of time.',
    color: '#fef3c7',
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Tech Lead',
    text: 'Incredible attention to detail in the frontend.',
    color: '#dcfce7',
  },
  { id: 4, name: 'Emily Davis', role: 'CTO', text: 'A true full-stack talent.', color: '#fce7f3' },
];

const Testimonials = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    // --- TIMING CONFIGURATION ---
    const totalPages = 10;
    const startPage = 2;
    const pinLength = 4;
    // ----------------------------

    const start = startPage / totalPages;
    const end = (startPage + pinLength) / totalPages;

    if (containerRef.current) {
      const scrollOffset = scroll.offset;

      // 1. CONTAINER VISIBILITY LOGIC
      if (scrollOffset < start) {
        const entranceStart = (startPage - 1) / totalPages;
        const progress = (scrollOffset - entranceStart) / (start - entranceStart);
        containerRef.current.style.opacity = `${Math.max(0, progress)}`;
        containerRef.current.style.pointerEvents = 'none';
      } else if (scrollOffset > end) {
        const exitEnd = (startPage + pinLength + 1) / totalPages;
        const progress = (scrollOffset - end) / (exitEnd - end);
        containerRef.current.style.opacity = `${1 - progress}`;
        containerRef.current.style.pointerEvents = 'none';
      } else {
        containerRef.current.style.opacity = '1';
        containerRef.current.style.pointerEvents = 'auto';
      }
    }

    // 2. CARD ANIMATION LOGIC
    testimonials.forEach((_, index) => {
      const card = cardRefs.current[index];
      if (!card) return;

      const relativeStart = startPage + index * (pinLength / testimonials.length);
      const cardStart = relativeStart / totalPages;
      const cardDuration = pinLength / testimonials.length / totalPages;

      const range = scroll.range(cardStart, cardDuration);
      const gap = 4;
      const offset = index * gap;

      const translateY = (1 - range) * 100 + offset;

      card.style.transform = `translateY(${translateY}vh)`;
      card.style.opacity = `${range}`;
    });
  });

  return (
    <Html
      portal={{ current: document.body }}
      // 1. REMOVE 'fullscreen' (It seems to be failing you)
      // 2. Add 'calculatePosition' to force it to lock to center
      calculatePosition={() => [0, 0]}
      style={{
        pointerEvents: 'none',
        // 3. FORCE the wrapper to be top-left of the screen
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
          position: 'absolute',
          top: '50%', // Move to vertical middle
          left: '50%', // Move to horizontal middle
          // 4. CRITICAL: Pull it back by half its width/height to center it
          transform: 'translate(-50%, -50%)',

          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}
      >
        {/* ... (Rest of your content remains the same) ... */}

        <h2
          style={{ position: 'absolute', top: '10%', color: 'white', fontSize: '3rem', zIndex: 0 }}
        >
          What People Say
        </h2>

        {testimonials.map((t, index) => (
          /* ... existing card code ... */
          <div
            key={t.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            style={{
              // ... keep your existing card styles ...
              position: 'absolute',
              width: '80vw',
              maxWidth: '600px',
              height: '350px',
              backgroundColor: t.color,
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: index + 1,
              transform: 'translateY(100vh)', // This will be overwritten by JS, which is fine
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            {/* ... content ... */}
            <p
              style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '20px', color: '#333' }}
            >
              "{t.text}"
            </p>
            <div style={{ marginTop: 'auto' }}>
              <strong style={{ color: '#111', display: 'block' }}>{t.name}</strong>
              <span style={{ fontSize: '0.9rem', color: '#555' }}>{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </Html>
  );
};

export default Testimonials;
