import React, { useEffect, useState } from 'react';
import isMobile from 'is-mobile';
import PageLayout from './Layout';
import initSongList from '../background/DataProcess';
import { skins } from '../styles/skin';
import PlayerContextsProvider from '../contexts/PlayerContextWrapper';
import { initialize } from '../stores/appStore';

export default function App() {
  // The current playing list
  const [currentSongList, setCurrentSongList] = useState(null);
  const [backgroundSrc, setBackgroundSrc] = useState(null);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    initSongList(setCurrentSongList);
    async function resolveBackgroundSrc() {
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
    resolveBackgroundSrc();
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
