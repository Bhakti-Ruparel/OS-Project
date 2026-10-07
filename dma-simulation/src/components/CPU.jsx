import { CPU_STATUS, STEPS } from '../hooks/useSimulation.js';

const statusColor = {
  [CPU_STATUS.IDLE]:         '#64748b',
  [CPU_STATUS.INITIALIZING]: '#3b82f6',
  [CPU_STATUS.FREE]:         '#f59e0b',
  [CPU_STATUS.INTERRUPT]:    '#ec4899',
  [CPU_STATUS.COMPLETE]:     '#10b981',
};

function ProgressBar({ value, color }) {
  const filled = Math.round(value / 10);
  return (
    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
      {'█'.repeat(filled)}{'░'.repeat(10 - filled)} {value}%
    </div>
  );
}

export default function CPU({ cpuStatus, cpuTaskProgress, step, showInterrupt }) {
  const isWorking   = cpuStatus === CPU_STATUS.FREE;
  const isInit      = cpuStatus === CPU_STATUS.INITIALIZING;
  const isInterrupt = cpuStatus === CPU_STATUS.INTERRUPT || cpuStatus === CPU_STATUS.COMPLETE;
  const color       = statusColor[cpuStatus] ?? '#64748b';

  return (
    <div
      className={`card ${isInit ? 'glow-cpu' : ''} ${isInterrupt ? 'glow-ram' : ''}`}
      style={{
        borderColor: color,
        borderWidth: 2,
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        position: 'relative',
        minWidth: 220,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            boxShadow: '0 2px 8px rgba(59,130,246,0.4)',
          }}
        >
          🖥️
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>CPU</div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Manager
          </div>
        </div>
        <span className="badge badge-cpu" style={{ marginLeft: 'auto' }}>Processor</span>
      </div>

      {/* Status */}
      <div
        style={{
          background: '#0f172a',
          borderRadius: 8,
          padding: '0.5rem 0.75rem',
          marginBottom: '0.75rem',
          border: `1px solid ${color}40`,
        }}
      >
        <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: 2 }}>STATUS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            className={`pulse-dot ${cpuStatus !== CPU_STATUS.IDLE ? 'active' : ''}`}
            style={{ background: color }}
          />
          <span style={{ color, fontWeight: 600, fontSize: '0.85rem' }}>{cpuStatus}</span>
        </div>
      </div>

      {/* CPU doing other work */}
      {isWorking && (
        <div
          style={{
            background: '#1e293b',
            border: '1px solid #f59e0b40',
            borderRadius: 8,
            padding: '0.6rem 0.75rem',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
            PROCESSING ANOTHER PROGRAM
          </div>
          <div
            style={{
              width: '100%',
              background: '#0f172a',
              borderRadius: 4,
              height: 8,
              overflow: 'hidden',
              marginBottom: '0.35rem',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${cpuTaskProgress}%`,
                background: 'linear-gradient(90deg, #f59e0b, #fcd34d)',
                borderRadius: 4,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <ProgressBar value={cpuTaskProgress} />
        </div>
      )}

      {/* CPU initializing DMA */}
      {isInit && (
        <div
          style={{
            background: '#1e293b',
            border: '1px solid #3b82f640',
            borderRadius: 8,
            padding: '0.6rem 0.75rem',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.4rem' }}>DMA CONFIG</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#93c5fd', lineHeight: 1.7 }}>
            <div>Source: I/O Device</div>
            <div>Destination: RAM</div>
            <div>Data Size: 4 Blocks</div>
            <div>Mode: DMA Transfer</div>
          </div>
        </div>
      )}

      {/* Interrupt notification */}
      {showInterrupt && (
        <div
          style={{
            marginTop: '0.6rem',
            background: 'linear-gradient(135deg, #064e3b, #065f46)',
            border: '1px solid #10b98160',
            borderRadius: 8,
            padding: '0.5rem 0.75rem',
            animation: 'bounceIn 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ fontSize: '1.1rem', animation: 'interruptBell 0.8s ease' }}>🔔</span>
          <span style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 600 }}>
            Interrupt received: DMA transfer completed!
          </span>
        </div>
      )}

      {/* Idle hint */}
      {cpuStatus === CPU_STATUS.IDLE && (
        <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.78rem', marginTop: '0.25rem' }}>
          Waiting to initialize…
        </div>
      )}
    </div>
  );
}
