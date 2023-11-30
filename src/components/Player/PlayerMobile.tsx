import React, { useEffect, useState } from 'react';
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../../css/react-jinke-player.css';
import Box from '@mui/material/Box';

import usePlayer from '@hooks/usePlayer';
import FavList from '../FavList/FavListMobile';
import LyricOverlay from '../lyric/LyricOverlay';
import Options from './Enum';

const options = { ...Options, bannerBg: '' };

interface Props {
  songList: NoxMedia.Song[];
  id?: string;
}
export default function PlayerMobile({ songList, id = 'noxmobile' }: Props) {
  // FavList Dialog
  const [showFavList, setShowFavList] = useState(false);
  const [audioListsPanelState, setAudioListsPanelState] = useState(false);

  const {
    params,
    currentAudio,
    showLyric,
    setShowLyric,
    playerSetting,

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
  } = usePlayer({ isMobile: true });

  const onPlayOneFromFav2 = (
    song: NoxMedia.Song,
    favList: NoxMedia.Playlist,
  ) => {
    onPlayOneFromFav(song, favList);
    setShowFavList((favState) => !favState);
  };

  useEffect(() => {
    if (!currentAudio?.name) return;
    document.title = currentAudio?.name;
  }, [currentAudio?.name]);

  // Initialization effect
  useEffect(() => {
    initPlayer(songList, options);
  }, []);

  // handles swipe action: call playlist when swiping left
  // the reason why we dont use react-swipe is because
  // react-jinke-music-player-main is a 0x0 object.
  // wrapping a use-swipe div around it doesnt trigger anything,
  // but use onTouch listeners does (?)

  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0]?.clientX || 0);
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEnd(e.targetTouches[0]?.clientX || 0);
  }

  function handleTouchEnd() {
    if (!touchEnd || audioListsPanelState) {
      return;
    }
    if (touchStart - touchEnd > 50) {
      // do your stuff here for left swipe
      setShowFavList((favState) => !favState);
      setTouchEnd(0);
      setTouchStart(0);
    }
  }

  return (
    <React.Fragment>
      {params && (
        <FavList
          onPlayOneFromFav={onPlayOneFromFav2}
          onPlayAllFromFav={onPlayAllFromFav}
          showFavList={showFavList}
          currentAudioID={currentAudio?.id || -1}
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
            getAudioInstance={setCurrentAudioInst}
            onAudioPlay={onAudioPlay}
            onCoverClick={onCoverClick}
            onAudioListsChange={onAudioListsChange}
            onAudioListsPanelChange={setAudioListsPanelState}
            hideCover={playerSetting?.hideCoverInMobile}
            musicSrcParser={musicSrcParser}
          />
        </Box>
      )}
    </React.Fragment>
  );
}
