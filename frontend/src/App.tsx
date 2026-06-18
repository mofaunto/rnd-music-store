import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { useStore } from './store';
import Toolbar from './components/Toolbar';

function App() {
  const { songs, isLoading, fetchSongs } = useStore();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const debouncedFetch = useMemo(() => {
    return debounce((url: string) => {
      fetchSongs(url);
    }, 300);
  }, [fetchSongs]);

  useEffect(() => {
    if (apiBaseUrl) {
      debouncedFetch(apiBaseUrl);
    } else {
      console.error("VITE_API_BASE_URL is not defined in environment variables");
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [apiBaseUrl, debouncedFetch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Toolbar />

      <div className="max-w-4xl mx-auto px-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading songs...</div>
        ) : (
          <div className="grid gap-2">
            {songs.map((song) => (
              <div 
                key={song.index} 
                className="p-3 bg-white rounded shadow-sm flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-4 text-sm text-black">
                  <span className="font-mono text-black w-8">#{song.index}</span>
                  <span className="font-bold w-48 truncate">{song.title}</span>
                  <span className="text-black w-32 truncate">{song.artist}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-xs text-black bg-gray-500 px-2 py-1 rounded">
                    {song.genre}
                  </span>
                  <span className="text-xs text-black">
                    Likes: {song.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;