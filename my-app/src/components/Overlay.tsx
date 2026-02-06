// src/components/Overlay.tsx

const Overlay = () => {
  return (
    <div style={{ width: '100%', pointerEvents: 'none' }}>
      {/* 1. INTRO (Page 0-1) */}
      <section
        style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: '2rem',
            background: 'rgba(0,0,0,0.7)',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          Scroll to Enter My World
        </h1>
      </section>

      {/* 2. BIO (Page 1-2) */}
      <section
        style={{ height: '100vh', background: 'white', padding: '100px', pointerEvents: 'auto' }}
      >
        <h2 style={{ fontSize: '3rem', color: '#333' }}>Hello, I'm a Full Stack Dev.</h2>
        {/* ... content ... */}
      </section>

      {/* 3. GHOST GAP FOR PROJECTS (Page 2-5) */}
      {/* 3 pages duration = 300vh height */}
      <section style={{ height: '300vh' }} />

      {/* --- NEW BUFFER GAP (Page 5-6) --- */}
      {/* This empty space prevents the overlap! */}
      <section style={{ height: '100vh' }} />

      {/* 3. Experience Gap (Pages 6-9) */}
      <section style={{ height: '300vh' }} />

      {/* --- BUFFER GAP (Page 9-10) --- */}
      <section style={{ height: '100vh' }} />

      {/* 4. GHOST GAP FOR TESTIMONIALS (Page 5-9) */}
      {/* 4 pages duration = 400vh height */}
      <section style={{ height: '400vh' }} />

      {/* 5. CONTACT (Page 9+) */}
      <section
        style={{
          height: '100vh',
          background: '#111',
          color: 'white',
          padding: '100px',
          pointerEvents: 'auto',
        }}
      >
        <h2>Let's work together.</h2>
      </section>
    </div>
  );
};

export default Overlay;
