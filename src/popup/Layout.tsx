import * as React from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider } from 'notistack';
import useApp from '@stores/useApp';

const Player = React.lazy(() => import('../components/App/App'));

interface Props {
  songList: NoxMedia.Song[];
  backgroundSrc: string;
  isMobile?: boolean;
}
export default function PageLayout({ songList, backgroundSrc }: Props) {
  const playerStyle = useApp((state) => state.playerStyle);
  const theme = createTheme(playerStyle.colorTheme.palette);
  if (!songList || !backgroundSrc) {
    return <h1>Loading...</h1>;
  }

  return (
    // Outmost layer of the page
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <ConfirmProvider>
            <div className='container-fluid homepage-bgimage'>
              {playerStyle.playerBackgroundVideo ? (
                <video
                  id='player-bkgrd'
                  autoPlay
                  loop
                  muted
                  className='homepage-bgimage'
                  src={backgroundSrc}
                  height={window.innerHeight}
                  width={window.innerWidth}
                />
              ) : (
                <img
                  id='player-bkgrd'
                  alt=''
                  className='homepage-bgimage'
                  src={backgroundSrc}
                  height={window.innerHeight}
                  width={window.innerWidth}
                />
              )}
            </div>
            <Box
              sx={OutmostBox}
              id='master-box'
              style={{
                backgroundColor: playerStyle.colorTheme.PCBackgroundColor,
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
