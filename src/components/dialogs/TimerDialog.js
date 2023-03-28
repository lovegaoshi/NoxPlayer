import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';
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

/**
 * 
 */
export const TimerDialog = ({ openState, onClose, onTimerUp = () => console.log(new Date(), 'done') }) => {

    const [minutes, setMinutes] = useState(30);
    const [seconds, setSeconds] = useState(0);
    const [originalMMSS, setOriginalMMSS] = useState([]);
    const [startTimer, setStartTimer] = useState(false);

    const timerStart = () => {
        setStartTimer(true);
        let parsedMinutes = parseInt(minutes);
        let parsedSeconds = parseInt(seconds);
        parsedMinutes = parsedMinutes || 0;
        parsedSeconds = parsedSeconds || 0;
        setMinutes(parsedMinutes);
        setSeconds(parsedSeconds);
        setOriginalMMSS([parsedMinutes, parsedSeconds]);
    }

    const timerPause = () => {
        setStartTimer(false);
    }

    const timerRestart = () => {
        setStartTimer(false);
        setMinutes(originalMMSS[0]);       
        setSeconds(originalMMSS[1]);     
    }

    useEffect(() => {
        if (!startTimer) return () => {};
        const timer = setInterval(() => {
            if (seconds > 0) setSeconds(seconds - 1);
            if (seconds === 0) {
                if (minutes > 0) {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                }
                else {
                    onTimerUp();
                    clearInterval(timer);
                    timerRestart();
                }
            }
        }, 1000);
    
        return () => {
          clearInterval(timer);
        };
    });

    return (
        <Dialog open={openState}>
            <DialogTitle>定时停止播放</DialogTitle>
            <DialogContent style={{ paddingTop: "6px" }}>
                <TextField
                    id="timer-minutes"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    style={{ maxWidth: "6em", minWidth: "6em",  }}
                    label="MM"
                    disabled={startTimer}
                    type="number"
                />
                ：
                <TextField
                    id="timer-seconds"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    style={{ maxWidth: "6em", minWidth: "6em",  }}
                    label="SS"
                    disabled={startTimer}
                    type="number"
                />
                {
                    startTimer
                    ? <IconButton onClick={timerPause}>
                        <PauseIcon />
                    </IconButton>
                    : <IconButton onClick={timerStart}>
                        <PlayArrowIcon/>
                    </IconButton>
                }
                <IconButton onClick={timerRestart}>
                    <ReplayIcon/>
                </IconButton>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>确认</Button>
            </DialogActions>
        </Dialog>
    )
} 