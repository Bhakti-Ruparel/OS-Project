import { STEPS } from '../hooks/useSimulation.js';

export default function SimulationControls({
  step,
  isPlaying,
  isAutoPlay,
  presentationMode,
  actions,
}) {
  const isIdle     = step === STEPS.IDLE;
  const isTerminal = step === STEPS.CPU_INTERRUPT;

  return (
    <div
      style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 16,
        padding: '1rem 1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.6rem',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Main controls ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* Start / Resume */}
        {!isPlaying && !isTerminal && (
          <button
            className="btn btn-primary"
            onClick={actions.startAutoPlay}
            style={{ minWidth: 160 }}
          >
            ▶ {isIdle ? 'Start DMA Transfer' : 'Auto Play'}
          </button>
        )}

        {/* Pause */}
        {isPlaying && (
          <button className="btn btn-secondary" onClick={actions.pause} style={{ minWidth: 110 }}>
            ⏸ Pause
          </button>
        )}

        {/* Resume after pause */}
        {!isPlaying && !isIdle && !isTerminal && (
          <button className="btn btn-secondary" onClick={actions.resume} style={{ minWidth: 110 }}>
            ▶ Resume
          </button>
        )}

        {/* Next Step */}
        <button
          className="btn btn-secondary"
          onClick={actions.nextStep}
          disabled={isTerminal || isPlaying}
          title="Advance one step manually"
        >
          ⏭ Next Step
        </button>

        {/* Prev Step */}
        <button
          className="btn btn-secondary"
          onClick={actions.prevStep}
          disabled={isIdle || isPlaying}
          title="Go back one step"
        >
          ⏮ Prev Step
        </button>

        {/* Reset */}
        <button
          className="btn btn-danger"
          onClick={actions.reset}
          title="Reset simulation"
        >
          ↺ Reset
        </button>
      </div>

      {/* ── Divider ── */}
      <div
        className="hide-in-presentation"
        style={{ width: '100%', height: 1, background: '#334155', margin: '0.1rem 0' }}
      />

      {/* ── Presentation mode & step indicator ── */}
      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={actions.togglePresentation}
          style={{ fontSize: '0.78rem' }}
        >
          {presentationMode ? '🖥 Exit Presentation' : '🎬 Presentation Mode'}
        </button>

        <div
          style={{
            fontSize: '0.78rem',
            color: '#64748b',
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: 8,
            padding: '0.3rem 0.8rem',
          }}
        >
          Step {step} / {STEPS.CPU_INTERRUPT}
        </div>

        {isAutoPlay && isPlaying && (
          <div
            style={{
              fontSize: '0.75rem',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span className="pulse-dot active" style={{ background: '#f59e0b' }} />
            Auto-playing…
          </div>
        )}
      </div>
    </div>
  );
}
