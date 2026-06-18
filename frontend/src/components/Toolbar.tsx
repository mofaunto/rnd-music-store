import { useStore } from '../store';

export default function Toolbar() {
  const { lang, seed, likes, setParams } = useStore();

  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    setParams({ seed: newSeed });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-100 shadow-sm mb-6">

      {/* lang selector*/}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Language</label>
        <select
          value={lang}
          onChange={(e) => setParams({ lang: e.target.value })}
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en-US">English (US)</option>
          <option value="ru-RU">Russian (RU)</option>
        </select>
      </div>

      {/* seed input */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Seed</label>
        <input
          type="number"
          value={seed}
          onChange={(e) => setParams({ seed: Number(e.target.value) })}
          className="w-32 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateRandomSeed}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          Random
        </button>
      </div>

      {/* like slider */}
      <div className="flex items-center gap-2 flex-1 max-w-xs">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Likes: {likes.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={likes}
          onChange={(e) => setParams({ likes: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
}