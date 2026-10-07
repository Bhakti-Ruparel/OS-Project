/**
 * useSimulation.js
 * Central state machine for the DMA simulation.
 *
 * Simulation steps:
 *   0  = idle / reset
 *   1  = CPU initializes DMA
 *   2  = DMA takes control (CPU goes free)
 *   3  = Transfer DATA 01
 *   4  = Transfer DATA 02
 *   5  = Transfer DATA 03
 *   6  = Transfer DATA 04
 *   7  = Transfer complete — DMA raises interrupt
 *   8  = CPU acknowledges interrupt
 */

import { useReducer, useEffect, useRef, useCallback } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

export const STEPS = {
  IDLE:          0,
  CPU_INIT:      1,
  DMA_ACTIVE:    2,
  TRANSFER_1:    3,
  TRANSFER_2:    4,
  TRANSFER_3:    5,
  TRANSFER_4:    6,
  DMA_COMPLETE:  7,
  CPU_INTERRUPT: 8,
};

export const CPU_STATUS = {
  IDLE:          'Idle',
  INITIALIZING:  'Initializing DMA',
  FREE:          'Performing Other Task',
  INTERRUPT:     'Interrupt Received',
  COMPLETE:      'Transfer Complete',
};

export const DATA_PACKETS = [
  { id: 1, label: 'DATA 01', color: '#ec4899' },
  { id: 2, label: 'DATA 02', color: '#f59e0b' },
  { id: 3, label: 'DATA 03', color: '#3b82f6' },
  { id: 4, label: 'DATA 04', color: '#10b981' },
];

const RAM_ADDRESSES = ['0x1000', '0x1001', '0x1002', '0x1003'];

// ─── Step durations (ms) ─────────────────────────────────────────────────────
const STEP_DURATION = {
  [STEPS.IDLE]:          0,
  [STEPS.CPU_INIT]:      2200,
  [STEPS.DMA_ACTIVE]:    1800,
  [STEPS.TRANSFER_1]:    2000,
  [STEPS.TRANSFER_2]:    2000,
  [STEPS.TRANSFER_3]:    2000,
  [STEPS.TRANSFER_4]:    2000,
  [STEPS.DMA_COMPLETE]:  1800,
  [STEPS.CPU_INTERRUPT]: 0,   // terminal
};

