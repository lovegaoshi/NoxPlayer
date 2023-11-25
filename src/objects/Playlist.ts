import { v4 as uuidv4 } from 'uuid';

export * from '@APM/objects/Playlist';

export const defaultSearchList = ({
  songList = [],
  info = { title: '搜索歌单', id: `FavList-Special-Search-${uuidv4()}` },
}) => {
  const newList = dummyFavList('');
  newList.songList = songList;
  newList.info = info;
  return newList;
};

export const dummyFavList = (favName: string): NoxMedia.Playlist => {
  return {
    songList: [],
    info: { title: favName, id: `FavList-${uuidv4()}` },
    title: favName,
    id: `FavList-${uuidv4()}`,
    // this is not a Set because we need to serialize this
    // for importing/exporting playlists.
    subscribeUrls: [],
    settings: {
      autoRSSUpdate: false,
    },
    useBiliShazam: false,
    biliSync: false,
    bannedBVids: [],
    showFavoriteList: false,
  };
};

export const dummyFavListFromList = (
  list: NoxMedia.Playlist,
): NoxMedia.Playlist => {
  return { ...dummyFavList(''), ...list };
};

export const dummyFavFavList = () => {
  const favfavlist = dummyFavList('我的最爱');
  favfavlist.info.id = 'FavList-Special-Favorite';
  return favfavlist;
};
