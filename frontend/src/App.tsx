import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { useStore } from './store';
import Toolbar from './components/Toolbar';
import TableView from './components/TableView';
import GalleryView from './components/GalleryView';
import PlayerBar from './components/PlayerBar';

function App() {
  const { fetchFirstPage, lang, seed, likes, currentView,songs } = useStore();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const debouncedFirstFetch = useMemo(() => {
    return debounce(() => {
      if (apiBaseUrl) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        fetchFirstPage(apiBaseUrl);
      }
    }, 300);
  }, [fetchFirstPage, apiBaseUrl]);

  useEffect(() => {
    if (songs.length === 0) {
      debouncedFirstFetch();
    }
    
    return () => debouncedFirstFetch.cancel();
  }, [lang, seed, likes, songs.length, debouncedFirstFetch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toolbar />
      <div className="max-w-7xl mx-auto px-4">
        {currentView === 'table' ? <TableView /> : <GalleryView />}
      </div>
      <PlayerBar />
    </div>
  );
}

export default App;