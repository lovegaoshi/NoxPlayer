import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../css/react-jinke-player.css';
import { useHotkeys } from 'react-hotkeys-hook';

import { getName } from '@APM/utils/re';
import { useNoxSetting } from '@APM/stores/useApp';
import { FavList } from './FavList/FavList';
import LyricOverlay from './lyric/LyricOverlay';
import { skins, skinPreset } from '../styles/skin';
import versionUpdate from '../utils/versionupdater/versionupdater';
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
  bannerBg: skins().playerBanner,
  themeOverwrite: skins().reactJKPlayerTheme,
};

export default function Player({ songList }) {
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const setCurrentPlayingId = useNoxSetting(
    (state) => state.setCurrentPlayingId,
  );
  const currentPlayingId = useNoxSetting((state) => state.currentPlayingId);
  // Sync data to chromeDB

  const {
    params,
    setparams,
    setplayingList,
    currentAudio,
    setcurrentAudio,
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
  } = usePlayer({});

  useHotkeys('space', () => {
    if (currentAudioInst === null) return;
    // i have no idea why currentAudioInst doesnt have play(), but this works
    // reactJKPlayer's spaceBar prop only listens when it has focus; this allows spacebar
    // listening to pause/play audio at a global level.
    if (currentAudioInst.paused)
      document.getElementsByClassName('music-player-audio')[0].play();
    else document.getElementsByClassName('music-player-audio')[0].pause();
  });

  useHotkeys('pagedown', () => window.musicplayer.onPlayNextAudio());
  useHotkeys('pageup', () => window.musicplayer.onPlayPrevAudio());

  useEffect(() => {
    if (!currentAudio?.name) return;
    document.title = `${currentAudio.name} - ${skins().appTitle}`;
  }, [currentAudio.name]);

  const onAudioPlay = async (audioInfo) => {
    processExtendsContent(renderExtendsContent({ song: audioInfo }));
    setcurrentAudio(audioInfo);
    setCurrentPlayingId(audioInfo.id);
    sendBiliHeartbeat(audioInfo);
  };

  const onAudioError = (errMsg, currentPlayId, audioLists, audioInfo) => {
    console.error('audio error', errMsg, audioInfo);
  };

  // Initialization effect
  useEffect(() => {
    async function initPlayer() {
      await versionUpdate();
      const previousPlayingSongIndex = Math.max(
        0,
        songList.findIndex((s) => s.id === currentPlayingId),
      );
      options.extendsContent = renderExtendsContent({
        song: songList[previousPlayingSongIndex],
      });
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

  return (
    <React.Fragment>
      {params && (
        <FavList
          currentAudioList={params.audioLists}
          onSongIndexChange={playByIndex}
          onPlayOneFromFav={onPlayOneFromFav}
          onPlayAllFromFav={onPlayAllFromFav}
          onAddFavToList={onAddFavToList}
          playerSettings={playerSettings}
        />
      )}
      {currentAudio.id && (
        <LyricOverlay
          showLyric={showLyric}
          currentTime={currentAudio.currentTime}
          audioName={getName(currentAudio)}
          audioId={currentAudio.id}
          audioCover={currentAudio.cover}
          closeLyric={() => setShowLyric(false)}
        />
      )}

      {params && (
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
          theme={skinPreset.desktopTheme}
          musicSrcParser={musicSrcParser}
          ref={(element) => {
            window.musicplayer = element;
          }}
        />
      )}
    </React.Fragment>
  );
}
