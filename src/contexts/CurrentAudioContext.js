import React, { useState, useMemo } from 'react';

const CurrentAudioContext = React.createContext([{}, () => {}]);

function CurrentAudioProvider(props) {
  const [state, setState] = useState({});
  const value = useMemo(() => [state, setState], [state]);
  return (
    <CurrentAudioContext.Provider value={value}>
      {props.children}
    </CurrentAudioContext.Provider>
  );
}

export { CurrentAudioContext, CurrentAudioProvider };
