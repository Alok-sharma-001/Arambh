import '@testing-library/jest-dom';

// Mock Web Audio API for tests
if (typeof window !== 'undefined') {
  window.AudioContext = window.AudioContext || class MockAudioContext {
    state = 'running';
    currentTime = 0;
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {},
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
      };
    }
    destination = {};
    resume() { return Promise.resolve(); }
  };
}
