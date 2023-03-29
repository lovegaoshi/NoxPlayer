import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../css/react-jinke-player.css';
import { FavList } from '../components/FavList';
import { LyricOverlay } from './LyricOverlay';
import StorageManagerCtx from '../popup/App';
import { skins, skinPreset } from '../styles/skin';
import { useHotkeys } from 'react-hotkeys-hook';
import { getName } from '../utils/re';
import versionUpdate from '../utils/versionupdater/versionupdater';
import FavoriteButton from './buttons/FavoriteSongButton';
import ThumbsUpButton from "./buttons/ThumbsUpButton";
import { fetchPlayUrlPromise } from '../utils/Data';
import usePlayer from "../hooks/usePlayer";

// Initial Player options
let options = {
    mode: 'full',
    showThemeSwitch: false,
    showLyric: false,
    toggleMode: false,
    locale: 'zh_CN',
    autoPlayInitLoadPlayList: true,
    autoPlay: false,
    defaultPlayIndex: 0,
    bannerBg: skins().playerBanner,
    themeOverwrite: skins().reactJKPlayerTheme,
}

export const Player = function ({ songList }) {

    // Sync data to chromeDB
    const StorageManager = useContext(StorageManagerCtx)

    const [
        params, setparams,
        setplayingList,
        currentAudio, setcurrentAudio,
        currentAudioInst,
        showLyric, setShowLyric,
        playerSettings, setPlayerSettings,
        
        onPlayOneFromFav,
        onAddOneFromFav,
        onPlayAllFromFav,
        onAddFavToList,
        playByIndex,
        onPlayModeChange,
        onAudioVolumeChange,
        onAudioListsChange,
        onAudioProgress,
        getAudioInstance,
        customDownloader,
        onCoverClick,
    ] = usePlayer();

    useHotkeys('space', () => {
        if (currentAudioInst === null) return;
        // i have no idea why currentAudioInst doesnt have play(), but this works
        // reactJKPlayer's spaceBar prop only listens when it has focus; this allows spacebar
        // listening to pause/play audio at a global level.
        if (currentAudioInst.paused) document.getElementsByClassName('music-player-audio')[0].play();
        else document.getElementsByClassName('music-player-audio')[0].pause();
    });

    useHotkeys('pagedown', () => window.musicplayer.onPlayNextAudio());
    useHotkeys('pageup', () => window.musicplayer.onPlayPrevAudio());

    useEffect( () => {
        StorageManager.setPlayerSettingInst = setPlayerSettings;
    }, [])

    useEffect(() => {
        if (!currentAudio?.name) return;
        document.title = currentAudio.name + ' - ' + skins().appTitle;
    }, [currentAudio.name])

    const onAudioPlay = useCallback(async (audioInfo) => {
        processExtendsContent(renderExtendsContent({ song: audioInfo }))
        setcurrentAudio(audioInfo)
        chrome.storage.local.set({ ['CurrentPlaying']: {cid: audioInfo.id.toString(), playUrl: audioInfo.musicSrc} })
    }, [params])
    
    const onAudioError = (errMsg, currentPlayId, audioLists, audioInfo) => {
        console.error('audio error', errMsg, audioInfo)
    }

    const processExtendsContent = (extendsContent) => setparams({...params, extendsContent});

    const renderExtendsContent = ({ song }) => {
        return [
            (<ThumbsUpButton song={song} key="song-thumbup-btn"></ThumbsUpButton>),
            (<FavoriteButton song={song} key="song-fav-btn"></FavoriteButton>)
        ]
    }

    // Initialization effect
    useEffect(() => {
        // using this debug message, even when songList is changed this is only initialized once. but why? 
        console.debug('ran Init useEffect - Player', songList.length)
        if (!songList || songList[0] == undefined)
            return;
        async function initPlayer() {
            await versionUpdate();
            let setting = await StorageManager.getPlayerSetting()
            let previousPlaying = (await StorageManager.readLocalStorage('CurrentPlaying'))
            if (previousPlaying === undefined) previousPlaying = {}
            let previousPlayingSongIndex = Math.max(0, (songList.findIndex((s) => s.id == previousPlaying.cid)))
            options.extendsContent = renderExtendsContent({ song: songList[previousPlayingSongIndex] })
            const params = {
                ...options,
                ...setting,
                audioLists: songList,
                defaultPlayIndex: previousPlayingSongIndex,
            }
            setparams(params)
            setplayingList(songList)
            setPlayerSettings(setting)
        }
        initPlayer()
    }, [songList])

    return (
        <React.Fragment>
            {params && <FavList currentAudioList={params.audioLists}
                onSongIndexChange={playByIndex}
                onPlayOneFromFav={onPlayOneFromFav}
                onPlayAllFromFav={onPlayAllFromFav}
                onAddFavToList={onAddFavToList}
                onAddOneFromFav={onAddOneFromFav}
                playerSettings={playerSettings}
            />}
            {currentAudio.id && <LyricOverlay
                showLyric={showLyric}
                currentTime={currentAudio.currentTime}
                audioName={getName(currentAudio)}
                audioId={currentAudio.id}
                audioCover={currentAudio.cover}
                closeLyric={() => setShowLyric(false)}
                />}

            {params &&
                <React.Fragment>
                        <ReactJkMusicPlayer
                            {...params}
                            showMediaSession
                            onAudioVolumeChange={onAudioVolumeChange}
                            onPlayModeChange={onPlayModeChange}
                            onAudioError={onAudioError}
                            customDownloader={customDownloader}
                            onAudioProgress={onAudioProgress}
                            getAudioInstance={getAudioInstance}
                            onAudioPlay={onAudioPlay}
                            onCoverClick={onCoverClick}
                            onAudioListsChange={onAudioListsChange}
                            theme={skinPreset.desktopTheme}
                            musicSrcParser={(v) => fetchPlayUrlPromise(v.bvid, v.id)}
                            ref={(element) => {window.musicplayer = element}}
                        />
                </React.Fragment>}
        </React.Fragment>
    )
}