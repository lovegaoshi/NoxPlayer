import React, { useEffect, useState } from 'react';
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../css/react-jinke-player.css';
import Box from '@mui/material/Box';

import { useNoxSetting } from '@APM/stores/useApp';
import FavList from './FavListMobile';
import LyricOverlay from './lyric/LyricOverlay';
import { skins } from '../styles/skin';
import versionUpdate from '../utils/versionupdater/versionupdater';
import { fetchPlayUrlPromise } from '@APM/utils/mediafetch/resolveURL';
import usePlayer from '../hooks/usePlayer';

// Initial Player options
const options = {
  mode: 'full',
  showThemeSwitch: false,
  showLyric: false,
  toggleMode: false,
  locale: 'zh_CN',
  autoPlayInitLoadPlayList: true,
  autoPlay: false,
  defaultPlayIndex: 0,
  isInitRemember: true,
  bannerBg: '',
  themeOverwrite: skins().reactJKPlayerTheme,
};

export default function PlayerMobile({ songList, id = 'noxmobile' }) {
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const setCurrentPlayingId = useNoxSetting(
    (state) => state.setCurrentPlayingId,
  );
  const currentPlayingId = useNoxSetting((state) => state.currentPlayingId);
  // FavList Dialog
  const [showFavList, setShowFavList] = useState(false);
  const [audioListsPanelState, setAudioListsPanelState] = useState(false);

  const {
    params,
    setparams,
    setplayingList,
    currentAudio,
    setCurrentAudio,
    currentAudioInst,
    showLyric,
    setShowLyric,
    playerSettings,

    onPlayOneFromFav,
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
    musicSrcParser,
  } = usePlayer({ isMobile: true });

  const onPlayOneFromFav2 = (songs, favList) => {
    onPlayOneFromFav(songs, favList);
    setShowFavList((favState) => !favState);
  };

  useEffect(() => {
    if (!currentAudio.name) {
      return;
    }
    document.title = currentAudio.name;
  }, [currentAudio.name]);

  const onAudioPlay = (audioInfo) => {
    processExtendsContent(renderExtendsContent(audioInfo));
    setCurrentAudio(audioInfo);
    setCurrentPlayingId(audioInfo.id);
    sendBiliHeartbeat(audioInfo);
  };

  const onAudioError = (errMsg, currentPlayId, audioLists, audioInfo) => {
    console.error('audio error', errMsg, currentPlayId, audioLists, audioInfo);
    setTimeout(() => {
      console.debug('retrying...');
      currentAudioInst.playByIndex(1, true);
    }, '1000');
  };

  // Initialization effect
  useEffect(() => {
    if (!songList || songList[0] === undefined) {
      return;
    }
    async function initPlayer() {
      await versionUpdate();
      const previousPlayingSongIndex = Math.max(
        0,
        songList.findIndex((s) => s.id === currentPlayingId),
      );
      options.extendsContent = renderExtendsContent(
        songList[previousPlayingSongIndex],
      );
      const params2 = {
        ...options,
        ...playerSetting,
        audioLists: songList,
        defaultPlayIndex: previousPlayingSongIndex,
      };
      setparams(params2);
      setplayingList(songList);
    }
    initPlayer();
  }, []);

  // handles swipe action: call playlist when swiping left
  // the reason why we dont use react-swipe is because
  // react-jinke-music-player-main is a 0x0 object.
  // wrapping a use-swipe div around it doesnt trigger anything,
  // but use onTouch listeners does (?)

  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  function handleTouchStart(e) {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e) {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (!touchEnd || audioListsPanelState) {
      return;
    }
    if (touchStart - touchEnd > 50) {
      // do your stuff here for left swipe
      setShowFavList((favState) => !favState);
      setTouchEnd(null);
      setTouchStart(null);
    }
  }

  return (
    <React.Fragment id={id}>
      {params && (
        <FavList
          currentAudioList={params.audioLists}
          onSongIndexChange={playByIndex}
          onPlayOneFromFav={onPlayOneFromFav2}
          onPlayAllFromFav={onPlayAllFromFav}
          onAddFavToList={onAddFavToList}
          showFavList={showFavList}
          currentAudioID={currentAudio ? currentAudio.id : -1}
        />
      )}
      {currentAudio && (
        <LyricOverlay
          showLyric={showLyric}
          currentTime={currentAudio.currentTime}
          audioName={currentAudio.name}
          audioId={currentAudio.id}
          audioCover={currentAudio.cover}
          isMobile
          artist={currentAudio.singerId}
          closeLyric={() => setShowLyric(false)}
        />
      )}
      {params && (
        <Box // Bottom Grid -- Footer
          display='flex'
          flex='1'
          justifyContent='space-around'
          style={{ maxHeight: '0%', height: '0px' }} // Relative height against the Player
          sx={{ gridArea: 'footer' }}
          onTouchStart={(touchStartEvent) => handleTouchStart(touchStartEvent)}
          onTouchMove={(touchMoveEvent) => handleTouchMove(touchMoveEvent)}
          onTouchEnd={() => handleTouchEnd()}
        >
          <ReactJkMusicPlayer
            {...params}
            showMediaSession
            onAudioVolumeChange={onAudioVolumeChange}
            onPlayModeChange={onPlayModeChange}
            onAudioError={onAudioError}
            customDownloader={customDownloader}
            onAudioProgress={onAudioProgress}
            getAudioInstance={getAudioInstance}
            onAudioPlay={onAudioPlay}
            onCoverClick={onCoverClick}
            onAudioListsChange={onAudioListsChange}
            onAudioListsPanelChange={setAudioListsPanelState}
            hideCover={playerSettings?.hideCoverInMobile}
            musicSrcParser={musicSrcParser}
          />
        </Box>
      )}
    </React.Fragment>
  );
}
