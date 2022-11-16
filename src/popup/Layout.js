import * as React from "react";
import Box from "@mui/material/Box";
import { Player } from '../components/Player';
import { PlayerMobile } from '../components/PlayerMobile';
import isMobile from 'is-mobile';
import { skinPreset } from '../styles/skin';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
            <Box sx={OutmostBox} id='master-box' style={{ backgroundColor: colorTheme.PCBackgroundColor }}>
                <div className="container-fluid homepage-bgimage" align="center">
                    <img id="player-bkgrd" className="homepage-bgimage" src={skinPreset.playerBannerMobile} height={window.innerHeight} width={window.innerWidth}></img>
                </div>
                <Box sx={PlayerBoxMobile} id='player-box'> 
                    <PlayerMobile songList={songList} id='player-instance'/>
                </Box>
            </Box>
        </ThemeProvider>
    );
    }
    return (
        // Outmost layer of the page
        <ThemeProvider theme={theme}>
            <Box sx={OutmostBox} id='master-box' style={{ backgroundColor: colorTheme.PCBackgroundColor }}>
                <Box sx={PlayerBox}> 
                    <Player songList={songList} />
                </Box>
            </Box>
        </ThemeProvider>
    );
}
