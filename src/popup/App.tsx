import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider } from 'notistack';

import useTimer from '@hooks/useTimer';
import useApp from '@stores/useApp';
import { RESOLVE_TYPE } from '@APM/utils/mediafetch/mainbackgroundfetch';
import useInitializeStore from '../stores/useInitializeStore';
import '../utils/i18n';

const Player = React.lazy(() => import('../components/App/App'));

export default function App() {
  // The current playing list
  const [currentSongList, setCurrentSongList] = useState<NoxMedia.Song[]>();
  const [lastPlayDuration, setLastPlayDuration] = useState(0);
  const { initializeStores } = useInitializeStore();
  const playerStyle = useApp((state) => state.playerStyle);
  const theme = createTheme(playerStyle.colorTheme.palette);
  const [backgroundSrc, setBackgroundSrc] =
    React.useState<NoxTheme.backgroundImage>();
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const timer = useTimer();

  useEffect(() => {
    async function init() {
      const result = await initializeStores();
      setCurrentSongList(result.currentPlayingList.songList);
      setLastPlayDuration(result.lastPlayDuration);
    }
    init();
    document.title = playerStyle.appTitle;
  }, []);

  useEffect(() => {
    playerStyle.playerBackground().then(setBackgroundSrc);
  }, [playerStyle.playerBackground]);

  if (!currentSongList) return <h1>Loading...</h1>;
  return (
    // Outmost layer of the page
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <ConfirmProvider useLegacyReturn>
            <div className='container-fluid homepage-bgimage'>
              {backgroundSrc?.type === RESOLVE_TYPE.video ? (
                <video
                  id='player-bkgrd'
                  autoPlay
                  loop
                  muted
                  className='homepage-bgimage'
                  src={backgroundSrc?.identifier}
                  height={window.innerHeight}
                  width={window.innerWidth}
                />
              ) : (
                <img
                  id='player-bkgrd'
                  alt=''
                  className='homepage-bgimage'
                  src={backgroundSrc?.identifier}
                  height={window.innerHeight}
                  width={window.innerWidth}
                />
              )}
            </div>
            <Box
              sx={style.OutmostBox}
              id='master-box'
              style={{
                backgroundColor: playerStyle.colorTheme.PCBackgroundColor,
                backgroundBlendMode: 'overlay',
              }}
            >
              <Box sx={style.PlayerBox}>
                <Player
                  songList={currentSongList}
                  lastPlayDuration={lastPlayDuration}
                />
              </Box>
            </Box>
          </ConfirmProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Suspense>
  );
}

const style = {
  OutmostBox: {
    width: '100vw',
    height: '95vh',
    color: '#1234',
    '& > .MuiBox-root > .MuiBox-root': {
      p: 1,
    },
  },
  PlayerBox: {
    height: '100vh',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 0,
    gridTemplateRows: '72px 1fr',
    gridTemplateAreas: `"Lrc         Lrc      Lrc      search"
                        "Lrc         Lrc      Lrc      sidebar"
                        "footer      footer   footer   footer"`,
  },
};
