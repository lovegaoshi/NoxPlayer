import { dummyFavList } from '@objects/Playlist';
import { STORAGE_KEYS } from '@enums/Storage';
import { setLocalStorage } from '../ChromeStorage';

export default async function update1119() {
  console.debug('1.1.1.9 update: initialize fav-favlist');
  const list = dummyFavList('我的最爱');
  list.id = STORAGE_KEYS.FAVORITE_PLAYLIST_KEY;
  setLocalStorage(STORAGE_KEYS.FAVORITE_PLAYLIST_KEY, list);
}
