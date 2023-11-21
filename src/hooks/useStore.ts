// zustand hooked app state store. for the non zustand vanilla uses.
import { create } from 'zustand';

interface NoxStore {
  playlistRefreshProgress: number;
  setPlaylistRefreshProgress: (val: number) => void;
}

const useNoxStore = create<NoxStore>((set, get) => ({
  playlistRefreshProgress: 100,
  setPlaylistRefreshProgress: (playlistRefreshProgress: number) => {
    set({ playlistRefreshProgress });
  },
}));

export default useNoxStore;
