import { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Contact = () => {
  const scroll = useScroll();

  const text = "Let's work together.";
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const formRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  //const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useFrame(() => {
    // --- SETTINGS ---
    const totalPages = 20;
    const startPage = 19;
    const duration = 1;
    // ----------------

    const start = startPage / totalPages;
    const end = (startPage + duration) / totalPages;

    if (containerRef.current && cardRef.current) {
      const scrollOffset = scroll.offset;

      // 1. VISIBILITY & RISING ANIMATION
      // Show slightly before the start page so we can see it rising
      if (scrollOffset < start - 1 / totalPages) {
        containerRef.current.style.display = 'none';
        containerRef.current.style.pointerEvents = 'none';
      } else {
        containerRef.current.style.display = 'flex';
        // Disable events on the wrapper to allow scrolling on the sides
        containerRef.current.style.pointerEvents = 'none';

        // Calculate Rise Progress
        const riseStart = (startPage - 1) / totalPages;
        const riseEnd = start;

        const riseProgress = (scrollOffset - riseStart) / (riseEnd - riseStart);
        const cleanRise = Math.max(0, Math.min(1, riseProgress));

        // MOVEMENT: Slide from 100vh (bottom) to 0vh (center)
        const translateY = (1 - cleanRise) * 100;
        cardRef.current.style.transform = `translateY(${translateY}vh)`;

        // OPACITY FIX: Force it to always be 1 (Opaque)
        // It will just slide up, fully visible
        cardRef.current.style.opacity = '1';
      }

      // 2. INNER CONTENT ANIMATION (Text & Form)
      // These still fade in/out as requested previously
      if (scrollOffset > start - 0.5 / totalPages) {
        const relativeProgress = (scrollOffset - start) / (end - start);
        const clampedProgress = Math.max(0, Math.min(1, relativeProgress));
        const charsToShow = Math.floor(text.length * clampedProgress);

        // Animate Text Characters
        charRefs.current.forEach((char, index) => {
          if (!char) return;
          if (index < charsToShow) {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0px)';
            char.style.color = '#fff';
          } else {
            char.style.opacity = '0.1';
            char.style.transform = 'translateY(10px)';
            char.style.color = '#555';
          }
        });

        // Animate Form Fields
        formRefs.current.forEach((field, index) => {
          if (!field) return;
          const fieldStart = index * 0.15;
          const fieldEnd = fieldStart + 0.4;
          const fieldProgress = (clampedProgress - fieldStart) / (fieldEnd - fieldStart);
          const cleanFieldProgress = Math.max(0, Math.min(1, fieldProgress));

          const translateX = 50 - cleanFieldProgress * 50;
          const opacity = cleanFieldProgress;

          field.style.transform = `translateX(${translateX}px)`;
          field.style.opacity = `${opacity}`;
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
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none', // Wrapper allows clicks to pass through
        }}
      >
        {/* ================= THE CARD ================= */}
        <div
          ref={cardRef}
          style={{
            width: '90vw',
            maxWidth: '1000px',
            height: '80vh',
            maxHeight: '600px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            backgroundColor: 'rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            overflow: 'hidden',

            // REMOVED opacity transition from here
            willChange: 'transform',
            opacity: 1, // Start fully visible

            // Enable events on the card itself so you can type
            pointerEvents: 'auto',
          }}
        >
          {/* LEFT SIDE (TEXT) */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              borderRight: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <h1
              style={{
                fontSize: '3.5rem',
                lineHeight: '1.2',
                maxWidth: '350px',
                display: 'flex',
                flexWrap: 'wrap',
                color: 'white',
              }}
            >
              {text.split('').map((char, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    charRefs.current[i] = el;
                  }}
                  style={{
                    transition: 'opacity 0.1s, transform 0.1s',
                    marginRight: char === ' ' ? '10px' : '0',
                    display: 'inline-block',
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <form
              style={{
                width: '100%',
                maxWidth: '350px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
            >
              {['Name', 'Email', 'Message', 'Button'].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    formRefs.current[i] = el;
                  }}
                  style={{ opacity: 0, transform: 'translateX(50px)' }}
                >
                  {item === 'Button' ? (
                    <button
                      type='button'
                      style={{
                        width: '100%',
                        padding: '15px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'white',
                        color: 'black',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '10px',
                        transition: 'transform 0.2s',
                      }}
                    >
                      Send Message
                    </button>
                  ) : item === 'Message' ? (
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          color: '#aaa',
                          fontSize: '0.9rem',
                        }}
                      >
                        {item}
                      </label>
                      <textarea
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '6px',
                          border: '1px solid #444',
                          background: 'rgba(0,0,0,0.3)',
                          color: 'white',
                          outline: 'none',
                          resize: 'none',
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          color: '#aaa',
                          fontSize: '0.9rem',
                        }}
                      >
                        {item}
                      </label>
                      <input
                        type='text'
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '6px',
                          border: '1px solid #444',
                          background: 'rgba(0,0,0,0.3)',
                          color: 'white',
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Contact;
