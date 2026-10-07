import { useState, useEffect } from 'react';

function WorkloadBar({ pct, color }) {
  const filled = Math.round(pct / 10);
  return (
    <div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          color,
          letterSpacing: '0.04em',
          marginBottom: '0.25rem',
        }}
      >
        {'█'.repeat(filled)}{'░'.repeat(10 - filled)} {pct}%
      </div>
      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
        Illustrative CPU involvement
      </div>
    </div>
  );
}

export default function Comparison() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPulse(p => !p), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem', textAlign: 'center' }}>
        Without DMA vs With DMA
      </h2>
      <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        See how DMA reduces CPU involvement in bulk data transfers
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* ── WITHOUT DMA ── */}
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #ef444460',
            borderRadius: 16,
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.3rem' }}>⚠️</span>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#fca5a5' }}>WITHOUT DMA</h3>
          </div>

          {/* Flow diagram */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#0f172a',
              borderRadius: 10,
              padding: '0.75rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'I/O Device', icon: '💾', color: '#8b5cf6' },
              { arrow: true },
              { label: 'CPU', icon: '🖥️', color: '#ef4444', highlight: true },
              { arrow: true },
              { label: 'RAM', icon: '🗄️', color: '#10b981' },
            ].map((item, i) => (
              item.arrow
                ? <span key={i} style={{ color: '#ef4444', fontSize: '1.1rem' }}>→</span>
                : (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <div
                      style={{
                        background: item.highlight ? '#7f1d1d' : '#1e293b',
                        border: `1px solid ${item.color}60`,
                        borderRadius: 8,
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.75rem',
                        color: item.color,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        animation: item.highlight && pulse ? 'pulse 1s ease' : 'none',
                      }}
                    >
                      {item.icon} {item.label}
                    </div>
                  </div>
                )
            ))}
          </div>

          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55, marginBottom: '1rem' }}>
            CPU must handle every data transfer step — reading from the I/O device and writing to RAM — increasing CPU workload.
          </p>

          <div
            style={{
              background: '#450a0a',
              border: '1px solid #ef444440',
              borderRadius: 8,
              padding: '0.6rem 0.75rem',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.35rem' }}>CPU WORKLOAD</div>
            <WorkloadBar pct={90} color="#ef4444" />
          </div>
        </div>

        {/* ── WITH DMA ── */}
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #10b98160',
            borderRadius: 16,
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.3rem' }}>✅</span>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#6ee7b7' }}>WITH DMA</h3>
          </div>

          {/* Flow diagram */}
          <div
            style={{
              background: '#0f172a',
              borderRadius: 10,
              padding: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            {/* DMA path */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: 'I/O Device', icon: '💾', color: '#8b5cf6' },
                { arrow: true, color: '#f59e0b' },
                { label: 'DMA', icon: '🚚', color: '#f59e0b' },
                { arrow: true, color: '#f59e0b' },
                { label: 'RAM', icon: '🗄️', color: '#10b981' },
              ].map((item, i) => (
                item.arrow
                  ? <span key={i} style={{ color: item.color, fontSize: '1.1rem' }}>→</span>
                  : (
                    <div
                      key={i}
                      style={{
                        background: '#1e293b',
                        border: `1px solid ${item.color}60`,
                        borderRadius: 8,
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.75rem',
                        color: item.color,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {item.icon} {item.label}
                    </div>
                  )
              ))}
            </div>
            {/* CPU separate path */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div
                style={{
                  background: '#1e3a5f',
                  border: '1px solid #3b82f660',
                  borderRadius: 8,
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.75rem',
                  color: '#60a5fa',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                🖥️ CPU
              </div>
              <span style={{ color: '#3b82f6', fontSize: '1.1rem' }}>→</span>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#60a5fa',
                  background: '#0f172a',
                  border: '1px solid #1e3a8a',
                  borderRadius: 8,
                  padding: '0.3rem 0.5rem',
                }}
              >
                Other Tasks 🔄
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55, marginBottom: '1rem' }}>
            CPU initializes the transfer and can perform other work while DMA handles the actual data movement.
          </p>

          <div
            style={{
              background: '#022c22',
              border: '1px solid #10b98140',
              borderRadius: 8,
              padding: '0.6rem 0.75rem',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.35rem' }}>CPU WORKLOAD</div>
            <WorkloadBar pct={30} color="#10b981" />
          </div>
        </div>
      </div>
    </section>
  );
}
