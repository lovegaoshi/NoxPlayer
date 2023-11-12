// zustand hooked app state store. for the non zustand vanilla uses.
import { create } from 'zustand';

interface NoxStore {
  playlistRefreshProgress: number;
  setPlaylistRefreshProgress: (val: number) => void;
}

const useNoxStore = create<NoxStore>((set, get) => ({
  playlistRefreshProgress: 100,
  setPlaylistRefreshProgress: (val: number) =>
    set({
      playlistRefreshProgress: val,
    }),
}));

export default useNoxStore;
