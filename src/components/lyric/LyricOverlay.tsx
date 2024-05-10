import React from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import Lyric from './Lyric';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

interface Props {
  currentAudio: NoxMedia.Song;
  showLyric: boolean;
  currentTime: number;
  closeLyric?: () => void;
}
export default function LyricOverlay({
  currentAudio,
  showLyric,
  currentTime,
  closeLyric = () => {},
}: Props) {
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
            backgroundImage: `url(${currentAudio?.cover})`,
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
          <Lyric currentTime={currentTime} currentAudio={currentAudio} />
        </div>
      </Dialog>
    </div>
  );
}
