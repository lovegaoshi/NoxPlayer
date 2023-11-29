import React, { useState } from 'react';
import { CurrentAudioProvider } from './CurrentAudioContext';

export default function playerContext(props) {
  return <CurrentAudioProvider>{props.children}</CurrentAudioProvider>;
}
