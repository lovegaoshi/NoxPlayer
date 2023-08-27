// vanilla store of zustand serving playbackServices.
import { createStore } from 'zustand/vanilla';
import Song from '../objects/SongInterface';

import rejson from '../utils/rejson.json';
import { LoadJSONRegExtractors } from '../utils/re';
import Logger from '../utils/Logger';

interface AppStore {
  reExtractSongName: (name: string, uploader: string | number) => string;
}

const appStore = createStore<AppStore>((set, get) => ({
  reExtractSongName: (val: string) => {
    console.warn('reExtract not implemented');
    return val;
  },
}));

export const initialize = async () => {
  let savedRegExt = rejson as NoxRegExt.JSONExtractor[];
  let reExtractSongName;
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/lovegaoshi/azusa-player-mobile/master/src/utils/rejson.json',
    );
    savedRegExt = await res.json();
    reExtractSongName = LoadJSONRegExtractors(
      savedRegExt as NoxRegExt.JSONExtractor[],
    );
  } catch (e) {
    Logger.error('failed to load rejson');
    reExtractSongName = LoadJSONRegExtractors(savedRegExt);
  }
  appStore.setState({
    reExtractSongName,
  });
};

// HACK: welp its fast enough...
export const reExtractSongName = (name: string, uploader: string | number) =>
  appStore.getState().reExtractSongName(name, String(uploader));

export const parseSongName = (song: Song) => {
  song.parsedName = reExtractSongName(song.name, song.singerId);
};

export default appStore;
