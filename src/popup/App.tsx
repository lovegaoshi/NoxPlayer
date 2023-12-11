import React, { useEffect, useState } from 'react';
import isMobile from 'is-mobile';

import useTimer from '@hooks/useTimer';
import useApp from '@stores/useApp';
import PageLayout from './Layout';
import useInitializeStore from '../stores/useInitializeStore';

export default function App() {
  // The current playing list
  const [currentSongList, setCurrentSongList] = useState<NoxMedia.Song[]>([]);
  const [backgroundSrc, setBackgroundSrc] = useState<string>('');
  const { initializeStores } = useInitializeStore();
  // eslint-disable-next-line no-unused-vars
  const timer = useTimer();
  const playerStyle = useApp((state) => state.playerStyle);

  useEffect(() => {
    async function init() {
      const result = await initializeStores();
      setCurrentSongList(result.currentPlayingList.songList);
      try {
        setBackgroundSrc(
          isMobile()
            ? await playerStyle.playerBannerMobile()
            : await playerStyle.playerBackground(),
        );
      } catch {
        setBackgroundSrc('');
      }
    }
    init();
  }, []);

  useEffect(() => {
    document.title = playerStyle.appTitle;
  }, []);

  // console.log(currentSongList)
  return (
    <PageLayout
      songList={currentSongList}
      backgroundSrc={backgroundSrc}
      // Mobile interface is assumed broken after refactoring and deprecaited
      // in favor of APM. use the better thing!
      isMobile={false}
    />
  );
}
