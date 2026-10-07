import { STEPS } from '../hooks/useSimulation.js';

const EXPLANATION_STEPS = [
  {
    num: '01',
    title: 'Initialize',
    desc: 'CPU tells the DMA controller what data needs to be transferred: source device, destination address, and data size.',
    icon: '⚙️',
    simStep: STEPS.CPU_INIT,
  },
  {
    num: '02',
    title: 'Take Control',
    desc: 'DMA takes control of the system bus and data transfer — the CPU is no longer involved in moving data.',
    icon: '🔀',
    simStep: STEPS.DMA_ACTIVE,
  },
  {
    num: '03',
    title: 'Transfer',
    desc: 'DMA moves data directly between the I/O device and RAM — without the CPU copying each block.',
    icon: '🚚',
    simStep: STEPS.TRANSFER_1,
    rangeEnd: STEPS.TRANSFER_4,
  },
  {
    num: '04',
    title: 'CPU Works',
    desc: 'While DMA transfers data, the CPU performs other tasks — this is what makes DMA efficient.',
    icon: '🖥️',
    simStep: STEPS.DMA_ACTIVE,
    rangeEnd: STEPS.TRANSFER_4,
  },
  {
    num: '05',
    title: 'Interrupt',
    desc: 'DMA sends an interrupt signal to the CPU when the transfer is complete, so the CPU can process the data.',
    icon: '🔔',
    simStep: STEPS.DMA_COMPLETE,
    rangeEnd: STEPS.CPU_INTERRUPT,
  },
];

function isStepActive(item, currentStep) {
  const end = item.rangeEnd ?? item.simStep;
  return currentStep >= item.simStep && currentStep <= end;
}

export default function StepExplanation({ step }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', textAlign: 'center' }}>
        How DMA Works
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {EXPLANATION_STEPS.map((item) => {
          const active = isStepActive(item, step);
          return (
            <div
              key={item.num}
              style={{
                background: active ? '#1e3a5f' : '#1e293b',
                border: `2px solid ${active ? '#3b82f6' : '#334155'}`,
                borderRadius: 12,
                padding: '1rem',
                transition: 'all 0.4s ease',
                boxShadow: active ? '0 0 16px rgba(59,130,246,0.25)' : 'none',
                transform: active ? 'translateY(-2px)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: active ? '#93c5fd' : '#475569',
                    fontFamily: 'monospace',
                    background: active ? '#1d4ed840' : '#0f172a',
                    border: `1px solid ${active ? '#3b82f6' : '#1e293b'}`,
                    borderRadius: 4,
                    padding: '1px 5px',
                  }}
                >
                  {item.num}
                </span>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: active ? '#f1f5f9' : '#94a3b8',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.title}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: active ? '#cbd5e1' : '#64748b', lineHeight: 1.55, transition: 'color 0.3s ease' }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
