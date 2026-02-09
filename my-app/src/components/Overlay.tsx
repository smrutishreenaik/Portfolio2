// src/components/Overlay.tsx

const Overlay = () => {
  return (
    <div style={{ width: '100%', pointerEvents: 'none' }}>
      {/* 1. INTRO (Page 0-1) */}
      <section style={{ height: '100vh' }} />

      {/* 2. BIO GAP (Page 1 to 2) - UPDATED */}
      {/* We removed the HTML text here. This empty space allows 
          the <Bio /> component to play its animation. */}
      <section style={{ height: '100vh' }}>{/* INTENTIONALLY EMPTY */}</section>

      {/* 3. GHOST GAP FOR PROJECTS (Page 2-5) */}
      {/* 3 pages duration = 300vh height */}
      <section style={{ height: '300vh' }} />

      {/* --- NEW BUFFER GAP (Page 5-6) --- */}
      {/* This empty space prevents the overlap! */}
      <section style={{ height: '200vh' }} />

      {/* 3. Experience Gap (Pages 6-9) */}
      <section style={{ height: '300vh' }} />

      {/* --- BUFFER GAP (Page 9-10) --- */}
      <section style={{ height: '100vh' }} />

      {/* 4. GHOST GAP FOR TESTIMONIALS (Page 5-9) */}
      {/* 4 pages duration = 400vh height */}
      <section style={{ height: '400vh' }} />

      <section style={{ height: '100vh' }} />
    </div>
  );
};

export default Overlay;
