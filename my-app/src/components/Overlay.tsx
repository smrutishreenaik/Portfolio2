import Testimonials from './Testimonials';

const Overlay = () => {
  return (
    <div style={{ width: '100%', pointerEvents: 'none' }}>
      {/* SECTION 1: The "Screen" area (Empty to let 3D show) */}
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

      {/* SECTION 2: Your Actual Portfolio Content */}
      <section
        style={{
          height: '100vh',
          background: 'white',
          padding: '100px',
          pointerEvents: 'auto', // Re-enable clicks
        }}
      >
        <h2 style={{ fontSize: '3rem', color: '#333' }}>Hello, I'm a Full Stack Dev.</h2>
        <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '20px' }}>
          I build scalable applications with <b>.NET Core</b> and <b>React</b>.
        </p>

        <div
          style={{
            marginTop: '50px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
            <h3>Backend Mastery</h3>
            <p>C#, Microservices, Azure, SQL Server</p>
          </div>
          <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
            <h3>Frontend Magic</h3>
            <p>React, TypeScript, Three.js, Tailwind</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Testimonials (NEW) */}
      <div style={{ pointerEvents: 'auto' }}>
        <Testimonials />
      </div>

      {/* SECTION 3: Contact */}
      <section style={{ height: '100vh', background: '#111', color: 'white', padding: '100px' }}>
        <h2>Let's work together.</h2>
      </section>
    </div>
  );
};

export default Overlay;
