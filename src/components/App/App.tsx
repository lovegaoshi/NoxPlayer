import React, { useEffect } from 'react';
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../../css/react-jinke-player.css';
import { useHotkeys } from 'react-hotkeys-hook';

import usePlayback from '@hooks/usePlayback';
import useApp from '@stores/useApp';
import usePlaybackCount from '@hooks/usePlaybackCount';
import { FavList } from '../Playlists/Player';
import LyricOverlay from '../lyric/LyricOverlay';
import Options from './Enum';

const options = { ...Options };

interface Props {
  songList: NoxMedia.Song[];
  lastPlayDuration: number;
}
export default function Player({ songList, lastPlayDuration }: Props) {
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
  } = usePlayback();
  const { increasePlayback } = usePlaybackCount();
  const { appTitle, desktopTheme } = useApp((state) => state.playerStyle);
  const setRJKMref = useApp((state) => state.setRJKMref);
  const [initialized, setInitialized] = React.useState(false);

  useHotkeys('space', () => {
    if (!currentAudioInst) return;
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
    initPlayer(songList, options).then(() => setInitialized(true));
  }, []);

  useEffect(() => {
    if (initialized && currentAudioInst)
      currentAudioInst.currentTime = lastPlayDuration;
  }, [initialized]);

  return (
    <React.Fragment>
      <FavList />
      {currentAudio?.id && (
        <LyricOverlay
          showLyric={showLyric}
          currentAudio={currentAudio}
          closeLyric={() => setShowLyric(false)}
        />
      )}

      {params && (
        <ReactJkMusicPlayer
          {...params}
          onPlayNextAudio={increasePlayback}
          onPlayPrevAudio={increasePlayback}
          showMediaSession
          onAudioVolumeChange={onAudioVolumeChange}
          onPlayModeChange={onPlayModeChange}
          onAudioError={onAudioError}
          customDownloader={customDownloader}
          onAudioProgress={onAudioProgress}
          getAudioInstance={setCurrentAudioInst}
          onAudioPlayTrackChange={(_, __, song) => increasePlayback(song.id, 1)}
          onAudioPlay={onAudioPlay}
          onCoverClick={onCoverClick}
          onAudioListsChange={onAudioListsChange}
          theme={desktopTheme}
          musicSrcParser={musicSrcParser}
          ref={(element) => {
            // @ts-expect-error
            window.musicplayer = element;
            element && setRJKMref(element);
          }}
        />
      )}
    </React.Fragment>
  );
}
