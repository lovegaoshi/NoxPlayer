import { dummyFavListFromList } from '@objects/Playlist';
import { MY_FAV_LIST_KEY } from '@objects/Storage2';
import { setLocalStorage, readLocalStorage } from '../ChromeStorage';

export default async function update1118() {
  console.debug(
    '1.1.1.8 update: new keys are added to playlist/favlist objects.',
  );
  for (const favKey of (await readLocalStorage(
    MY_FAV_LIST_KEY,
  )) as Array<string>) {
    setLocalStorage(
      favKey,
      dummyFavListFromList(
        (await readLocalStorage(favKey)) as NoxMedia.Playlist,
      ),
    );
  }
}
