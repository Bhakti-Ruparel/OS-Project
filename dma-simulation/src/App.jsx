import { useSimulation, STEPS } from './hooks/useSimulation.js';
import CPU from './components/CPU.jsx';
import DMAController from './components/DMAController.jsx';
import IODevice from './components/IODevice.jsx';
import RAM from './components/RAM.jsx';
import SystemBus from './components/SystemBus.jsx';
import SimulationControls from './components/SimulationControls.jsx';
import StepExplanation from './components/StepExplanation.jsx';
import Comparison from './components/Comparison.jsx';
import DeliveryAnalogy from './components/DeliveryAnalogy.jsx';
import WhyDMA from './components/WhyDMA.jsx';

export default function App() {
  const { state, RAM_ADDRESSES, DATA_PACKETS, actions } = useSimulation();
  const {
    step, isPlaying, isAutoPlay, presentationMode,
    cpuStatus, cpuTaskProgress, dmaActive, activePacketId,
    ramSlots, highlightedSlot, transferCount,
    showInterrupt, showComplete, stepMessage,
  } = state;

  return (
    <div
      className={presentationMode ? 'presentation-mode' : ''}
      style={{ minHeight: '100vh', padding: '1.5rem 1rem 3rem', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* ══════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════ */}
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.6rem' }}>
          <span className="badge badge-os" style={{ fontSize: '0.72rem' }}>
            🎓 Operating Systems Project
          </span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: '#f1f5f9',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '0.4rem',
          }}
        >
          Direct Memory Access{' '}
          <span style={{ color: '#f59e0b' }}>(DMA)</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#94a3b8', fontWeight: 400 }}>
          A Delivery Service for Data Transfer
        </p>
      </header>

      {/* ══════════════════════════════════════════════
          CONTROLS  (top)
      ══════════════════════════════════════════════ */}
      <SimulationControls
        step={step}
        isPlaying={isPlaying}
        isAutoPlay={isAutoPlay}
        presentationMode={presentationMode}
        actions={actions}
      />

      {/* ══════════════════════════════════════════════
          STEP MESSAGE BANNER
      ══════════════════════════════════════════════ */}
      <div
        style={{
          margin: '1rem 0',
          background: '#1e293b',
          border: '1px solid #334155',
          borderLeft: `4px solid ${step === 0 ? '#475569' : '#f59e0b'}`,
          borderRadius: 10,
          padding: '0.7rem 1rem',
          fontSize: '0.9rem',
          color: step === 0 ? '#64748b' : '#e2e8f0',
          transition: 'color 0.3s ease',
          minHeight: 44,
        }}
        key={stepMessage}
      >
        <span style={{ animation: 'fadeIn 0.4s ease', display: 'inline-block' }}>
          {stepMessage}
        </span>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN SIMULATION WORKSPACE
      ══════════════════════════════════════════════ */}
      <div className="sim-workspace">

        {/* ── CPU row (top center) ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <CPU
            cpuStatus={cpuStatus}
            cpuTaskProgress={cpuTaskProgress}
            step={step}
            showInterrupt={showInterrupt}
          />
        </div>

        {/* ── Vertical connector: CPU ↔ DMA ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>
          <div
            style={{
              width: 2,
              height: 32,
              background: step >= STEPS.CPU_INIT
                ? 'linear-gradient(180deg, #3b82f6, #f59e0b)'
                : '#1e293b',
              borderRadius: 2,
              transition: 'background 0.5s ease',
              position: 'relative',
            }}
          >
            {step >= STEPS.CPU_INIT && step <= STEPS.DMA_ACTIVE && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '0.6rem',
                  color: '#f59e0b',
                  whiteSpace: 'nowrap',
                  background: '#0f172a',
                  padding: '0 3px',
                }}
              >
                ↓
              </div>
            )}
          </div>
        </div>

        {/* ── Three-column row: IO | DMA | RAM ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '0.75rem',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* LEFT — I/O Device */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IODevice step={step} activePacketId={activePacketId} />
          </div>

          {/* CENTER — DMA + System Bus */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              minWidth: 220,
            }}
          >
            <DMAController
              dmaActive={dmaActive}
              step={step}
              transferCount={transferCount}
            />
          </div>

          {/* RIGHT — RAM */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <RAM
              ramSlots={ramSlots}
              ramAddresses={RAM_ADDRESSES}
              highlightedSlot={highlightedSlot}
              step={step}
            />
          </div>
        </div>

        {/* ── System Bus (full width, beneath the three cards) ── */}
        <div style={{ marginTop: '0.25rem', position: 'relative' }}>
          <SystemBus
            step={step}
            activePacketId={activePacketId}
            dmaActive={dmaActive}
          />
        </div>

      </div>

      {/* ══════════════════════════════════════════════
          TRANSFER COMPLETE BANNER
      ══════════════════════════════════════════════ */}
      {showComplete && (
        <div
          style={{
            margin: '1rem 0',
            background: 'linear-gradient(135deg, #022c22, #064e3b)',
            border: '2px solid #10b981',
            borderRadius: 14,
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'bounceIn 0.5s ease',
            boxShadow: '0 0 24px rgba(16,185,129,0.3)',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#6ee7b7' }}>
              DMA TRANSFER COMPLETE
            </div>
            <div style={{ fontSize: '0.82rem', color: '#34d399', marginTop: 2 }}>
              All 4 data packages successfully transferred from I/O Device → RAM via DMA Controller.
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          LOWER SECTIONS  (hidden in presentation mode)
      ══════════════════════════════════════════════ */}
      <div className="hide-in-presentation">

        {/* Step Explanation */}
        <StepExplanation step={step} />

        {/* Comparison */}
        <Comparison />

        {/* Delivery Analogy */}
        <DeliveryAnalogy />

        {/* Why DMA */}
        <WhyDMA />

        {/* Footer */}
        <footer
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #1e293b',
            textAlign: 'center',
            color: '#334155',
            fontSize: '0.78rem',
          }}
        >
          <p>DMA Simulation · Operating Systems Project · Built with React + Vite</p>
          <p style={{ marginTop: '0.3rem', color: '#1e3a5f' }}>
            For educational purposes — illustrative values only
          </p>
        </footer>

      </div>
    </div>
  );
}
