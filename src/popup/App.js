import React, { useEffect, useState, createContext } from "react";
import PageLayout from './Layout';
import { initSongList } from '../background/DataProcess';
import StorageManager from '../objects/Storage';
import { skins } from '../styles/skin';
import { CurrentAudioProvider } from "../contexts/CurrentAudioContext";

 // Persist instance of the program, manages R/W to local storage.
const StorageManagerCtx = createContext()

export const App = function () {

    // The current playing list
    const [currentSongList, setCurrentSongList] = useState(null)

    useEffect(() => {
        initSongList(setCurrentSongList)
    }, [])

    useEffect(() => {
        document.title = skins().appTitle;
      }, []);

    //console.log(currentSongList)
    return (
        <CurrentAudioProvider>
            <StorageManagerCtx.Provider value={new StorageManager()}>
                <PageLayout
                    songList={currentSongList}
                />
            </StorageManagerCtx.Provider>
        </CurrentAudioProvider>
    )
}

export default StorageManagerCtx

