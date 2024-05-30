import { dummyPlaylistList } from '@APM/objects/Playlist';
import { StorageKeys } from '@enums/Storage';
import { saveItem, getItem } from '../ChromeStorage';

export default async function update1118() {
  console.debug(
    '1.1.1.8 update: new keys are added to playlist/favlist objects.',
  );
  for (const favKey of (await getItem(
    StorageKeys.MY_FAV_LIST_KEY,
  )) as string[]) {
    saveItem(favKey, {
      ...dummyPlaylistList,
      ...((await getItem(favKey)) as NoxMedia.Playlist),
    });
  }
}
