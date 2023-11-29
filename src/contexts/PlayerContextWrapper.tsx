import React from 'react';
import { CurrentAudioProvider } from './CurrentAudioContext';

interface Props {
  children: JSX.Element;
}
export default function playerContext({ children }: Props) {
  return <CurrentAudioProvider>{children}</CurrentAudioProvider>;
}
