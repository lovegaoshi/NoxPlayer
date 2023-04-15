import React, {
  useState, useContext, useEffect, useMemo,
} from 'react';

const TimerContext = React.createContext();

export function TimerProvider(props) {
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
  };

  const timerPause = () => {
    setStartTimer(false);
  };

  const timerRestart = () => {
    setStartTimer(false);
    setMinutes(originalMMSS[0]);
    setSeconds(originalMMSS[1]);
  };

  const onTimerUp = () => document.getElementsByClassName('music-player-audio')[0].pause();

  useEffect(() => {
    if (!startTimer) return () => {};
    const timer = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      if (seconds === 0) {
        if (minutes > 0) {
          setSeconds(59);
          setMinutes(minutes - 1);
        } else {
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

  const value = useMemo(() => ({
    minutes, seconds, startTimer, setMinutes, setSeconds, timerRestart, timerStart, timerPause,
  }), [minutes, seconds, startTimer]);
  return (
    <TimerContext.Provider value={value}>
      {props.children}
    </TimerContext.Provider>
  );
}

export default function useTimer() {
  const {
    minutes, seconds, startTimer, setMinutes, setSeconds, timerRestart, timerStart, timerPause,
  } = useContext(TimerContext);
  return {
    minutes, seconds, startTimer, setMinutes, setSeconds, timerRestart, timerStart, timerPause,
  };
}
