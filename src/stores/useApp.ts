/**
 * to avoid excessive prop drilling, some use usePlayer's methods will be stored
 * in this store so that they can be accessed from anywhere.
 * 
  onPlayOneFromFav,
  onPlayAllFromFav,

 */

import { create } from 'zustand';

// this is a special audio intance that is passed from react-music-player
// TODO: fill in the types
// it extends NoxMedia.Song
interface AudioObject extends NoxMedia.Song {
  [key: string]: any;
}

interface NoxApp {
  currentAudio?: AudioObject;
  setCurrentAudio: (a: AudioObject) => void;
  currentAudioInst?: any;
  setCurrentAudioInst: (a: any) => void;
  // This is here instead of being replaced by currentPlayingList,
  // bc react-music-player needs it...
  playingList: NoxMedia.Song[];
  setplayingList: (a: NoxMedia.Song[]) => void;
}

const useApp = create<NoxApp>((set, get) => ({
  setCurrentAudio: (a) => set({ currentAudio: a }),
  setCurrentAudioInst: (a) => set({ currentAudioInst: a }),
  setplayingList: (a) => set({ playingList: a }),
  playingList: [],
}));

export default useApp;
