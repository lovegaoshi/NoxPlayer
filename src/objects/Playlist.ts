import { v4 as uuidv4 } from 'uuid';
import { dummyFavList } from '../utils/ChromeStorage';

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
