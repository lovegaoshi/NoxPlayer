import * as React from 'react';
import Box from '@mui/material/Box';
import isMobile from 'is-mobile';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider } from 'notistack';
import { skinPreset } from '../styles/skin';
// import PlayerMobile from '../components/PlayerMobile';
// import Player from '../components/Player';

const PlayerMobile = React.lazy(() => import('../components/PlayerMobile'));
const Player = React.lazy(() => import('../components/Player'));

const { colorTheme } = skinPreset;

const theme = createTheme(colorTheme.palette);

const OutmostBox = {
  width: '100vw',
  height: '95vh',
  color: '#1234',
  '& > .MuiBox-root > .MuiBox-root': {
    p: 1,
  },
};
const PlayerBox = {
  height: '100vh',
  maxHeight: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 0,
  gridTemplateRows: '72px 1fr',
  gridTemplateAreas: `"Lrc         Lrc      Lrc      search"
                        "Lrc         Lrc      Lrc      sidebar"
                        "footer      footer   footer   footer"`,
};

const PlayerBoxMobile = {
  height: '0px',
  maxHeight: '0%',
};

export default function PageLayout({ songList, backgroundSrc }) {
  if (!songList || !backgroundSrc) { return <h1>Loading...</h1>; }

  if (isMobile()) {
    return (
    // Outmost layer of the page
    <React.Suspense fallback = {<h1>Loading...</h1>}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <ConfirmProvider>
            <Box sx={OutmostBox} id="master-box" style={{ backgroundColor: colorTheme.MobileBackgroundColor }}>
              <div className="container-fluid homepage-bgimage-mobile">
                {skinPreset.playerBackgroundMobileVideo
                  ? <video id="player-bkgrd-mobile" autoPlay loop muted className="homepage-bgimage-mobile" src={backgroundSrc} height={window.innerHeight} width={window.innerWidth} />
                  : <img id="player-bkgrd-mobile" alt="" className="homepage-bgimage-mobile" src={backgroundSrc} height={window.innerHeight} width={window.innerWidth} />}
              </div>
              <Box sx={PlayerBoxMobile} id="player-box">
                <PlayerMobile songList={songList} id="player-instance" />
              </Box>
            </Box>
          </ConfirmProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Suspense>
    );
  }
  return (
    // Outmost layer of the page
    <React.Suspense fallback = {<h1>Loading...</h1>}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <ConfirmProvider>
            <div className="container-fluid homepage-bgimage">
              {skinPreset.playerBackgroundVideo
                ? <video id="player-bkgrd" autoPlay loop muted className="homepage-bgimage" src={backgroundSrc} height={window.innerHeight} width={window.innerWidth} />
                : <img id="player-bkgrd" alt="" className="homepage-bgimage" src={backgroundSrc} height={window.innerHeight} width={window.innerWidth} />}
            </div>
            <Box
              sx={OutmostBox}
              id="master-box"
              style={{
                backgroundColor: colorTheme.PCBackgroundColor,
                backgroundBlendMode: 'overlay',
              }}
            >
              <Box sx={PlayerBox}>
                <Player songList={songList} />
              </Box>
            </Box>
          </ConfirmProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Suspense>
  );
}
