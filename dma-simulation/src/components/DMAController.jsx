import { STEPS } from '../hooks/useSimulation.js';

export default function DMAController({ dmaActive, step, transferCount }) {
  const isComplete = step >= STEPS.DMA_COMPLETE;
  const isIdle     = step === STEPS.IDLE;

  return (
    <div
      className={`card ${dmaActive ? 'glow-dma' : ''}`}
      style={{
        borderColor: dmaActive ? '#f59e0b' : '#334155',
        borderWidth: 2,
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        minWidth: 200,
        textAlign: 'center',
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: '2.8rem',
          marginBottom: '0.5rem',
          animation: dmaActive ? 'truckBounce 1.2s ease-in-out infinite' : 'none',
          filter: dmaActive
            ? 'drop-shadow(0 0 12px rgba(245,158,11,0.7))'
            : 'none',
          transition: 'filter 0.4s ease',
        }}
      >
        🚚
      </div>

      {/* Title */}
      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', marginBottom: 2 }}>
        DMA CONTROLLER
      </div>
      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
        Delivery Agent
      </div>

      {/* Status badge */}
      <div
        className="badge"
        style={{
          background: dmaActive
            ? 'linear-gradient(135deg, #92400e, #d97706)'
            : '#1e293b',
          color: dmaActive ? '#fef3c7' : '#64748b',
          border: `1px solid ${dmaActive ? '#f59e0b' : '#334155'}`,
          fontSize: '0.72rem',
          marginBottom: '0.75rem',
          transition: 'all 0.4s ease',
          animation: dmaActive ? 'fadeIn 0.4s ease' : 'none',
        }}
      >
        <span
          className={`pulse-dot ${dmaActive ? 'active' : ''}`}
          style={{ background: dmaActive ? '#fcd34d' : '#475569' }}
        />
        {dmaActive ? 'ACTIVE — Transferring Data' : isComplete ? 'TRANSFER COMPLETE' : 'STANDBY'}
      </div>

      {/* Transfer progress */}
      {(dmaActive || isComplete) && (
        <div
          style={{
            background: '#0f172a',
            borderRadius: 8,
            padding: '0.6rem',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
            TRANSFER PROGRESS
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#f59e0b', marginBottom: '0.4rem' }}>
            {transferCount} / 4
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(transferCount / 4) * 100}%`,
                background: 'linear-gradient(90deg, #f59e0b, #fcd34d)',
              }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            Packages delivered
          </div>
        </div>
      )}

      {/* Idle state */}
      {isIdle && (
        <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem' }}>
          Awaiting instructions…
        </div>
      )}

      {/* Complete */}
      {isComplete && (
        <div
          style={{
            marginTop: '0.6rem',
            background: 'linear-gradient(135deg, #065f46, #047857)',
            borderRadius: 8,
            padding: '0.5rem',
            animation: 'bounceIn 0.5s ease',
          }}
        >
          <div style={{ fontSize: '1.2rem' }}>✅</div>
          <div style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 600 }}>
            All packages delivered!
          </div>
        </div>
      )}
    </div>
  );
}
