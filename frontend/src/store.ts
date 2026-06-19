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
  hasMore: boolean;
  expandedSongId: number | null;
  currentView: 'table' | 'gallery';

  setParams: (newParams: Partial<AppState>) => void;
  fetchFirstPage: (baseUrl: string) => Promise<void>;
  fetchNextPage: (baseUrl: string) => Promise<void>;
  fetchPage: (baseUrl: string, targetPage: number) => Promise<void>;
  toggleExpand: (songId: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  lang: 'en-US',
  seed: 12345,
  likes: 0,
  page: 1,
  songs: [],
  isLoading: false,
  hasMore: true,
  expandedSongId: null,
  currentView: 'table',

  setParams: (newParams) => {
    set((state) => {
      const updated = { ...state, ...newParams };
      // If lang, seed, or likes change, reset page to 1
      if (newParams.lang || newParams.seed || newParams.likes || newParams.currentView) {
        updated.page = 1;
        updated.songs = [];
        updated.hasMore = true;
      }
      return updated;
    });
  },

  fetchFirstPage: async (baseUrl: string) => {
    const { lang, seed, likes } = get();
    set({ isLoading: true, page: 1 });
    try {
      const response = await fetch(
        `${baseUrl}/api/songs?lang=${lang}&seed=${seed}&page=1&likes=${likes}`
      );
      const data = await response.json();
      set({ songs: data.songs, isLoading: false, hasMore: data.songs.length > 0 });
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      set({ isLoading: false });
    }
  },

  // infinite scroll
  fetchNextPage: async (baseUrl: string) => {
    const { lang, seed, page, likes, songs } = get();
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${baseUrl}/api/songs?lang=${lang}&seed=${seed}&page=${page}&likes=${likes}`
      );
      const data = await response.json();
      set({ 
        songs: [...songs, ...data.songs], 
        page: page + 1, 
        isLoading: false,
        hasMore: data.songs.length > 0 
      });
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      set({ isLoading: false });
    }
  },

  fetchPage: async (baseUrl: string, targetPage: number) => {
    const { lang, seed, likes } = get();
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${baseUrl}/api/songs?lang=${lang}&seed=${seed}&page=${targetPage}&likes=${likes}`
      );
      const data = await response.json();
      set({ 
        songs: data.songs, 
        page: targetPage, 
        isLoading: false, 
        hasMore: data.songs.length > 0 
      });
    } catch (error) {
      console.error('Failed to fetch page:', error);
      set({ isLoading: false });
    }
  },

  toggleExpand: (songId: number) => {
    set((state) => ({
      expandedSongId: state.expandedSongId === songId ? null : songId
    }));
  }
}));