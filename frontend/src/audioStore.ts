import { create } from 'zustand';

export interface AudioSong {
  index: number;
  title: string;
  artist: string;
  album: string;
}

interface AudioState {
  currentSong: AudioSong | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  setCurrentSong: (song: AudioSong | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentSong: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  setCurrentSong: (song) => set({ currentSong: song, progress: 0, duration: 0 }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  reset: () => set({ currentSong: null, isPlaying: false, progress: 0, duration: 0 }),
}));