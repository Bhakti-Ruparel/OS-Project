import { STEPS } from '../hooks/useSimulation.js';

const PACKETS = [
  { id: 1, label: 'DATA 01', color: '#ec4899', bg: '#831843' },
  { id: 2, label: 'DATA 02', color: '#f59e0b', bg: '#78350f' },
  { id: 3, label: 'DATA 03', color: '#3b82f6', bg: '#1e3a8a' },
  { id: 4, label: 'DATA 04', color: '#10b981', bg: '#064e3b' },
];

export default function IODevice({ step, activePacketId }) {
  const isActive = step >= STEPS.TRANSFER_1 && step <= STEPS.TRANSFER_4;

  return (
    <div
      className={`card ${isActive ? 'glow-io' : ''}`}
      style={{
        borderColor: isActive ? '#8b5cf6' : '#334155',
        borderWidth: 2,
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        minWidth: 170,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}
        >
          💾
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>I/O DEVICE</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            SSD / Storage
          </div>
        </div>
      </div>

      {/* Data packets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {PACKETS.map((pkt) => {
          // Once a packet has been transferred it "leaves" the device
          const transferred = step > STEPS.IDLE && activePacketId !== null
            ? pkt.id < activePacketId
            : step >= STEPS.DMA_COMPLETE
              ? true
              : false;

          const isFlying = pkt.id === activePacketId;

          return (
            <div
              key={pkt.id}
              style={{
                background: transferred ? '#0f172a' : pkt.bg,
                border: `1px solid ${transferred ? '#1e293b' : pkt.color}60`,
                borderRadius: 6,
                padding: '0.35rem 0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.5s ease',
                opacity: transferred ? 0.3 : 1,
                transform: isFlying ? 'translateX(8px)' : 'none',
              }}
            >
              <span style={{ fontSize: '0.75rem' }}>📦</span>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: transferred ? '#475569' : pkt.color,
                  fontFamily: 'monospace',
                }}
              >
                {pkt.label}
              </span>
              {transferred && (
                <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#475569' }}>sent</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Warehouse label */}
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
        📦 Warehouse / Source
      </div>
    </div>
  );
}
