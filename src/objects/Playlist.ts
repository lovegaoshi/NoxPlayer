import { v4 as uuidv4 } from 'uuid';

export * from '@APM/objects/Playlist';

export const defaultSearchList = ({
  songList = [],
  info = { title: '搜索歌单', id: `FavList-Special-Search-${uuidv4()}` },
}) => {
  const newList = dummyFavList('');
  newList.songList = songList;
  newList.title = info.title;
  newList.id = info.id;
  return newList;
};

export const dummyFavList = (favName: string): NoxMedia.Playlist => {
  return {
    songList: [],
    title: favName,
    id: `FavList-${uuidv4()}`,
    // this is not a Set because we need to serialize this
    // for importing/exporting playlists.
    subscribeUrl: [],
    useBiliShazam: false,
    biliSync: false,
    blacklistedUrl: [],
    lastSubscribed: 0,
    type: 'typical',
  };
};

export const dummyFavListFromList = (
  list: NoxMedia.Playlist,
): NoxMedia.Playlist => {
  return { ...dummyFavList(''), ...list };
};

export const dummyFavFavList = () => {
  const favfavlist = dummyFavList('我的最爱');
  favfavlist.id = 'FavList-Special-Favorite';
  return favfavlist;
};
