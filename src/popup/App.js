import React, { useEffect, useState } from 'react';
import isMobile from 'is-mobile';

import PageLayout from './Layout';
import { skins } from '../styles/skin';
import PlayerContextsProvider from '../contexts/PlayerContextWrapper';
import useInitializeStore from '../stores/useInitializeStore';

export default function App() {
  // The current playing list
  const [currentSongList, setCurrentSongList] = useState([]);
  const [backgroundSrc, setBackgroundSrc] = useState(null);
  const { initializeStores } = useInitializeStore();

  useEffect(() => {
    async function init() {
      const result = await initializeStores();
      setCurrentSongList(result.currentPlayingList.songList);
      console.log('intiializing...', result);
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
    <PlayerContextsProvider>
      <PageLayout songList={currentSongList} backgroundSrc={backgroundSrc} />
    </PlayerContextsProvider>
  );
}
