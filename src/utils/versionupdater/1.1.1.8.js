import {
  setLocalStorage, readLocalStorage, MY_FAV_LIST_KEY, dummyFavListFromList,
} from '../ChromeStorage';

export default async function update1118 () {
  console.debug('1.1.1.8 update: new keys are added to playlist/favlist objects.');
  for (const favKey of await readLocalStorage(MY_FAV_LIST_KEY)) {
    setLocalStorage(favKey, dummyFavListFromList(await readLocalStorage(favKey)));
  }
}
