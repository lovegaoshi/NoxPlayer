import React, { useState } from 'react';
import { CurrentAudioProvider } from "./CurrentAudioContext";

export default (props) => {
    return (
      <CurrentAudioProvider>
        {props.children}
      </CurrentAudioProvider>
    );
  }