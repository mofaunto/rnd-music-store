import { useStore } from '../store';
import { Table, LayoutGrid, Music, Download } from 'lucide-react';

export default function Toolbar() {
  const { lang, seed, likes, currentView, setParams } = useStore();

  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    setParams({ seed: newSeed });
  };

  const handleExport = () => {
    const { lang, seed, page, likes } = useStore.getState();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${apiBaseUrl}/api/export/zip?lang=${lang}&seed=${seed}&page=${page}&likes=${likes}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `songs_page_${page}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm mb-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
          <Music size={16} />
        </div>
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">Music Store</h1>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 bg-gray-50 px-6 py-3 rounded-2xl w-full lg:w-auto border border-gray-200 shadow-sm">
        
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lang</label>
          <select
            value={lang}
            onChange={(e) => setParams({ lang: e.target.value })}
            className="bg-transparent border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en-US">EN</option>
            <option value="ru-RU">RU</option>
          </select>
        </div>

        <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Seed</label>
          <input
            type="number"
            value={seed}
            onChange={(e) => setParams({ seed: Number(e.target.value) })}
            className="w-28 bg-transparent border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={generateRandomSeed}
            className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors"
          >
            Random
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>

        <div className="flex items-center gap-3 flex-1 min-w-35">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Likes {likes.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={likes}
            onChange={(e) => setParams({ likes: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center bg-gray-100 p-1 rounded-lg shrink-0">
        <button
          onClick={() => setParams({ currentView: 'table' })}
          className={`hover:cursor-pointer p-2 rounded-md transition-colors flex items-center justify-center ${
            currentView === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
          title="Table View"
        >
          <Table size={18} />
        </button>
        <button
          onClick={() => setParams({ currentView: 'gallery' })}
          className={`hover:cursor-pointer p-2 rounded-md transition-colors flex items-center justify-center ${
            currentView === 'gallery' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
          title="Gallery View"
        >
          <LayoutGrid size={18} />
        </button>

        <button
        onClick={handleExport}
        className="hover:cursor-pointer p-2 text-gray-500 hover:text-blue-600 transition-colors"
        title="Download MP3 ZIP"
      >
        <Download size={18} />
      </button>
      </div>

    </div>
  );
}