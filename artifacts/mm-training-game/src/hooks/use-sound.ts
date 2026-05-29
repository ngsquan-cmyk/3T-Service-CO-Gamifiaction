import { useRef, useCallback, useEffect } from 'react';

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
  }, []);

  useEffect(() => {
    const handleInteraction = () => initAudio();
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [initAudio]);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number) => {
    if (!ctxRef.current) return;
    const osc = ctxRef.current.createOscillator();
    const gain = ctxRef.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctxRef.current.currentTime);
    
    gain.gain.setValueAtTime(vol, ctxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctxRef.current.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctxRef.current.destination);
    
    osc.start();
    osc.stop(ctxRef.current.currentTime + duration);
  }, []);

  const correct = useCallback(() => {
    initAudio();
    playTone(600, 'sine', 0.1, 0.5);
    setTimeout(() => playTone(800, 'sine', 0.2, 0.5), 100);
  }, [initAudio, playTone]);

  const wrong = useCallback(() => {
    initAudio();
    playTone(200, 'sawtooth', 0.3, 0.5);
  }, [initAudio, playTone]);

  const scan = useCallback(() => {
    initAudio();
    playTone(1200, 'square', 0.05, 0.2);
  }, [initAudio, playTone]);

  const levelComplete = useCallback(() => {
    initAudio();
    [400, 500, 600, 800].forEach((f, i) => {
      setTimeout(() => playTone(f, 'sine', 0.15, 0.4), i * 100);
    });
  }, [initAudio, playTone]);

  const gameComplete = useCallback(() => {
    initAudio();
    [400, 500, 600, 800, 1000, 1200].forEach((f, i) => {
      setTimeout(() => playTone(f, 'sine', i === 5 ? 0.6 : 0.15, 0.4), i * 150);
    });
  }, [initAudio, playTone]);

  return { correct, wrong, scan, levelComplete, gameComplete, initAudio };
}
