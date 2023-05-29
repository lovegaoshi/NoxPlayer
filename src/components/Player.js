import React, { useEffect, useCallback, useContext } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../css/react-jinke-player.css';
import { useHotkeys } from 'react-hotkeys-hook';
import { FavList } from './FavList';
import LyricOverlay from './LyricOverlay';
import { StorageManagerCtx } from '../contexts/StorageManagerContext';
import { skins, skinPreset } from '../styles/skin';
import { getName } from '../utils/re';
import versionUpdate from '../utils/versionupdater/versionupdater';
import { fetchPlayUrlPromise } from '../utils/Data';
import usePlayer from '../hooks/usePlayer';
import { setLocalStorage, CURRENT_PLAYING } from '../utils/ChromeStorage';

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
  // Sync data to chromeDB
  const StorageManager = useContext(StorageManagerCtx);

  const [
    params,
    setparams,
    setplayingList,
    currentAudio,
    setcurrentAudio,
    currentAudioInst,
    showLyric,
    setShowLyric,
    playerSettings,
    setPlayerSettings,

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
  ] = usePlayer({});

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
    StorageManager.setPlayerSettingInst = setPlayerSettings;
  }, []);

  useEffect(() => {
    if (!currentAudio?.name) return;
    document.title = `${currentAudio.name} - ${skins().appTitle}`;
  }, [currentAudio.name]);

  const onAudioPlay = useCallback(
    async (audioInfo) => {
      processExtendsContent(renderExtendsContent({ song: audioInfo }));
      setcurrentAudio(audioInfo);
      setLocalStorage(CURRENT_PLAYING, {
        cid: audioInfo.id,
        playUrl: audioInfo.musicSrc,
      });
      sendBiliHeartbeat(audioInfo);
    },
    [params],
  );

  const onAudioError = (errMsg, currentPlayId, audioLists, audioInfo) => {
    console.error('audio error', errMsg, audioInfo);
  };

  // Initialization effect
  useEffect(() => {
    if (!songList || songList[0] === undefined) {
      return;
    }
    async function initPlayer() {
      await versionUpdate();
      const setting = await StorageManager.getPlayerSetting();
      let previousPlaying = await StorageManager.readLocalStorage(
        'CurrentPlaying',
      );
      if (previousPlaying === undefined) previousPlaying = {};
      const previousPlayingSongIndex = Math.max(
        0,
        songList.findIndex((s) => s.id === previousPlaying.cid),
      );
      options.extendsContent = renderExtendsContent({
        song: songList[previousPlayingSongIndex],
      });
      const params2 = {
        ...options,
        ...setting,
        audioLists: songList,
        defaultPlayIndex: previousPlayingSongIndex,
      };
      setparams(params2);
      setplayingList(songList);
      setPlayerSettings(setting);
    }
    initPlayer();
  }, [songList]);

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
          musicSrcParser={(v) => fetchPlayUrlPromise(v)}
          ref={(element) => {
            window.musicplayer = element;
          }}
        />
      )}
    </React.Fragment>
  );
}
