import React, { useEffect } from 'react';

import useTimer from '@APM/components/playlists/useTimer';

export default () => {
  const timer = useTimer({
    onTimerUp: () =>
      // @ts-expect-error
      document.getElementsByClassName('music-player-audio')[0]?.pause(),
  });

  useEffect(() => {
    if (!timer.startTimer) return () => {};
    const timerEffect = setInterval(() => {
      if (timer.runTimer()) {
        clearInterval(timerEffect);
        console.debug('timer stopped.');
      }
    }, 1000);

    return () => {
      clearInterval(timerEffect);
    };
  });
  return timer;
};
