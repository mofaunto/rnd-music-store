import { play, pause, resume, togglePlay, stop } from '../audioManager';
import { useAudioStore } from '../audioStore';

export const useAudioPlayer = () => {
  const { currentSong, isPlaying } = useAudioStore();

  return {
    play,
    pause,
    resume,
    togglePlay,
    stop,
    isPlaying,
    currentSong,
  };
};