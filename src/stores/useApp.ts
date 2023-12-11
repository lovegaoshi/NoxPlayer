import type { NoxStorage } from '@APM/types/storage';
import { create } from 'zustand';
import { skins } from '@styles/skin';
import { SkinInterface } from '@styles/skins/template';
import { SerializedStyles, css } from '@emotion/react';

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
  playerStyle: SkinInterface;
  setPlayerStyle: (v: string) => void;
  buttonStyle: SerializedStyles;
  initialize: (init: NoxStorage.PlayerStorageObject) => void;
}

export default create<NoxApp>((set, get) => {
  const setPlayerStyle = (v: string) => {
    const playerStyle = skins(v);
    set({ playerStyle });
    set({
      buttonStyle: css`
        cursor: pointer;
        &:hover {
          color: ${playerStyle.reactJKPlayerTheme.sliderColor};
        }
        background-color: transparent;
        color: ${playerStyle.desktopTheme === 'light' ? '7d7d7d' : 'white'};
      `,
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
    buttonStyle: css``,
    initialize: (v) => {
      setPlayerStyle(v.settings.skin);
    },
  };
});
