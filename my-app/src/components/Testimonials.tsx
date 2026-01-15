import { type CSSProperties } from 'react';
import { motion, type Variants } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Senior Architect",
    text: "One of the best .NET developers I've worked with. Their understanding of Microservices is top-notch.",
    color: "#e0f2fe",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Product Manager",
    text: "Delivered the Azure migration 2 weeks ahead of schedule. Highly recommended.",
    color: "#fef3c7",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Tech Lead",
    text: "Incredible attention to detail in the frontend. The 3D interactions were smooth and bug-free.",
    color: "#dcfce7",
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "CTO",
    text: "A true full-stack talent. Can handle DB optimization and React animations with equal ease.",
    color: "#fce7f3",
  },
];

const cardVariants: Variants = {
  // State when the card is NOT fully in view (e.g. scrolling up/away)
  offscreen: {
    y: 20, // Pushes the card down further
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.5,
    }
  },
  // State when the card IS in view (stacking)
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.2, // increased bounce for lively feel
      duration: 0.8
    }
  }
};

const Testimonials = () => {
  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>What People Say</h2>
      
      <div style={deckContainerStyle}>
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial="offscreen"
            whileInView="onscreen"
            // once: false -> ensures animation replays every time it enters/leaves view
            // amount: 0.8 -> triggers only when 80% of the card is visible (prevents early triggering)
            viewport={{ once: false, amount: 0.8 }} 
            variants={cardVariants}
            style={{
              ...cardStyle,
              backgroundColor: t.color,
              zIndex: index, 
              // Negative margin to create the visual stack
              marginTop: index === 0 ? 0 : '-150px', 
            }}
          >
            <p style={textStyle}>"{t.text}"</p>
            <div style={authorStyle}>
              <strong>{t.name}</strong>
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}> • {t.role}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Styles (Unchanged) ---

const containerStyle: CSSProperties = {
  padding: '100px 20px',
  background: '#111',
  minHeight: '100vh', 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const deckContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: '200px', 
};

const headerStyle: CSSProperties = {
  color: 'white',
  fontSize: '3rem',
  marginBottom: '80px',
  textAlign: 'center',
};

const cardStyle: CSSProperties = {
  position: 'relative', 
  width: '80vw',
  maxWidth: '600px',
  height: '300px',
  padding: '40px',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#333',
};

const textStyle: CSSProperties = {
  fontSize: '1.4rem',
  fontWeight: '500',
  fontStyle: 'italic',
  marginBottom: '20px',
  lineHeight: '1.4',
};

const authorStyle: CSSProperties = {
  fontSize: '1.1rem',
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

export default Testimonials;