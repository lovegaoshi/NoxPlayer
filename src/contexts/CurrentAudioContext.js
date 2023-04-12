import React, { useState } from 'react';

const CurrentAudioContext = React.createContext([{}, () => {}]);

const CurrentAudioProvider = (props) => {
  const [state, setState] = useState({});
  return (
    <CurrentAudioContext.Provider value={[state, setState]}>
      {props.children}
    </CurrentAudioContext.Provider>
  );
};

export { CurrentAudioContext, CurrentAudioProvider };
