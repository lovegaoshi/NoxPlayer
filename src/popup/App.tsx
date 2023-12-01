import React, { useEffect, useState } from 'react';
import isMobile from 'is-mobile';

import useTimer from '@hooks/useTimer';
import PageLayout from './Layout';
import { skins } from '../styles/skin';
import useInitializeStore from '../stores/useInitializeStore';

export default function App() {
  // The current playing list
  const [currentSongList, setCurrentSongList] = useState<NoxMedia.Song[]>([]);
  const [backgroundSrc, setBackgroundSrc] = useState<string>('');
  const { initializeStores } = useInitializeStore();
  // eslint-disable-next-line no-unused-vars
  const timer = useTimer();

  useEffect(() => {
    async function init() {
      const result = await initializeStores();
      setCurrentSongList(result.currentPlayingList.songList);
      try {
        setBackgroundSrc(
          isMobile()
            ? await skins().playerBannerMobile()
            : await skins().playerBackground(),
        );
      } catch {
        setBackgroundSrc('');
      }
    }
    init();
  }, []);

  useEffect(() => {
    document.title = skins().appTitle;
  }, []);

  // console.log(currentSongList)
  return (
    <PageLayout songList={currentSongList} backgroundSrc={backgroundSrc} />
  );
}