// ─── Initial state ────────────────────────────────────────────────────────────
const initialState = {
  step:              STEPS.IDLE,
  isPlaying:         false,
  isAutoPlay:        false,
  presentationMode:  false,

  cpuStatus:         CPU_STATUS.IDLE,
  cpuTaskProgress:   0,       // 0-100
  dmaActive:         false,
  activePacketId:    null,    // which packet is currently flying
  ramSlots:          [null, null, null, null],   // null = empty
  highlightedSlot:   null,    // index of the just-written slot
  transferCount:     0,       // 0-4 packets delivered
  showInterrupt:     false,
  showComplete:      false,

  // step message shown in the simulation workspace
  stepMessage:       'Click "Start DMA Transfer" to begin.',
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'GO_TO_STEP': {
      const step = action.payload;
      const base = {
        ...state,
        step,
        isPlaying: false,
        activePacketId: null,
        highlightedSlot: null,
        showInterrupt: false,
      };
      switch (step) {
        case STEPS.IDLE:
          return { ...initialState };

        case STEPS.CPU_INIT:
          return {
            ...base,
            cpuStatus:   CPU_STATUS.INITIALIZING,
            dmaActive:   false,
            stepMessage: 'Step 1 — CPU is configuring the DMA controller with source, destination and data size.',
          };

        case STEPS.DMA_ACTIVE:
          return {
            ...base,
            cpuStatus:   CPU_STATUS.FREE,
            dmaActive:   true,
            stepMessage: 'Step 2 — DMA Controller activated. CPU is now free to perform other tasks.',
          };

        case STEPS.TRANSFER_1:
          return {
            ...base,
            cpuStatus:      CPU_STATUS.FREE,
            dmaActive:      true,
            activePacketId: 1,
            transferCount:  0,
            stepMessage:    'Step 3 — Transferring DATA 01 from I/O Device → DMA → RAM …',
          };

        case STEPS.TRANSFER_2:
          return {
            ...base,
            cpuStatus:      CPU_STATUS.FREE,
            dmaActive:      true,
            activePacketId: 2,
            transferCount:  1,
            ramSlots:       [DATA_PACKETS[0].label, null, null, null],
            highlightedSlot: 0,
            stepMessage:    'Step 3 — Transferring DATA 02 …',
          };

        case STEPS.TRANSFER_3:
          return {
            ...base,
            cpuStatus:      CPU_STATUS.FREE,
            dmaActive:      true,
            activePacketId: 3,
            transferCount:  2,
            ramSlots:       [DATA_PACKETS[0].label, DATA_PACKETS[1].label, null, null],
            highlightedSlot: 1,
            stepMessage:    'Step 3 — Transferring DATA 03 …',
          };

        case STEPS.TRANSFER_4:
          return {
            ...base,
            cpuStatus:      CPU_STATUS.FREE,
            dmaActive:      true,
            activePacketId: 4,
            transferCount:  3,
            ramSlots:       [DATA_PACKETS[0].label, DATA_PACKETS[1].label, DATA_PACKETS[2].label, null],
            highlightedSlot: 2,
            stepMessage:    'Step 3 — Transferring DATA 04 …',
          };

        case STEPS.DMA_COMPLETE:
          return {
            ...base,
            cpuStatus:      CPU_STATUS.INTERRUPT,
            dmaActive:      false,
            transferCount:  4,
            ramSlots:       DATA_PACKETS.map(p => p.label),
            highlightedSlot: 3,
            showComplete:   true,
            showInterrupt:  false,
            stepMessage:    'Step 4 — All data transferred! DMA is sending an interrupt to the CPU …',
          };

        case STEPS.CPU_INTERRUPT:
          return {
            ...base,
            cpuStatus:      CPU_STATUS.COMPLETE,
            dmaActive:      false,
            transferCount:  4,
            ramSlots:       DATA_PACKETS.map(p => p.label),
            highlightedSlot: null,
            showComplete:   true,
            showInterrupt:  true,
            stepMessage:    'Step 5 — CPU received the interrupt. Transfer complete! 🎉',
          };

        default:
          return state;
      }
    }

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };

    case 'SET_AUTOPLAY':
      return { ...state, isAutoPlay: action.payload };

    case 'SET_CPU_TASK_PROGRESS':
      return { ...state, cpuTaskProgress: action.payload };

    case 'CLEAR_HIGHLIGHT':
      return { ...state, highlightedSlot: null };

    case 'TOGGLE_PRESENTATION':
      return { ...state, presentationMode: !state.presentationMode };

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useSimulation() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const autoTimer   = useRef(null);
  const cpuTimer    = useRef(null);
  const highlightTimer = useRef(null);

  // Clear all timers helper
  const clearAll = useCallback(() => {
    clearTimeout(autoTimer.current);
    clearInterval(cpuTimer.current);
    clearTimeout(highlightTimer.current);
  }, []);

  // Go to a specific step manually
  const goToStep = useCallback((step) => {
    clearAll();
    dispatch({ type: 'GO_TO_STEP', payload: step });
  }, [clearAll]);

  // Advance one step
  const nextStep = useCallback(() => {
    const next = Math.min(state.step + 1, STEPS.CPU_INTERRUPT);
    goToStep(next);
  }, [state.step, goToStep]);

  // Previous step
  const prevStep = useCallback(() => {
    const prev = Math.max(state.step - 1, STEPS.IDLE);
    goToStep(prev);
  }, [state.step, goToStep]);

  // Reset
  const reset = useCallback(() => {
    clearAll();
    dispatch({ type: 'GO_TO_STEP', payload: STEPS.IDLE });
    dispatch({ type: 'SET_CPU_TASK_PROGRESS', payload: 0 });
  }, [clearAll]);

  // Toggle presentation mode
  const togglePresentation = useCallback(() => {
    dispatch({ type: 'TOGGLE_PRESENTATION' });
  }, []);

  // Start auto-play from current step
  const startAutoPlay = useCallback(() => {
    if (state.step >= STEPS.CPU_INTERRUPT) {
      goToStep(STEPS.CPU_INIT);
    }
    dispatch({ type: 'SET_PLAYING', payload: true });
    dispatch({ type: 'SET_AUTOPLAY', payload: true });
  }, [state.step, goToStep]);

  // Pause auto-play
  const pause = useCallback(() => {
    clearTimeout(autoTimer.current);
    dispatch({ type: 'SET_PLAYING', payload: false });
    dispatch({ type: 'SET_AUTOPLAY', payload: false });
  }, []);

  // Resume auto-play
  const resume = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: true });
    dispatch({ type: 'SET_AUTOPLAY', payload: true });
  }, []);

  // Auto-advance when isAutoPlay is true
  useEffect(() => {
    if (!state.isAutoPlay || !state.isPlaying) return;
    if (state.step === STEPS.IDLE) {
      // kick off from step 1
      autoTimer.current = setTimeout(() => {
        dispatch({ type: 'GO_TO_STEP', payload: STEPS.CPU_INIT });
      }, 300);
      return;
    }
    const duration = STEP_DURATION[state.step];
    if (duration === 0) {
      // terminal step
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_AUTOPLAY', payload: false });
      return;
    }
    autoTimer.current = setTimeout(() => {
      const next = state.step + 1;
      dispatch({ type: 'GO_TO_STEP', payload: next });
    }, duration);

    return () => clearTimeout(autoTimer.current);
  }, [state.isAutoPlay, state.isPlaying, state.step]);

  // CPU task progress animation during transfer steps
  useEffect(() => {
    clearInterval(cpuTimer.current);
    const transferSteps = [STEPS.DMA_ACTIVE, STEPS.TRANSFER_1, STEPS.TRANSFER_2, STEPS.TRANSFER_3, STEPS.TRANSFER_4];
    if (!transferSteps.includes(state.step)) {
      if (state.step === STEPS.DMA_COMPLETE || state.step === STEPS.CPU_INTERRUPT) {
        dispatch({ type: 'SET_CPU_TASK_PROGRESS', payload: 100 });
      } else {
        dispatch({ type: 'SET_CPU_TASK_PROGRESS', payload: 0 });
      }
      return;
    }
    // Animate progress from current value toward 85
    let current = state.cpuTaskProgress;
    const target = 82;
    cpuTimer.current = setInterval(() => {
      current = Math.min(current + 1, target);
      dispatch({ type: 'SET_CPU_TASK_PROGRESS', payload: current });
      if (current >= target) clearInterval(cpuTimer.current);
    }, 60);
    return () => clearInterval(cpuTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step]);

  // Clear slot highlight after 1.2 s
  useEffect(() => {
    clearTimeout(highlightTimer.current);
    if (state.highlightedSlot !== null) {
      highlightTimer.current = setTimeout(() => {
        dispatch({ type: 'CLEAR_HIGHLIGHT' });
      }, 1200);
    }
    return () => clearTimeout(highlightTimer.current);
  }, [state.highlightedSlot]);

  // Cleanup on unmount
  useEffect(() => () => clearAll(), [clearAll]);

  return {
    state,
    RAM_ADDRESSES,
    DATA_PACKETS,
    STEPS,
    actions: {
      nextStep,
      prevStep,
      reset,
      startAutoPlay,
      pause,
      resume,
      goToStep,
      togglePresentation,
    },
  };
}
