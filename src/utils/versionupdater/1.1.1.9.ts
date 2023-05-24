import {
  setLocalStorage,
  FAV_FAV_LIST_KEY,
  dummyFavList,
} from '../ChromeStorage';

export default async function update1119() {
  console.debug('1.1.1.9 update: initialize fav-favlist');
  const list = dummyFavList('我的最爱');
  list.info.id = FAV_FAV_LIST_KEY;
  setLocalStorage(FAV_FAV_LIST_KEY, list);
}
