import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../css/react-jinke-player.css';
import { FavList } from '../components/FavList';
import { BiliBiliIcon } from "./bilibiliIcon";
import { LyricOverlay } from './LyricOverlay';
import StorageManagerCtx from '../popup/App';
import { skins, skinPreset } from '../styles/skin';
import { checkBVLiked } from '../utils/BiliOperate';
import { useHotkeys } from 'react-hotkeys-hook';
import { getName } from '../utils/re';
import versionUpdate from '../utils/versionupdater/versionupdater';
import favoriteButton from './buttons/favoriteSongButton';
import { FAV_FAV_LIST_KEY, setLocalStorage } from '../objects/Storage';
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
        const songFavorited = (await StorageManager.readLocalStorage(FAV_FAV_LIST_KEY)).songList.filter(val => val.id === audioInfo.id).length > 0;
        const biliButtonHandleClick = (val) => {
            console.debug(`liking bvid ${audioInfo.bvid} returned`, val)
            processExtendsContent(renderExtendsContent({ song: audioInfo, liked: 1, songFavorited }))
        }
        checkBVLiked(
            audioInfo.bvid,
            (val) => processExtendsContent(renderExtendsContent({ song: audioInfo, liked: val, handleThumbsUp: biliButtonHandleClick, songFavorited }))
        )
        setcurrentAudio(audioInfo)
        chrome.storage.local.set({ ['CurrentPlaying']: {cid: audioInfo.id.toString(), playUrl: audioInfo.musicSrc} })
    }, [params])
    
    const onAudioError = (errMsg, currentPlayId, audioLists, audioInfo) => {
        console.error('audio error', errMsg, audioInfo)
    }

    const processExtendsContent = (extendsContent) => setparams({...params, extendsContent});

    // TODO: this is most definitely wrong but I dont know the right way.
    const renderExtendsContent = ({ song, liked, handleThumbsUp, handleThumbedUp, songFavorited = false }) => {
        // but how do I achieve state control in here?
        const setFavorited = async () => {
            let favFavList = await StorageManager.readLocalStorage(FAV_FAV_LIST_KEY);
            if (songFavorited) {
                favFavList.songList = favFavList.songList.filter(val => val.id !== song.id);
            } else {
                favFavList.songList.push(song);
            }
            await setLocalStorage(FAV_FAV_LIST_KEY, favFavList);
            return processExtendsContent(renderExtendsContent({ song, liked, handleThumbsUp, handleThumbedUp, songFavorited: !songFavorited }));
        }

        const handleClick = () => {
            if (liked === undefined) return console.log('disabled.');
            return setFavorited();
        }

        return [
            BiliBiliIcon({ bvid: song.bvid, liked, handleThumbsUp, handleThumbedUp }),
            favoriteButton({ filled: songFavorited, handleClick })
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
            options.extendsContent = renderExtendsContent({ song: songList[previousPlayingSongIndex], liked: undefined })
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