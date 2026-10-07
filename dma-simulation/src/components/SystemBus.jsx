import { STEPS } from '../hooks/useSimulation.js';
import DataPacket from './DataPacket.jsx';

export default function SystemBus({ step, activePacketId, dmaActive }) {
  const isActive = step >= STEPS.TRANSFER_1 && step <= STEPS.TRANSFER_4;
  const showInterruptLine = step >= STEPS.DMA_COMPLETE;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 64,
        margin: '0.25rem 0',
      }}
    >
      {/* ── Bus track ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          height: isActive ? 6 : 4,
          borderRadius: 99,
          background: isActive
            ? 'linear-gradient(90deg, #8b5cf6, #f59e0b, #10b981)'
            : 'linear-gradient(90deg, #1e293b, #334155, #1e293b)',
          transition: 'height 0.3s ease, background 0.5s ease',
          boxShadow: isActive
            ? '0 0 12px rgba(245,158,11,0.4)'
            : 'none',
          overflow: 'visible',
        }}
      >
        {/* Animated dash flow when active */}
        {isActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.2s linear infinite',
            }}
          />
        )}
      </div>

      {/* ── Label ── */}
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: 4,
          padding: '1px 8px',
          fontSize: '0.65rem',
          color: '#64748b',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          zIndex: 5,
        }}
      >
        ⚡ SYSTEM BUS
      </div>

      {/* ── Arrow markers ── */}
      {['25%', '75%'].map((pos) => (
        <div
          key={pos}
          style={{
            position: 'absolute',
            left: pos,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: isActive ? '#f59e0b' : '#334155',
            fontSize: '1rem',
            zIndex: 4,
            transition: 'color 0.4s ease',
          }}
        >
          ➤
        </div>
      ))}

      {/* ── Flying data packet ── */}
      <DataPacket activePacketId={activePacketId} step={step} />

      {/* ── Interrupt signal line ── */}
      {showInterruptLine && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: '30%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            animation: 'fadeIn 0.5s ease',
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: '1rem', animation: 'interruptBell 1s ease 0.2s' }}>🔔</div>
          <div
            style={{
              fontSize: '0.6rem',
              color: '#10b981',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              background: '#022c22',
              border: '1px solid #10b98150',
              borderRadius: 4,
              padding: '1px 5px',
            }}
          >
            INTERRUPT →
          </div>
        </div>
      )}
    </div>
  );
}
