import { useEffect } from 'react';
import { useAudioStore } from '../audioStore';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useStore } from '../store';
import { Play, Pause, X, SkipBack, SkipForward } from 'lucide-react';

export default function PlayerBar() {
  const { currentSong, isPlaying } = useAudioStore();
  const { togglePlay, play, stop } = useAudioPlayer();
  const { songs, seed, lang, page } = useStore();

  useEffect(() => {
    stop();
  }, [seed, page, stop]);

  if (!currentSong) return null;

  const currentIndex = songs.findIndex((s) => s.index === currentSong.index);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < songs.length - 1 && currentIndex !== -1;

  const handlePrev = () => {
    if (hasPrev) {
      const prevSong = songs[currentIndex - 1];
      const audioUrl = `${import.meta.env.VITE_API_BASE_URL}/api/audio/${prevSong.index}?seed=${seed}&page=${page}`;
      play(
        { index: prevSong.index, title: prevSong.title, artist: prevSong.artist, album: prevSong.album },
        audioUrl,
        seed,
        page
      );
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextSong = songs[currentIndex + 1];
      const audioUrl = `${import.meta.env.VITE_API_BASE_URL}/api/audio/${nextSong.index}?seed=${seed}&page=${page}`;
      play(
        { index: nextSong.index, title: nextSong.title, artist: nextSong.artist, album: nextSong.album },
        audioUrl,
        seed,
        page
      );
    }
  };

  const coverUrl = `${import.meta.env.VITE_API_BASE_URL}/api/cover/${currentSong.index}?lang=${lang}&seed=${seed}&page=${page}&title=${encodeURIComponent(currentSong.title)}&artist=${encodeURIComponent(currentSong.artist)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-7xl mx-auto bg-white border-t border-gray-200 shadow-lg p-3 flex items-center gap-4 z-50">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="shrink-0 w-12 h-12 bg-gray-200 rounded overflow-hidden">
          <img key={`${currentSong.index}-${seed}-${page}`} src={coverUrl} alt="cover" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-medium truncate">{currentSong.title}</span>
          <span className="text-sm text-gray-500 truncate">{currentSong.artist}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={togglePlay}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNext}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
        >
          <SkipForward size={20} />
        </button>

        <button
          onClick={stop}
          className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}