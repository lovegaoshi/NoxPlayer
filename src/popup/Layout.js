import * as React from "react";
import Box from "@mui/material/Box";
import { Player } from '../components/Player'
import { PlayerMobile } from '../components/PlayerMobile'
import isMobile from 'is-mobile';

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
        <Box sx={OutmostBox} id='master-box'>
            <div className="container-fluid homepage-bgimage" align="center" height="100vh" width="100vw">
                <img id="player-bkgrd" src="https://github.com/lovegaoshi/azusa-player/blob/nox-player/public/img/nox/noxbgm.png?raw=true"></img>
            </div>
            <Box sx={PlayerBoxMobile} id='player-box'> 
                <PlayerMobile songList={songList} id='player-instance'/>
            </Box>
        </Box>
    );
    }
    return (
        // Outmost layer of the page
        <Box sx={OutmostBox}>
            <Box sx={PlayerBox}> 
                <Player songList={songList} />
            </Box>
        </Box>
    );
}
