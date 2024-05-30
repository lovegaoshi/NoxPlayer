import { dummyPlaylistList } from '@APM/objects/Playlist';
import { saveItem, getItem, getPlaylistIds } from '../ChromeStorage';

export default async function update1118() {
  console.debug(
    '1.1.1.8 update: new keys are added to playlist/favlist objects.',
  );
  (await getPlaylistIds()).forEach(async (favKey) =>
    saveItem(favKey, {
      ...dummyPlaylistList,
      ...((await getItem(favKey)) as NoxMedia.Playlist),
    }),
  );
}
