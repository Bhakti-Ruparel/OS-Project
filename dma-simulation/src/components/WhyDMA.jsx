const HIGHLIGHTS = [
  {
    icon: '⚡',
    title: 'Less CPU Involvement',
    desc: 'CPU only initializes the transfer — it does not copy each data block.',
    color: '#3b82f6',
    bg: '#1e3a5f',
    border: '#1d4ed8',
  },
  {
    icon: '🚀',
    title: 'Efficient Data Transfer',
    desc: 'DMA moves data at bus speed, independently of CPU execution cycles.',
    color: '#f59e0b',
    bg: '#451a03',
    border: '#d97706',
  },
  {
    icon: '🔄',
    title: 'CPU Can Perform Other Work',
    desc: 'While DMA handles I/O, the CPU is free to run other programs and tasks.',
    color: '#10b981',
    bg: '#022c22',
    border: '#059669',
  },
];

export default function WhyDMA() {
  return (
    <section style={{ marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem', textAlign: 'center' }}>
        Why DMA?
      </h2>

      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 16,
          padding: '1.25rem',
          marginBottom: '1.25rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
          <strong style={{ color: '#f1f5f9' }}>DMA reduces CPU involvement</strong> in bulk data transfers,
          allowing the CPU to perform other tasks while data moves between
          I/O devices and memory.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {HIGHLIGHTS.map((h) => (
          <div
            key={h.title}
            style={{
              background: h.bg,
              border: `2px solid ${h.border}60`,
              borderRadius: 14,
              padding: '1.1rem',
              textAlign: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${h.color}30`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{h.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: h.color, marginBottom: '0.4rem' }}>
              {h.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.55 }}>
              {h.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Educational disclaimer */}
      <div
        style={{
          marginTop: '1rem',
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: 10,
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '1rem', flexShrink: 0 }}>📌</span>
        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6 }}>
          <strong style={{ color: '#94a3b8' }}>Note:</strong> DMA does not eliminate CPU involvement entirely.
          The CPU still initializes the transfer and processes the interrupt when it completes.
          The workload percentages shown in this simulation are <em>illustrative</em> — actual
          CPU savings depend on the system, data size, and workload.
        </p>
      </div>
    </section>
  );
}
