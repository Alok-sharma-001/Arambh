import { useState, useEffect } from 'react';
import { audioEngine } from '../lib/audioEngine';

export function useAudio() {
  const [isMuted, setIsMuted] = useState(() => audioEngine.isAudioMuted());
  const [volume, setVolumeState] = useState(() => audioEngine.getVolume());

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  const setVolume = (newVol: number) => {
    setVolumeState(newVol);
    audioEngine.setVolume(newVol);
  };

  return {
    isMuted,
    volume,
    toggleMute,
    setVolume,
    playClick: () => audioEngine.playClick(),
    playChime: () => audioEngine.playChime(),
    playThud: () => audioEngine.playThud(),
    playFanfare: () => audioEngine.playFanfare(),
  };
}
