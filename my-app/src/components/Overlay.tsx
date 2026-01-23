const Overlay = () => {
  return (
    <div style={{ width: '100%', pointerEvents: 'none' }}>
      {/* SECTION 1: Intro (Page 0) */}
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

      {/* SECTION 2: Portfolio Content (Page 1) */}
      <section
        style={{ height: '100vh', background: 'white', padding: '100px', pointerEvents: 'auto' }}
      >
        <h2 style={{ fontSize: '3rem', color: '#333' }}>Hello, I'm a Full Stack Dev.</h2>
        <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '20px' }}>
          I build scalable applications with <b>.NET Core</b> and <b>React</b>.
        </p>
        {/* ... your grid items ... */}
      </section>

      {/* --- THE GHOST GAP (CRITICAL) --- 
          This creates empty scroll space for the Testimonials to play.
          Since Testimonials run from Page 2 to Page 6 (startPage 2 + pinLength 4),
          we need a gap of roughly 400vh-500vh here.
      */}
      <section style={{ height: '500vh' }}>{/* This section is intentionally empty */}</section>

      {/* SECTION 3: Contact (Page 6+) */}
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
