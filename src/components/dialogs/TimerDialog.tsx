/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import useTimer from '@APM/components/playlists/useTimer';

/**
 *
 */
export default function TimerDialog({
  openState,
  onClose,
}: {
  openState: boolean;
  onClose: () => void;
}) {
  const {
    minutes,
    seconds,
    startTimer,
    setMinutes,
    setSeconds,
    timerRestart,
    timerStart,
    timerPause,
  } = useTimer({});

  return (
    <Dialog open={openState}>
      <DialogTitle>定时停止播放</DialogTitle>
      <DialogContent style={{ paddingTop: '6px' }}>
        <TextField
          id='timer-minutes'
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          style={{ maxWidth: '6em', minWidth: '6em' }}
          label='MM'
          disabled={startTimer}
          type='number'
        />
        ：
        <TextField
          id='timer-seconds'
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          style={{ maxWidth: '6em', minWidth: '6em' }}
          label='SS'
          disabled={startTimer}
          type='number'
        />
        {startTimer ? (
          <IconButton onClick={timerPause}>
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton onClick={timerStart}>
            <PlayArrowIcon />
          </IconButton>
        )}
        <IconButton onClick={timerRestart}>
          <ReplayIcon />
        </IconButton>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>确认</Button>
      </DialogActions>
    </Dialog>
  );
}
