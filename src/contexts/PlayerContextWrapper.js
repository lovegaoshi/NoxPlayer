import React, { useState } from 'react';
import { CurrentAudioProvider } from './CurrentAudioContext';
import { TimerProvider } from './TimerContext';

export default (props) => {
  return (
    <CurrentAudioProvider>
      <TimerProvider>
        {props.children}
      </TimerProvider>
    </CurrentAudioProvider>
  );
};
