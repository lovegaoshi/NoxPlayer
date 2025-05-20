import { create } from 'zustand';
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerInstance,
} from 'react-jinke-music-player';

import { skins } from '@styles/skin';
import { Skin } from '@styles/skins/template';

export * from '@APM/stores/useApp';

interface NoxApp {
  currentAudio?: NoxMediaChrome.RJKMAudio;
  setCurrentAudio: (a: NoxMediaChrome.RJKMAudio) => void;
  currentAudioInst?: ReactJkMusicPlayerInstance;
  setCurrentAudioInst: (a: ReactJkMusicPlayerInstance) => void;
  RJKMref?: ReactJkMusicPlayer;
  setRJKMref: (a: ReactJkMusicPlayer) => void;
  currentProgress: number;
  setCurrentProgress: (a: number) => void;
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

export default create<NoxApp>((set) => {
  const setPlayerStyle = (v: string) => {
    const playerStyle = skins(v);
    set({
      playerStyle,
    });
  };

  return {
    setCurrentAudio: (a) => set({ currentAudio: a }),
    setCurrentAudioInst: (a) => set({ currentAudioInst: a }),
    setRJKMref: (a) => set({ RJKMref: a }),
    currentProgress: 0,
    setCurrentProgress: (a) => set({ currentProgress: a }),
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
