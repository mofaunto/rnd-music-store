import React, { useState } from 'react';
import { useStore } from '../store';

export default function TableView() {
  const { songs, page, isLoading, expandedSongId, toggleExpand, setParams, lang, seed } = useStore();
  const [details, setDetails] = useState<{ [key: number]: any }>({});
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Song</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Likes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">Loading...</td></tr>
            ) : (
              songs.map((song) => {
                const isExpanded = expandedSongId === song.index;
                const detailData = details[song.index];

                return (
                  <React.Fragment key={song.index}>
                    <tr 
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-blue-50' : ''}`}
                      onClick={() => handleExpand(song.index)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{song.index}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{song.title}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{song.artist}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{song.album}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{song.genre}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{song.likes}</td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-gray-50 border-b border-t border-gray-200">
                        <td colSpan={6} className="px-4 py-6">
                          {detailData ? (
                            <div className="flex flex-col sm:flex-row gap-6">
                              <div className="flex-shrink-0 flex justify-center sm:justify-start">
                                <img 
                                  src={detailData.cover_url} 
                                  alt="Album Cover" 
                                  className="w-32 h-32 rounded-lg shadow-md object-cover bg-gray-200"
                                />
                              </div>
                              <div className="flex-grow space-y-3">
                                <div className="flex items-center gap-4">
                                  <button className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors">
                                    Play Preview
                                  </button>
                                </div>
                                <div className="text-sm text-gray-700 italic bg-white p-3 rounded border border-gray-200">
                                  {detailData.review}
                                </div>
                                <div className="text-sm text-gray-600 border-l-4 border-gray-300 pl-3 py-1">
                                  {detailData.lyrics.map((line: string, idx: number) => (
                                    <div key={idx} className="py-0.5">{line}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400 text-center py-4">Loading details...</div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white px-4 py-4 border-t border-gray-200 flex items-center justify-between">
        <button
          onClick={() => page > 1 && setParams({ page: page - 1 })}
          disabled={page <= 1}
          className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page <span className="font-medium">{page}</span>
        </span>
        <button
          onClick={() => setParams({ page: page + 1 })}
          className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}