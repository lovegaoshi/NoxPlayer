import React, { useState } from 'react';
import StorageManager from '../objects/Storage';

const StorageManagerContext = React.createContext();

const StorageManagerProvider = (props) => {
    return (
      <StorageManagerContext.Provider value={new StorageManager()}>
        {props.children}
      </StorageManagerContext.Provider>
    );
  }
  
export { StorageManagerContext, StorageManagerProvider };