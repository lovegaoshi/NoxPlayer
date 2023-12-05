import type { NoxStorage } from '@APM/types/storage';
import { create } from 'zustand';

export * from '@APM/stores/useApp';

// this is a special audio intance that is passed from react-music-player
// TODO: fill in the types
// it extends NoxMedia.Song
interface RJKMAudio extends NoxMedia.Song {
  [key: string]: any;
}

interface RJKMSetting extends NoxStorage.PlayerSettingDict {
  [key: string]: any;
}

interface NoxApp {
  currentAudio?: RJKMAudio;
  setCurrentAudio: (a: RJKMAudio) => void;
  currentAudioInst?: any;
  setCurrentAudioInst: (a: any) => void;
  // This is here instead of being replaced by currentPlayingList,
  // bc react-music-player needs it...
  playingList: NoxMedia.Song[];
  setplayingList: (a: NoxMedia.Song[]) => void;
  params?: any;
  setparams: (a: any) => void;
  showLyric: boolean;
  setShowLyric: (a: boolean) => void;
}

export default create<NoxApp>((set, get) => ({
  setCurrentAudio: (a) => set({ currentAudio: a }),
  setCurrentAudioInst: (a) => set({ currentAudioInst: a }),
  setplayingList: (a) => set({ playingList: a }),
  playingList: [],
  setparams: (a) => set({ params: a }),
  showLyric: false,
  setShowLyric: (a) => set({ showLyric: a }),
}));
