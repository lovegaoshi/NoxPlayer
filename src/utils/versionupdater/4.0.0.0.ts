import { SongListSuffix } from '../ChromeStorage';
import { loopFavLists } from './3.0.0.0';

export default function update4000() {
  console.debug(
    '4.0.0.0 update; playlist songlists are now stored separately. this is to improve load efficiency',
  );
  const updateDataStructure = (favlist?: NoxMedia.Playlist) => {
    if (!favlist) return;
    chrome.storage.local.set({
      [favlist.id]: { ...favlist, songList: [] },
    });
    chrome.storage.local.set({
      [`${favlist.id}${SongListSuffix}`]: favlist.songList,
    });
  };
  loopFavLists(updateDataStructure);
}
