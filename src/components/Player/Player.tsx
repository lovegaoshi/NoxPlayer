import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../../css/react-jinke-player.css';
import { useHotkeys } from 'react-hotkeys-hook';

import { getName } from '@APM/utils/re';
import usePlayer from '@hooks/usePlayer';
import { FavList } from '../FavList/FavList';
import LyricOverlay from '../lyric/LyricOverlay';
import { skins, skinPreset } from '../../styles/skin';
import Options from './Enum';

const options = { ...Options };

interface Props {
  songList: NoxMedia.Song[];
}
export default function Player({ songList }: Props) {
  // Sync data to chromeDB

  const {
    params,
    currentAudio,
    currentAudioInst,
    showLyric,
    setShowLyric,
    playerSettings,

    onPlayOneFromFav,
    onPlayAllFromFav,
    onPlayModeChange,
    onAudioVolumeChange,
    onAudioListsChange,
    onAudioProgress,
    getAudioInstance,
    customDownloader,
    onCoverClick,
    musicSrcParser,
    onAudioPlay,
    onAudioError,
    initPlayer,
  } = usePlayer({});

  useHotkeys('space', () => {
    if (currentAudioInst === null) return;
    // i have no idea why currentAudioInst doesnt have play(), but this works
    // reactJKPlayer's spaceBar prop only listens when it has focus; this allows spacebar
    // listening to pause/play audio at a global level.
    if (currentAudioInst.paused)
      // @ts-expect-error
      document.getElementsByClassName('music-player-audio')[0].play();
    // @ts-expect-error
    else document.getElementsByClassName('music-player-audio')[0].pause();
  });

  // @ts-expect-error
  useHotkeys('pagedown', () => window.musicplayer.onPlayNextAudio());
  // @ts-expect-error
  useHotkeys('pageup', () => window.musicplayer.onPlayPrevAudio());

  useEffect(() => {
    if (!currentAudio?.name) return;
    document.title = `${currentAudio.name} - ${skins().appTitle}`;
  }, [currentAudio.name]);

  // Initialization effect
  useEffect(() => {
    initPlayer(songList, options);
  }, []);

  return (
    <React.Fragment>
      {params && (
        <FavList
          onPlayOneFromFav={onPlayOneFromFav}
          onPlayAllFromFav={onPlayAllFromFav}
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
            // @ts-expect-error
            window.musicplayer = element;
          }}
        />
      )}
    </React.Fragment>
  );
}
