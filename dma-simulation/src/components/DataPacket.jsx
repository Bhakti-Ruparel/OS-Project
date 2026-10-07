import { useEffect, useState } from 'react';
import { STEPS } from '../hooks/useSimulation.js';

const PACKET_META = {
  1: { label: 'DATA 01', color: '#ec4899', bg: '#831843' },
  2: { label: 'DATA 02', color: '#f59e0b', bg: '#78350f' },
  3: { label: 'DATA 03', color: '#3b82f6', bg: '#1e3a8a' },
  4: { label: 'DATA 04', color: '#10b981', bg: '#064e3b' },
};

/**
 * DataPacket renders an animated flying packet on the system bus.
 * It listens to `activePacketId` and plays a CSS translate animation
 * from left (IO side) to right (RAM side) whenever a new packet ID appears.
 */
export default function DataPacket({ activePacketId, step }) {
  const [visible, setVisible]     = useState(false);
  const [phase, setPhase]         = useState('idle'); // 'idle' | 'io-to-dma' | 'dma-to-ram'
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    if (!activePacketId || step < STEPS.TRANSFER_1 || step > STEPS.TRANSFER_4) {
      setVisible(false);
      setPhase('idle');
      return;
    }
    setCurrentId(activePacketId);
    setVisible(true);
    setPhase('io-to-dma');

    const t1 = setTimeout(() => setPhase('dma-to-ram'), 900);
    const t2 = setTimeout(() => {
      setVisible(false);
      setPhase('idle');
    }, 1900);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [activePacketId, step]);

  if (!visible || !currentId) return null;

  const meta = PACKET_META[currentId];

  // x position: io-to-dma → 33%, dma-to-ram → 75%
  const xPos = phase === 'io-to-dma' ? '33%' : '75%';
  const yBounce = phase === 'dma-to-ram' ? '-6px' : '0px';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '50%',
        left: xPos,
        transform: `translateX(-50%) translateY(${yBounce})`,
        transition: 'left 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s ease',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: meta.bg,
          border: `2px solid ${meta.color}`,
          borderRadius: 8,
          padding: '0.3rem 0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          boxShadow: `0 0 16px ${meta.color}80`,
          animation: 'float 0.8s ease-in-out infinite',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: '0.85rem' }}>📦</span>
        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, color: meta.color }}>
          {meta.label}
        </span>
      </div>
      {/* trail dots */}
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 3 }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: meta.color,
              opacity: 1 - i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
