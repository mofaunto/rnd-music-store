import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Heart } from 'lucide-react';

interface SongDetails {
  cover_url: string;
  review: string;
  lyrics: string[];
}

export default function GalleryView() {
  const { 
    songs, 
    page, 
    isLoading, 
    hasMore, 
    expandedSongId, 
    toggleExpand, 
    lang, 
    seed, 
    fetchNextPage 
  } = useStore();
  
  const [details, setDetails] = useState<{ [key: number]: SongDetails }>({});
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  const lastCardRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleExpand = async (songId: number) => {
    toggleExpand(songId);
    if (expandedSongId !== songId && !details[songId]) {
      try {
        const res = await fetch(`${apiBaseUrl}/api/details/${songId}?lang=${lang}&seed=${seed}&page=${page}`);
        const data = await res.json();
        setDetails(prev => ({ ...prev, [songId]: data }));
      } catch (e) {
        console.error("Failed to load details", e);
      }
    }
  };

  useEffect(() => {
    if (isLoading || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        fetchNextPage(apiBaseUrl);
      }
    });

    if (lastCardRef.current) {
      observerRef.current.observe(lastCardRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isLoading, hasMore, songs.length, apiBaseUrl, fetchNextPage]);

  return (
    <div className="w-full">
      {songs.length === 0 && !isLoading ? (
        <div className="text-center py-20 text-gray-400">No songs loaded. Please adjust parameters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs.map((song, index) => {
            const isExpanded = expandedSongId === song.index;
            const detailData = details[song.index];
            const pageForCover = Math.ceil(song.index / 10);
            const coverUrl = `${apiBaseUrl}/api/cover/${song.index}?lang=${lang}&seed=${seed}&page=${pageForCover}&title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`;

            return (
              <div 
                key={`${song.index}-${page}`}
                ref={index === songs.length - 1 ? lastCardRef : null}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                onClick={() => handleExpand(song.index)}
              >
                <div className="relative w-full aspect-square bg-gray-100">
                  <img 
                    key={`${song.index}-${page}`}
                    src={coverUrl} 
                    alt={`${song.title} cover`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    />
                  <div className="absolute top-2 right-2 bg-black/60 flex flex-col items-center justify-center text-white text-xs font-medium px-2 py-1 gap-1 rounded-full">
                    <Heart className="w-3 h-3 fill-current" />
                    {song.likes}
                  </div>
                </div>

                <div className="p-4 grow flex flex-col">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">{song.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{song.artist}</p>
                  <div className="mt-auto flex justify-between items-center text-xs">
                    <span className="text-gray-400 bg-gray-100 px-2 py-1 rounded">{song.genre}</span>
                    <span className="text-gray-400 font-mono">#{song.index}</span>
                  </div>
                </div>

                {isExpanded && detailData && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 text-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <button className="px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-colors">
                        ▶ Play Preview
                      </button>
                    </div>
                    <div className="text-gray-600 italic leading-relaxed text-xs">
                      "{detailData.review}"
                    </div>
                    <div className="text-gray-500 border-l-2 border-blue-300 pl-3 text-xs space-y-1">
                      {detailData.lyrics.map((line: string, idx: number) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {isExpanded && !detailData && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 text-xs text-gray-400 text-center">
                    Loading details...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isLoading && songs.length > 0 && (
        <div className="flex justify-center py-10 text-gray-400">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}