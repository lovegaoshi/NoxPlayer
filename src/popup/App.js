import React, { useEffect, useState } from 'react';
import PageLayout from './Layout';
import { initSongList } from '../background/DataProcess';
import { skins } from '../styles/skin';
import PlayerContextsProvider from '../contexts/PlayerContextWrapper';

export default function App () {
  // The current playing list
  const [currentSongList, setCurrentSongList] = useState(null);

  useEffect(() => {
    initSongList(setCurrentSongList);
  }, []);

  useEffect(() => {
    document.title = skins().appTitle;
  }, []);

  // console.log(currentSongList)
  return (
    <PlayerContextsProvider>
      <PageLayout
        songList={currentSongList}
      />
    </PlayerContextsProvider>
  );
}
