import { STEPS } from '../hooks/useSimulation.js';

const SLOT_COLORS = ['#ec4899', '#f59e0b', '#3b82f6', '#10b981'];

export default function RAM({ ramSlots, ramAddresses, highlightedSlot, step }) {
  const isActive = step >= STEPS.TRANSFER_1;

  return (
    <div
      className={`card ${isActive ? 'glow-ram' : ''}`}
      style={{
        borderColor: isActive ? '#10b981' : '#334155',
        borderWidth: 2,
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        minWidth: 180,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #065f46, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}
        >
          🗄️
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>RAM</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Main Memory
          </div>
        </div>
      </div>

      {/* Memory slots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {ramAddresses.map((addr, i) => {
          const data = ramSlots[i];
          const isHighlighted = highlightedSlot === i;
          const isFilled = !!data;
          const color = SLOT_COLORS[i];

          return (
            <div
              key={addr}
              style={{
                background: isHighlighted
                  ? `${color}25`
                  : isFilled
                    ? '#0f172a'
                    : '#0a0f1a',
                border: `1px solid ${isFilled ? color + '60' : '#1e293b'}`,
                borderRadius: 6,
                padding: '0.35rem 0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.4s ease',
                transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isHighlighted ? `0 0 12px ${color}50` : 'none',
                animation: isHighlighted ? 'fadeIn 0.3s ease' : 'none',
              }}
            >
              {/* Address */}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.72rem',
                  color: '#475569',
                  minWidth: 42,
                }}
              >
                {addr}
              </span>

              {/* Arrow */}
              <span style={{ color: '#334155', fontSize: '0.7rem' }}>→</span>

              {/* Data value */}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: isFilled ? color : '#1e3a5f',
                  flex: 1,
                  transition: 'color 0.4s ease',
                }}
              >
                {isFilled ? data : 'EMPTY'}
              </span>

              {/* Written indicator */}
              {isFilled && (
                <span style={{ fontSize: '0.65rem', color: color }}>✓</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Destination label */}
      <div
        style={{
          marginTop: '0.75rem',
          textAlign: 'center',
          fontSize: '0.68rem',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        🏁 Destination / Storage
      </div>
    </div>
  );
}
