import React, { forwardRef, useState, useEffect, memo } from "react";
import { Lyric } from './Lyric';
import { LyricMobile } from './LyricMobile';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Slide from '@mui/material/Slide';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const theme = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  };

export const LyricOverlay = memo(function ({ showLyric, currentTime, audioName, audioId, audioCover, isMobile = false, closeLyric = () => {} }) {

    return (
        <div >
            <Dialog
                fullScreen
                open={showLyric}
                onClose={closeLyric}
                hideBackdrop
                TransitionComponent={Transition}
                PaperProps={{
                    style: {
                        backgroundImage: 'url(' + audioCover + ')',
                        backgroundSize: 'cover',
                        boxShadow: 'none',
                    },
                }}
            >
                <div id="blur-glass" style={{display:'flex',flexDirection: 'column',overflow: 'hidden'}}>
                    <IconButton
                        color="inherit"
                        onClick={closeLyric}
                        aria-label="close"
                        style={{borderRadius:'0'}}
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    { isMobile? 
                        <LyricMobile 
                            currentTime={currentTime} 
                            audioName={audioName} 
                            audioId={audioId} 
                            audioCover={audioCover}
                        /> 
                        : <Lyric currentTime={currentTime} audioName={audioName} audioId={audioId} audioCover={audioCover}/>
                    }
                    
                </div>
            </Dialog>
        </div>
    );
})