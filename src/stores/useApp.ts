import { create } from 'zustand';
import { ReactJkMusicPlayerInstance } from 'react-jinke-music-player';

import { skins } from '@styles/skin';
import { Skin } from '@styles/skins/template';

export * from '@APM/stores/useApp';

// this is a special audio intance that is passed from react-music-player
// TODO: fill in the types
// it extends NoxMedia.Song
interface RJKMAudio extends NoxMedia.Song {
  [key: string]: any;
}

interface NoxApp {
  currentAudio?: RJKMAudio;
  setCurrentAudio: (a: RJKMAudio) => void;
  currentAudioInst?: ReactJkMusicPlayerInstance;
  setCurrentAudioInst: (a: ReactJkMusicPlayerInstance) => void;
  // This is here instead of being replaced by currentPlayingList,
  // bc react-music-player needs it...
  playingList: NoxMedia.Song[];
  setplayingList: (a: NoxMedia.Song[]) => void;
  params?: any;
  setparams: (a: any) => void;
  showLyric: boolean;
  setShowLyric: (a: boolean) => void;

  playerStyle: Skin;
  setPlayerStyle: (v: string) => void;

  initialize: (init: NoxStorage.PlayerStorageObject) => void;
}

export default create<NoxApp>((set, _get) => {
  const setPlayerStyle = (v: string) => {
    const playerStyle = skins(v);
    set({
      playerStyle,
    });
  };

  return {
    setCurrentAudio: (a) => set({ currentAudio: a }),
    setCurrentAudioInst: (a) => set({ currentAudioInst: a }),
    setplayingList: (a) => set({ playingList: a }),
    playingList: [],
    setparams: (a) => set({ params: a }),
    showLyric: false,
    setShowLyric: (a) => set({ showLyric: a }),
    playerStyle: skins(),
    setPlayerStyle,
    initialize: (v) => {
      setPlayerStyle(v.settings.skin);
    },
  };
});
