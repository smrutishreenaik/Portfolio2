import { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Senior Architect',
    text: 'Top notch Microservices work. Really impressed by the system design.',
    color: '#e0f2fe',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'Product Manager',
    text: 'Delivered the Azure migration 2 weeks ahead of schedule.',
    color: '#fef3c7',
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Tech Lead',
    text: 'Incredible attention to detail in the frontend and 3D interactions.',
    color: '#dcfce7',
  },
  {
    id: 4,
    name: 'Emily Davis',
    role: 'CTO',
    text: 'A true full-stack talent. Can handle DB optimization with ease.',
    color: '#fce7f3',
  },
];

const Testimonials = () => {
  const scroll = useScroll();

  // Create refs for each card to control them individually
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    // START CONFIGURATION
    const startPage = 2; // The scroll page where testimonials start
    const duration = 1; // How many "pages" of scrolling it takes to show all cards
    // END CONFIGURATION

    testimonials.forEach((_, index) => {
      const card = cardRefs.current[index];
      if (!card) return;

      // 1. Calculate the trigger point for this specific card
      // We stagger them: Card 1 starts at 0, Card 2 at 0.25, etc.
      const step = 1 / testimonials.length;
      const cardStart = startPage / 8 + index * step * (duration / 8);

      // 2. Get the range (0 to 1) for this card's animation
      // The 'true' at the end prevents the value from going back to 0 if you scroll past it
      const range = scroll.range(cardStart, 1 / 8);

      // New Logic:
      // 1. Define the gap (e.g., 3vh or about 30px)
      const gap = 3;

      // 2. Calculate offset: Card 0 -> 0vh, Card 1 -> 3vh, Card 2 -> 6vh
      const offset = index * gap;

      // 3. Adjust calculation:
      // When range is 1 (fully scrolled), the card lands at 'offset' instead of 0.
      // We start from 100vh (bottom) + offset.
      const translateY = (1 - range) * 100 + offset;

      card.style.transform = `translateY(${translateY}vh)`;
      card.style.opacity = `${range}`; // Fade in as it slides up
    });
  });

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2
        style={{
          position: 'absolute',
          top: '10%',
          color: 'white',
          fontSize: '3rem',
          zIndex: 0,
        }}
      >
        What People Say
      </h2>

      {testimonials.map((t, index) => (
        <div
          key={t.id}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
          style={{
            position: 'absolute', // Stack them all on top of each other
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
            zIndex: index + 1, // Ensure standard stacking order
            // Initial State (will be overridden by useFrame immediately)
            transform: 'translateY(100vh)',
            opacity: 0,
            willChange: 'transform, opacity', // Performance optimization
          }}
        >
          <p style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '20px', color: '#333' }}>
            "{t.text}"
          </p>
          <div style={{ marginTop: 'auto' }}>
            <strong style={{ color: '#111', display: 'block' }}>{t.name}</strong>
            <span style={{ fontSize: '0.9rem', color: '#555' }}>{t.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
