import React, { useState, useMemo } from 'react';

const CurrentAudioContext = React.createContext<any>([{}, () => {}]);

interface Props {
  children: JSX.Element;
}
function CurrentAudioProvider({ children }: Props) {
  const [state, setState] = useState<any>({});
  const value = useMemo(() => [state, setState], [state]);
  return (
    <CurrentAudioContext.Provider value={value}>
      {children}
    </CurrentAudioContext.Provider>
  );
}

export { CurrentAudioContext, CurrentAudioProvider };
