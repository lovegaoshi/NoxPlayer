import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../../css/react-jinke-player.css';
import { useHotkeys } from 'react-hotkeys-hook';

import { getName } from '@APM/utils/re';
import usePlayback from '@hooks/usePlayback';
import useApp from '@stores/useApp';
import { FavList } from '../Playlists/Player';
import LyricOverlay from '../lyric/LyricOverlay';
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
  } = usePlayback({});
  const { appTitle, desktopTheme } = useApp((state) => state.playerStyle);

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
    document.title = `${currentAudio.name} - ${appTitle}`;
  }, [currentAudio?.name]);

  // Initialization effect
  useEffect(() => {
    initPlayer(songList, options);
  }, []);

  return (
    <React.Fragment>
      <FavList />
      {currentAudio?.id && (
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
          getAudioInstance={setCurrentAudioInst}
          onAudioPlay={onAudioPlay}
          onCoverClick={onCoverClick}
          onAudioListsChange={onAudioListsChange}
          theme={desktopTheme}
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
