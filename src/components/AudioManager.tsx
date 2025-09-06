import { useEffect, useRef } from 'react';

export interface AudioManagerProps {
  isEnabled?: boolean;
  volume?: number;
}

export interface AudioManagerRef {
  playBootSound: (index: number) => Promise<void>;
  playTypingSound: () => Promise<void>;
  playNavigationSound: (direction: 'up' | 'down') => Promise<void>;
  playSelectionSound: () => Promise<void>;
  playBackgroundAmbient: () => Promise<void>;
  stopBackgroundAmbient: () => void;
  playTransitionSound: () => Promise<void>;
  playCompletionSound: () => Promise<void>;
}

// Create synthetic audio using Web Audio API for fallback
const createSyntheticSound = (
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  waveType: OscillatorType = 'square'
): Promise<void> => {
  return new Promise((resolve) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = waveType;
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Much quieter
    gainNode.gain.exponentialRampToValueAtTime(0.005, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    oscillator.onended = () => resolve();
  });
};

export const useAudioManager = (props: AudioManagerProps = {}): AudioManagerRef => {
  const { isEnabled = true, volume = 0.3 } = props;
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundAudioRef = useRef<OscillatorNode | null>(null);
  const backgroundGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (isEnabled) {
      // Initialize Web Audio API
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isEnabled]);

  const playBootSound = async (index: number): Promise<void> => {
    if (!isEnabled || !audioContextRef.current) return;
    
    // Different frequencies for each boot line - softer, more pleasant
    const frequencies = [300, 350, 400, 450, 500];
    const frequency = frequencies[index % frequencies.length];
    
    await createSyntheticSound(audioContextRef.current, frequency, 0.2, 'sine'); // Shorter, softer sine wave
  };

  const playTypingSound = async (): Promise<void> => {
    if (!isEnabled || !audioContextRef.current) return;
    
    // Softer typing sound - more like gentle keystrokes
    const frequency = 400 + Math.random() * 100; // Lower, softer frequency range
    await createSyntheticSound(audioContextRef.current, frequency, 0.02, 'sine'); // Shorter, sine wave
  };

  const playNavigationSound = async (direction: 'up' | 'down'): Promise<void> => {
    if (!isEnabled || !audioContextRef.current) return;
    
    const frequency = direction === 'up' ? 600 : 500;
    await createSyntheticSound(audioContextRef.current, frequency, 0.1, 'sine');
  };

  const playSelectionSound = async (): Promise<void> => {
    if (!isEnabled || !audioContextRef.current) return;
    
    // Softer confirmation beep - gentle two-tone
    await createSyntheticSound(audioContextRef.current, 500, 0.08, 'sine'); // Lower, shorter
    setTimeout(async () => {
      await createSyntheticSound(audioContextRef.current!, 600, 0.08, 'sine'); // Lower, shorter
    }, 80);
  };

  const playBackgroundAmbient = async (): Promise<void> => {
    if (!isEnabled || !audioContextRef.current || backgroundAudioRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(80, audioContextRef.current.currentTime); // Slightly higher, less harsh
      oscillator.type = 'sine'; // Much softer than sawtooth
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.03, audioContextRef.current.currentTime + 3); // Much quieter and slower fade-in
      
      oscillator.start();
      
      backgroundAudioRef.current = oscillator;
      backgroundGainRef.current = gainNode;
    } catch (error) {
      console.warn('Could not start background ambient:', error);
    }
  };

  const stopBackgroundAmbient = (): void => {
    if (backgroundAudioRef.current && backgroundGainRef.current) {
      backgroundGainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current!.currentTime + 1);
      setTimeout(() => {
        backgroundAudioRef.current?.stop();
        backgroundAudioRef.current = null;
        backgroundGainRef.current = null;
      }, 1000);
    }
  };

  const playTransitionSound = async (): Promise<void> => {
    if (!isEnabled || !audioContextRef.current) return;
    
    // Descending transition sound
    for (let i = 0; i < 5; i++) {
      const frequency = 1000 - (i * 100);
      setTimeout(async () => {
        await createSyntheticSound(audioContextRef.current!, frequency, 0.2, 'sine');
      }, i * 100);
    }
  };

  const playCompletionSound = async (): Promise<void> => {
    if (!isEnabled || !audioContextRef.current) return;
    
    // Success completion sound - ascending triumphant tones
    const completionSequence = [400, 500, 600, 800, 1000];
    for (let i = 0; i < completionSequence.length; i++) {
      setTimeout(async () => {
        await createSyntheticSound(audioContextRef.current!, completionSequence[i], 0.3, 'sine');
      }, i * 200);
    }
    
    // Final sustained tone
    setTimeout(async () => {
      await createSyntheticSound(audioContextRef.current!, 1200, 0.6, 'sine');
    }, completionSequence.length * 200);
  };

  return {
    playBootSound,
    playTypingSound,
    playNavigationSound,
    playSelectionSound,
    playBackgroundAmbient,
    stopBackgroundAmbient,
    playTransitionSound,
    playCompletionSound,
  };
};