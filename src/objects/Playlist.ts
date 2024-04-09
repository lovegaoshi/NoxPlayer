import { PlaylistTypes } from '@APM/enums/Playlist';

export * from '@APM/objects/Playlist';

export const parseSongList = (
  favList: NoxMedia.Playlist,
  loadPlaylistAsArtist = false,
) => {
  if (
    favList.type !== PlaylistTypes.TYPE_SEARCH_PLAYLIST &&
    loadPlaylistAsArtist
  ) {
    return favList.songList.map((song) => ({
      ...song,
      singer: favList.title,
    }));
  }
  return favList.songList;
};
