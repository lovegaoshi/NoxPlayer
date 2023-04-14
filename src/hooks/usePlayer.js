import React, {
  useEffect, useState, useContext, useCallback, useRef,
} from 'react';
import { CurrentAudioContext } from '../contexts/CurrentAudioContext';
import StorageManagerCtx from '../popup/App';
import { getPlayerSettingKey } from '../objects/Storage';
import FavoriteButton from '../components/buttons/FavoriteSongButton';
import ThumbsUpButton from '../components/buttons/ThumbsUpButton';
import MobileMoreButton from '../components/buttons/MobileMoreButton';
import { checkBiliVideoPlayed, initBiliHeartbeat, sendBiliHeartbeat as POSTBiliHeartbeat } from '../utils/BiliOperate';

const usePlayer = ({ isMobile = false }) => {
  // Params to init music player
  const [params, setparams] = useState(null);
  // Playing List
  const [playingList, setplayingList] = useState(null);
  // Current Audio info
  const [currentAudio, setcurrentAudio] = useContext(CurrentAudioContext);
  // Current Audio Inst
  const [currentAudioInst, setcurrentAudioInst] = useState(null);
  // Lyric Dialog
  const [showLyric, setShowLyric] = useState(false);

  // Player Settings
  const [playerSettings, setPlayerSettings] = useState(null);
  // Sync data to chromeDB
  const StorageManager = useContext(StorageManagerCtx);

  const biliHeartbeat = useRef(null);

  const updateCurrentAudioList = useCallback(({
    songs,
    immediatePlay = false,
    replaceList = false,
    newAudioListPlayIndex = 0,
  }) => {
    // console.log("updateCurrentAudioList", params)
    let newAudioLists = [];
    if (immediatePlay) {
      // Click and play
      newAudioLists = [
        ...songs,
        ...playingList,
      ];
    } else if (replaceList) {
      // OnPlayList handle
      newAudioLists = [...songs];
    } else {
      // AddToList handle
      newAudioLists = [
        ...playingList,
        ...songs,
      ];
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
  }, [params, playingList]);

  const parseSongList = async (favList) => {
    if (favList.info && favList.info.title !== '搜索歌单' && await getPlayerSettingKey('loadPlaylistAsArtist')) {
      const val = new Array(favList.songList.length);
      for (let i = 0; i < favList.songList.length; i++) {
        val[i] = { ...favList.songList[i], singer: favList.info.title };
      }
      return val;
    }
    return favList.songList;
  };

  const onPlayOneFromFav = useCallback((songs, favList) => {
    const existingIndex = playingList.findIndex((s) => s.id === songs[0].id);
    if (playingList.length === favList.songList.length && existingIndex !== -1) {
      currentAudioInst.playByIndex(existingIndex);
      return;
    }
    parseSongList(favList).then((val) => {
      updateCurrentAudioList({
        songs: val,
        replaceList: true,
        newAudioListPlayIndex: val.findIndex((s) => s.id === songs[0].id),
      });
    });
  }, [params, playingList, currentAudioInst]);

  const onAddOneFromFav = useCallback((songs) => {
    const existingIndex = playingList.findIndex((s) => s.id === songs[0].id);
    // console.log(existingIndex)
    if (existingIndex !== -1) {
      return;
    }
    updateCurrentAudioList({ songs, immediatePlay: false });
  }, [params, playingList]);

  const onPlayAllFromFav = useCallback((favList) => {
    console.debug('current PlayMode is', params.playMode);
    parseSongList(favList).then((val) => {
      updateCurrentAudioList({
        songs: val,
        immediatePlay: false,
        replaceList: true,
        newAudioListPlayIndex: params.playMode === 'shufflePlay'
          ? Math.floor(Math.random() * val.length) >> 0
          : 0,
      });
    });
  }, [params]);

  const onAddFavToList = useCallback((songs) => {
    // If song exists in currentPlayList, remove it
    const newSongsInList = songs.filter((v) => playingList.find((s) => s.id === v.id) === undefined);

    updateCurrentAudioList({ songs: newSongsInList, immediatePlay: false, replaceList: false });
  }, [params, playingList]);

  const playByIndex = useCallback((index) => {
    currentAudioInst.playByIndex(index);
  }, [currentAudioInst]);

  const onPlayModeChange = (playMode) => {
    // console.log('play mode change:', playMode)
    playerSettings.playMode = playMode;
    params.playMode = playMode;
    StorageManager.setPlayerSetting(playerSettings);
    setparams(params);
  };

  const onAudioVolumeChange = (currentVolume) => {
    // console.log('audio volume change', currentVolume)
    playerSettings.defaultVolume = Math.sqrt(currentVolume);
    StorageManager.setPlayerSetting(playerSettings);
  };

  const onAudioListsChange = useCallback((currentPlayId, audioLists, audioInfo) => {
    // Sync latest-playinglist
    StorageManager.setLastPlayList(audioLists);
    setplayingList(audioLists);
    // console.log('audioListChange:', audioLists)
  }, [params, playingList]);

  const onAudioProgress = (audioInfo) => {
    // this is updated every 0.1sec or so. disabling this seems to make playing >3000 songs list
    // a tinny bit faster; the other slowing part is audioTimeUpdate's setState in JKmusicplayer.
    // its probably because with a huge songlist, updating musicplayer state recreatign it somehow and its very slow
    // to recreate objects with that huge songlist. it might need to be restructured to have player send next music signal
    // to controller (player.js here) so it doesnt have to save that list anymore.

    if (showLyric) setcurrentAudio(audioInfo);
  };

  const getAudioInstance = (audio) => setcurrentAudioInst(audio);

  const customDownloader = (downloadInfo) => {
    fetch(downloadInfo.src)
      .then((res) => {
        return res.blob();
      }).then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href; // a.mp3
        link.download = `${currentAudioInst.title}.mp3`;
        document.body.appendChild(link);
        link.click();
      }).catch((err) => console.error(err));
  };

  const onCoverClick = () => setShowLyric(!showLyric);

  const processExtendsContent = (extendsContent) => setparams({ ...params, extendsContent });

  const renderExtendsContent = ({ song }) => {
    return [
      (<ThumbsUpButton song={song} key="song-thumbup-btn" className="song-thumbup-btn" />),
      !isMobile ? (<FavoriteButton song={song} key="song-fav-btn" className="song-fav-btn" />) : undefined,
      isMobile ? (<MobileMoreButton song={song} key="song-more-btn" className="song-more-btn" />) : undefined,
    ].filter((val) => val !== undefined);
  };

  const sendBiliHeartbeat = async (song, debug = false) => {
    clearInterval(biliHeartbeat.current);
    if (await getPlayerSettingKey('sendBiliHeartbeat')) return;
    initBiliHeartbeat({ bvid: song.bvid, cid: song.id });
    if (debug) checkBiliVideoPlayed(song.bvid);
    return;
    // heartbeat every 15 seconds. turns out totally unnecessary.
    // eslint-disable-next-line no-unreachable
    let playtime = 0;
    biliHeartbeat.current = setInterval(() => {
      playtime += 15;
      console.log('sendBiliHeartbeat', song, playtime);
      POSTBiliHeartbeat({ bvid: song.bvid, cid: song.id, time: playtime });
      if (playtime > 60) {
        if (debug) checkBiliVideoPlayed(song.bvid);
        console.log('sendBiliHeartbeat stopped');
        clearInterval(biliHeartbeat.current);
      }
    }, 15000);
  };

  return [
    params, setparams,
    setplayingList,
    currentAudio, setcurrentAudio,
    currentAudioInst,
    showLyric, setShowLyric,
    playerSettings, setPlayerSettings,

    onPlayOneFromFav,
    onAddOneFromFav,
    onPlayAllFromFav,
    onAddFavToList,
    playByIndex,
    onPlayModeChange,
    onAudioVolumeChange,
    onAudioListsChange,
    onAudioProgress,
    getAudioInstance,
    customDownloader,
    onCoverClick,
    processExtendsContent,
    renderExtendsContent,
    sendBiliHeartbeat,
  ];
};

export default usePlayer;
