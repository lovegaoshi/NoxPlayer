import React, { forwardRef, useState, useEffect, memo } from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Slide from '@mui/material/Slide';
import Lyric from './Lyric';

const Transition = forwardRef((props, ref) => {
  return <Slide direction='up' ref={ref} {...props} />;
});

const theme = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
};

export default function LyricOverlay({
  showLyric,
  currentTime,
  audioName,
  audioId,
  audioCover,
  isMobile = false,
  closeLyric = () => {},
}) {
  return (
    <div>
      <Dialog
        fullScreen
        open={showLyric}
        onClose={closeLyric}
        hideBackdrop
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            backgroundImage: `url(${audioCover})`,
            backgroundSize: 'cover',
            boxShadow: 'none',
          },
        }}
      >
        <div
          id='blur-glass'
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <IconButton
            color='inherit'
            onClick={closeLyric}
            aria-label='close'
            style={{ borderRadius: '0' }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
          <Lyric
            currentTime={currentTime}
            audioName={audioName}
            audioId={audioId}
            audioCover={audioCover}
          />
        </div>
      </Dialog>
    </div>
  );
}
