import { useRef } from 'react';

import playerSettingStore from '@APM/stores/playerSettingStore';
import { fetchPlayUrlPromise } from '@APM/utils/mediafetch/resolveURL';
import { useNoxSetting } from '@APM/stores/useApp';
import useApp from '@stores/useApp';
import { parseSongList } from '@objects/Playlist';
import renderExtendsContent from '@components/App/ExtendContent';
import { Source } from '@APM/enums/MediaFetch';
import { DEFAULT_NULL_URL } from '@objects/Song';
import { MUSICFREE } from '@utils/mediafetch/musicfree';
import r128gain from '../utils/ffmpeg/r128util';
import {
  checkBiliVideoPlayed,
  initBiliHeartbeat,
} from '../utils/Bilibili/BiliOperate';
import { saveLastPlayDuration } from '../utils/ChromeStorage';

const SkipR128Source: (Source | undefined | MUSICFREE)[] = [Source.biliLive];

export default () => {
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const currentPlayingId = useNoxSetting((state) => state.currentPlayingId);
  const setCurrentPlayingList = useNoxSetting(
    (state) => state.setCurrentPlayingList,
  );
  const setPlayerSettings = useNoxSetting((state) => state.setPlayerSetting);
  const setCurrentPlayingId = useNoxSetting(
    (state) => state.setCurrentPlayingId,
  );
  const setSelectedList = useNoxSetting((state) => state.setCurrentPlaylist);
  const searchList = useNoxSetting((state) => state.searchPlaylist);
  const setSearchList = useNoxSetting((state) => state.setSearchPlaylist);

  const currentAudio = useApp((state) => state.currentAudio);
  const setCurrentAudio = useApp((state) => state.setCurrentAudio);
  const currentAudioInst = useApp((state) => state.currentAudioInst);
  const setCurrentAudioInst = useApp((state) => state.setCurrentAudioInst);
  const setCurrentProgress = useApp((state) => state.setCurrentProgress);
  const playingList = useApp((state) => state.playingList);
  const setplayingList = useApp((state) => state.setplayingList);
  const params = useApp((state) => state.params);
  const setparams = useApp((state) => state.setparams);
  const showLyric = useApp((state) => state.showLyric);
  const setShowLyric = useApp((state) => state.setShowLyric);

  const biliHeartbeat = useRef(0);

  const parseR128Gain = async (
    song: NoxMedia.Song,
    getSource: () => Promise<NoxNetwork.ParsedNoxMediaURL>,
  ) => {
    if (
      !playerSettingStore.getState().playerSetting.r128gain ||
      SkipR128Source.includes(song.source)
    ) {
      return;
    }
    if (!currentAudioInst) return;
    currentAudioInst.volume = 1;
    setTimeout(async () => {
      // HACK: delay r128gain's fetch so it doesnt block playback!
      currentAudioInst.volume = await r128gain({ song, getSource });
    }, 500);
  };

  const musicSrcParser = async (v: NoxMedia.Song) => {
    try {
      const resolvedUrl = await fetchPlayUrlPromise({ song: v });
      if (resolvedUrl.url === DEFAULT_NULL_URL) {
        throw new Error('resolve failed');
      }
      parseR128Gain(v, async () => resolvedUrl);
      return resolvedUrl.url;
    } catch (e) {
      console.error(`[resolveURL] failed to resolve ${v.bvid}: ${e}`);
      setTimeout(() => currentAudioInst?.playNext?.(), 1000);
      return 'FAILED_TO_RESOLVE';
    }
  };

  interface UpdateCurrentAudioListProps {
    songs: NoxMedia.Song[];
    immediatePlay?: boolean;
    replaceList?: boolean;
    newAudioListPlayIndex?: number;
  }
  const updateCurrentAudioList = ({
    songs,
    immediatePlay = false,
    replaceList = false,
    newAudioListPlayIndex = 0,
  }: UpdateCurrentAudioListProps) => {
    // console.log("updateCurrentAudioList", params)
    let newAudioLists = [];
    if (immediatePlay) {
      // Click and play
      newAudioLists = [...songs, ...playingList];
    } else if (replaceList) {
      // OnPlayList handle
      newAudioLists = [...songs];
    } else {
      // AddToList handle
      newAudioLists = [...playingList, ...songs];
    }
    const newParam = {
      ...params,
      quietUpdate: !immediatePlay,
      clearPriorAudioLists: immediatePlay || replaceList,
      audioLists: newAudioLists,
      newAudioListPlayIndex,
    };
    // console.log(newParam)
    setplayingList(newAudioLists);
    setparams(newParam);
  };

  const onPlayOneFromFav = (
    song: NoxMedia.Song,
    favList: NoxMedia.Playlist,
  ) => {
    const existingIndex = playingList.findIndex((s) => s.id === song.id);
    if (
      playingList.length === favList.songList.length &&
      existingIndex !== -1
    ) {
      currentAudioInst?.playByIndex?.(existingIndex);
      return;
    }
    setCurrentPlayingList(favList);
    const parsedSongList = parseSongList(
      favList,
      playerSetting.loadPlaylistAsArtist,
    );
    updateCurrentAudioList({
      songs: parsedSongList,
      replaceList: true,
      newAudioListPlayIndex: parsedSongList.findIndex((s) => s.id === song.id),
    });
  };

  const onPlayAllFromFav = (favList: NoxMedia.Playlist) => {
    console.debug('current PlayMode is', params.playMode);
    const parsedSongList = parseSongList(
      favList,
      playerSetting.loadPlaylistAsArtist,
    );
    updateCurrentAudioList({
      songs: parsedSongList,
      immediatePlay: false,
      replaceList: true,
      newAudioListPlayIndex:
        params.playMode === 'shufflePlay'
          ? Math.floor(Math.random() * parsedSongList.length) >> 0
          : 0,
    });
  };

  const onPlayModeChange = (playMode: string) => {
    // console.log('play mode change:', playMode)
    setPlayerSettings({ playMode });
    params.playMode = playMode;
    setparams(params);
  };

  const onAudioVolumeChange = (currentVolume: number) => {
    // console.log('audio volume change', currentVolume)
    setPlayerSettings({ defaultVolume: Math.sqrt(currentVolume) });
  };

  const onAudioListsChange = (
    _currentPlayId: string,
    audioLists: NoxMedia.Song[],
  ) => setplayingList(audioLists);
  // console.log('audioListChange:', audioLists)

  const onAudioProgress = (audioInfo: any) => {
    saveLastPlayDuration(audioInfo.currentTime);
    // HACK
    if (showLyric) {
      setCurrentProgress(audioInfo.currentTime);
    }
    return;
    // this is updated every 0.1sec or so. disabling this seems to make playing >3000 songs list
    // a tinny bit faster; the other slowing part is audioTimeUpdate's setState in JKmusicplayer.
    // its probably because with a huge songlist, updating musicplayer state recreatign it somehow and its very slow
    // to recreate objects with that huge songlist. it might need to be restructured to have player send next music signal
    // to controller (player.js here) so it doesnt have to save that list anymore.
    if (showLyric) setCurrentAudio(audioInfo);
  };

  const customDownloader = (downloadInfo: { src: string }) => {
    fetch(downloadInfo.src)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href; // a.mp3
        link.download = `${currentAudioInst?.title}.mp3`;
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => console.error(err));
  };
  const onCoverClick = () => setShowLyric(!showLyric);

  const processExtendsContent = (extendsContent: any) =>
    setparams({ ...params, extendsContent });

  const sendBiliHeartbeat = async (song: NoxMedia.Song, debug = false) => {
    clearInterval(biliHeartbeat.current);
    if (playerSetting.sendBiliHeartbeat) return;
    initBiliHeartbeat({ bvid: song.bvid, cid: song.id });
    if (debug) checkBiliVideoPlayed(song.bvid);
  };

  const onAudioPlay = (audioInfo: NoxMedia.Song) => {
    processExtendsContent(renderExtendsContent(audioInfo));
    setCurrentAudio(audioInfo);
    setCurrentPlayingId(audioInfo.id);
    sendBiliHeartbeat(audioInfo);
  };

  const onAudioError = (
    errMsg: string,
    _currentPlayId: string,
    _audioLists: NoxMedia.Song[],
    audioInfo: NoxMedia.Song,
  ) => {
    // HACK: does this get called?
    console.error('audio error', errMsg, audioInfo);
    setTimeout(() => {
      // console.debug('retrying...');
      currentAudioInst?.playByIndex?.(1);
    }, 3000);
  };

  const initPlayer = async (
    songList: NoxMedia.Song[],
    options: NoxPlayer.Option,
  ) => {
    const previousPlayingSongIndex = Math.max(
      0,
      songList.findIndex((s) => s.id === currentPlayingId),
    );
    const song = songList[previousPlayingSongIndex];
    if (song !== undefined) {
      options.extendsContent = renderExtendsContent(song);
    }
    const newParams = {
      ...options,
      extendsContent: song && renderExtendsContent(song),
      ...playerSetting,
      audioLists: songList,
      defaultPlayIndex: previousPlayingSongIndex,
    };
    setparams(newParams);
    setplayingList(songList);
  };

  const handleSearch = (list: NoxMedia.Playlist) => {
    setSearchList(list);
    setSelectedList(list);
  };
  const loadToSearchListAndPlay = (songList: NoxMedia.Song[]) => {
    const loadedList = { ...searchList, songList };
    handleSearch(loadedList);
    onPlayAllFromFav(loadedList);
  };

  return {
    params,
    currentAudio,
    currentAudioInst,
    showLyric,
    setShowLyric,
    playerSetting,
    setPlayerSettings,

    onPlayOneFromFav,
    onPlayAllFromFav,
    onPlayModeChange,
    onAudioVolumeChange,
    onAudioListsChange,
    onAudioProgress,
    setCurrentAudioInst,
    customDownloader,
    onCoverClick,
    musicSrcParser,
    onAudioPlay,
    onAudioError,
    initPlayer,
    loadToSearchListAndPlay,
  };
};
