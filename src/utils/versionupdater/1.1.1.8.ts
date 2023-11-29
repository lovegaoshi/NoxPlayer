import { dummyPlaylistList } from '@APM/objects/Playlist';
import { STORAGE_KEYS } from '@enums/Storage';
import { setLocalStorage, readLocalStorage } from '../ChromeStorage';

export default async function update1118() {
  console.debug(
    '1.1.1.8 update: new keys are added to playlist/favlist objects.',
  );
  for (const favKey of (await readLocalStorage(
    STORAGE_KEYS.MY_FAV_LIST_KEY,
  )) as Array<string>) {
    setLocalStorage(favKey, {
      ...dummyPlaylistList,
      ...((await readLocalStorage(favKey)) as NoxMedia.Playlist),
    });
  }
}
