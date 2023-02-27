import * as React from "react";
import Box from "@mui/material/Box";
import { Player } from '../components/Player';
import { PlayerMobile } from '../components/PlayerMobile';
import isMobile from 'is-mobile';
import { skinPreset } from '../styles/skin';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider } from 'notistack';

let colorTheme = skinPreset.colorTheme;

const theme = createTheme(colorTheme.palette);

const OutmostBox = {
    width: "100vw",
    height: "95vh",
    color: "#1234",
    "& > .MuiBox-root > .MuiBox-root": {
        p: 1
    }
}
const PlayerBox = {
    height: "100vh",
    maxHeight: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 0,
    gridTemplateRows: "72px 1fr",
    gridTemplateAreas: `"Lrc         Lrc      Lrc      search"
                        "Lrc         Lrc      Lrc      sidebar"
                        "footer      footer   footer   footer"`
}

const PlayerBoxMobile = {
    height: "0px",
    maxHeight: "0%",
}

export default function PageLayout({ songList }) {

    if (!songList)
        return <h1>Loading...</h1>

    if (isMobile()) {
        
    return (
        // Outmost layer of the page
        
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={1}>
                <ConfirmProvider>
                    <Box sx={OutmostBox} id='master-box' style={{ backgroundColor: colorTheme.MobileBackgroundColor }}>
                        <div className="container-fluid homepage-bgimage" align="center">
                            {skinPreset.playerBackgroundVideo
                            ? <video id="player-bkgrd" autoPlay loop muted className="homepage-bgimage" src={skinPreset.playerBannerMobile} height={window.innerHeight} width={window.innerWidth}></video>
                            : <img id="player-bkgrd" className="homepage-bgimage" src={skinPreset.playerBannerMobile} height={window.innerHeight} width={window.innerWidth}></img>
                            }
                        </div> 
                        <Box sx={PlayerBoxMobile} id='player-box'> 
                            <PlayerMobile songList={songList} id='player-instance'/>
                        </Box>
                    </Box>
                </ConfirmProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
    }
    return (
        // Outmost layer of the page
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={1}>
                <ConfirmProvider>
                    <div className="container-fluid homepage-bgimage" align="center">
                        {skinPreset.playerBackgroundVideo
                        ? <video id="player-bkgrd" autoPlay loop muted className="homepage-bgimage" src={skinPreset.playerBackground} height={window.innerHeight} width={window.innerWidth}></video>
                        : <img id="player-bkgrd" className="homepage-bgimage" src={skinPreset.playerBackground} height={window.innerHeight} width={window.innerWidth}></img>
                        }
                    </div> 
                    <Box sx={OutmostBox} id='master-box' style={{ 
                        backgroundColor: colorTheme.PCBackgroundColor, 
                        backgroundBlendMode: 'overlay' 
                        }}>
                        <Box sx={PlayerBox}> 
                            <Player songList={songList} />
                        </Box>
                    </Box>
                </ConfirmProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}
