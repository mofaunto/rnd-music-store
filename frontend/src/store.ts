import { create } from 'zustand';

interface Song {
  index: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
}

interface AppState {
  lang: string;
  seed: number;
  likes: number;
  page: number;
  songs: Song[];
  isLoading: boolean;
  expandedSongId: number | null;
  currentView: 'table' | 'gallery';

  setParams: (newParams: Partial<AppState>) => void;
  fetchSongs: (baseUrl: string) => Promise<void>;
  toggleExpand: (songId: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  lang: 'en-US',
  seed: 12345,
  likes: 0,
  page: 1,
  songs: [],
  isLoading: false,
  expandedSongId: null,
  currentView: 'table',

  setParams: (newParams) => {
    set((state) => {
      const updated = { ...state, ...newParams };
      // If lang, seed, or likes change, reset page to 1
      if (newParams.lang || newParams.seed || newParams.likes) {
        updated.page = 1;
      }
      return updated;
    });
  },

  fetchSongs: async (baseUrl: string) => {
    const { lang, seed, page, likes } = get();
    set({ isLoading: true });
    try {
      const response = await fetch(`${baseUrl}/api/songs?lang=${lang}&seed=${seed}&page=${page}&likes=${likes}`);
      const data = await response.json();
      set({ songs: data.songs, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      set({ isLoading: false });
    }
  },

  toggleExpand: (songId: number) => {
    set((state) => ({
      expandedSongId: state.expandedSongId === songId ? null : songId
    }));
  }
}));