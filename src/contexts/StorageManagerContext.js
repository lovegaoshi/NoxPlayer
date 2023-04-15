import React, { useMemo } from 'react';
import StorageManager from '../objects/Storage';

const StorageManagerContext = React.createContext();

function StorageManagerProvider(props) {
  const value = useMemo(() => new StorageManager(), []);
  return (
    <StorageManagerContext.Provider value={value}>
      {props.children}
    </StorageManagerContext.Provider>
  );
}

export { StorageManagerContext, StorageManagerProvider };
