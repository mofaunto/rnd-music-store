import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { useStore } from './store';
import Toolbar from './components/Toolbar';
import TableView from './components/TableView';

function App() {
  const { fetchSongs, lang, seed, likes, page, currentView } = useStore();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const debouncedFetch = useMemo(() => {
    return debounce(() => {
      if (apiBaseUrl) {
        fetchSongs(apiBaseUrl);
      }
    }, 300);
  }, [fetchSongs, apiBaseUrl]);

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [lang, seed, likes, page, debouncedFetch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Toolbar />
      <div className="max-w-6xl mx-auto px-4">
        {currentView === 'table' ? <TableView /> : <div>Hello World!</div>}
      </div>
    </div>
  );
}

export default App;