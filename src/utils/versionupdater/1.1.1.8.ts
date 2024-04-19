import { dummyPlaylistList } from '@APM/objects/Playlist';
import { StorageKeys } from '@enums/Storage';
import { setLocalStorage, readLocalStorage } from '../ChromeStorage';

export default async function update1118() {
  console.debug(
    '1.1.1.8 update: new keys are added to playlist/favlist objects.',
  );
  for (const favKey of (await readLocalStorage(
    StorageKeys.MY_FAV_LIST_KEY,
  )) as Array<string>) {
    setLocalStorage(favKey, {
      ...dummyPlaylistList,
      ...((await readLocalStorage(favKey)) as NoxMedia.Playlist),
    });
  }
}
