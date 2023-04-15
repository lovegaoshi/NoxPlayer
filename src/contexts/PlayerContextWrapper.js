import React, { useState } from 'react';
import { CurrentAudioProvider } from './CurrentAudioContext';
import { TimerProvider } from './TimerContext';
import { StorageManagerProvider } from './StorageManagerContext';

export default function playerContext (props) {
  return (
    <CurrentAudioProvider>
      <TimerProvider>
        <StorageManagerProvider>
          {props.children}
        </StorageManagerProvider>
      </TimerProvider>
    </CurrentAudioProvider>
  );
}
