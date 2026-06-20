import type { AudioSong } from './audioStore';
import { useAudioStore } from './audioStore';

let audioContext: AudioContext | null = null;
let sourceNode: AudioBufferSourceNode | null = null;
let audioBuffer: AudioBuffer | null = null;
let startTime = 0;
let pausedAt = 0;
let animFrameId: number | null = null;
let currentSong: AudioSong | null = null;
let lastSeed = 12345;
let lastPage = 1;

const getContext = (): AudioContext => {
  if (!audioContext) {
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioCtor();
  }
  return audioContext;
};

const stopCurrent = () => {
  if (sourceNode) {
    try { sourceNode.stop(); } catch (error) { console.error('stop error', error); }
    sourceNode.disconnect();
    sourceNode = null;
  }
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  useAudioStore.getState().setIsPlaying(false);
};

const updateProgress = () => {
  if (!audioContext || !sourceNode || !currentSong) return;
  const elapsed = audioContext.currentTime - startTime;
  const duration = audioBuffer?.duration || 0;
  if (elapsed >= duration - 0.1) {
    stopCurrent();
    useAudioStore.getState().reset();
    return;
  }
  if (useAudioStore.getState().isPlaying) {
    animFrameId = requestAnimationFrame(updateProgress);
  }
};

export const play = async (song: AudioSong, audioUrl: string, seed: number, page: number) => {
  const ctx = getContext();
  if (ctx.state === 'suspended') await ctx.resume();

  if (currentSong?.index === song.index && useAudioStore.getState().isPlaying) {
    return;
  }

  stopCurrent();

  try {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBufferData = await ctx.decodeAudioData(arrayBuffer);
    audioBuffer = audioBufferData;
    currentSong = song;
    lastSeed = seed;
    lastPage = page;

    const source = ctx.createBufferSource();
    source.buffer = audioBufferData;

    const rate = 0.85 + ((seed ^ song.index) % 100) / 500.0;
    source.playbackRate.value = rate;

    const delay = ctx.createDelay(2.0);
    delay.delayTime.value = 0.3;
    const gain = ctx.createGain();
    gain.gain.value = 0.5;

    source.connect(ctx.destination);
    source.connect(delay);
    delay.connect(gain);
    gain.connect(ctx.destination);

    sourceNode = source;

    useAudioStore.getState().setDuration(audioBufferData.duration);
    useAudioStore.getState().setCurrentSong(song);
    useAudioStore.getState().setIsPlaying(true);

    startTime = ctx.currentTime;
    pausedAt = 0;

    source.start();
    animFrameId = requestAnimationFrame(updateProgress);
  } catch (error) {
    console.error('Play error:', error);
    stopCurrent();
    useAudioStore.getState().reset();
  }
};

export const pause = async () => {
  const ctx = audioContext;
  if (!ctx || !useAudioStore.getState().isPlaying) return;
  if (ctx.state === 'running') {
    await ctx.suspend();
    useAudioStore.getState().setIsPlaying(false);
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    pausedAt = ctx.currentTime - startTime;
  }
};

export const resume = async () => {
  const ctx = audioContext;
  if (!ctx || useAudioStore.getState().isPlaying) return;
  if (!currentSong || !audioBuffer) {
    if (currentSong) {
      const audioUrl = `${import.meta.env.VITE_API_BASE_URL}/api/audio/${currentSong.index}?seed=${lastSeed}&page=${lastPage}`;
      await play(currentSong, audioUrl, lastSeed, lastPage);
    }
    return;
  }
  if (ctx.state === 'suspended') {
    await ctx.resume();
    useAudioStore.getState().setIsPlaying(true);
    startTime = ctx.currentTime - pausedAt;
    animFrameId = requestAnimationFrame(updateProgress);
  }
};

export const togglePlay = async () => {
  if (useAudioStore.getState().isPlaying) {
    await pause();
  } else if (currentSong) {
    await resume();
  }
};

export const stop = () => {
  stopCurrent();
  useAudioStore.getState().reset();
};