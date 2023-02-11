import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../css/react-jinke-player.css';
import { FavList } from '../components/FavList';
import { BiliBiliIcon } from "./bilibiliIcon";
import { LyricOverlay } from './LyricOverlay';
import StorageManagerCtx from '../popup/App';
import { skins, skinPreset } from '../styles/skin';
import { checkBVLiked } from '../utils/BiliOperate';
import { CurrentAudioContext } from "../contexts/CurrentAudioContext";
import { useHotkeys } from 'react-hotkeys-hook';

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

    // Params to init music player
    const [params, setparams] = useState(null)
    // Playing List
    const [playingList, setplayingList] = useState(null)
    // Current Audio info
    const [currentAudio, setcurrentAudio] = useContext(CurrentAudioContext)
    // Current Audio Inst
    const [currentAudioInst, setcurrentAudioInst] = useState(null)
    // Lyric Dialog
    const [showLyric, setShowLyric] = useState(false)
    // Player Settings
    const [playerSettings, setPlayerSettings] = useState(null)
    // Sync data to chromeDB
    const StorageManager = useContext(StorageManagerCtx)
    const [bvidLiked, setBvidLiked] = useState(0)

    useHotkeys('space', () => {
        if (currentAudioInst !== null) {
            if (currentAudioInst.paused) {
                // i have no idea why currentAudioInst doesnt have play(), but
                // this works...
                document.getElementsByClassName('music-player-audio')[0].play();
            } else {
                document.getElementsByClassName('music-player-audio')[0].pause();
            }
        }
    })

    useEffect(() => {
        if (!currentAudio.name) {
            return;
        }
        document.title = currentAudio.name + ' - ' + skins().appTitle;
    }, [currentAudio.name])
    
    const updateCurrentAudioList = useCallback(({ 
        songs,
        immediatePlay = false,
        replaceList = false,
        newAudioListPlayIndex = 0
    }) => {
        //console.log("updateCurrentAudioList", params)
        let newAudioLists = []
        if (immediatePlay) {
            // Click and play
            newAudioLists = [
                ...songs,
                ...playingList,
            ]
        }
        else if (replaceList) {
            // OnPlayList handle
            newAudioLists = [...songs]
        }
        else {
            // AddToList handle
            newAudioLists =
                [
                    ...playingList,
                    ...songs,
                ]
        }
        const newParam = {
            ...params,
            quietUpdate: !immediatePlay,
            clearPriorAudioLists: immediatePlay || replaceList,
            audioLists: newAudioLists,
            newAudioListPlayIndex,
        }
        //console.log(newParam)
        setparams(newParam)
        setplayingList(newAudioLists)
    }, [params, playingList])

    const onPlayOneFromFav = useCallback((songs, favList) => {
        const existingIndex = playingList.findIndex((s) => s.id == songs[0].id)
        if (playingList.length === favList.songList.length && existingIndex != -1) {
            currentAudioInst.playByIndex(existingIndex)
            return
        }

        updateCurrentAudioList({ 
            songs: favList.songList,
            replaceList: true,
            newAudioListPlayIndex: favList.songList.findIndex((s) => s.id == songs[0].id) 
        })
    }, [params, playingList, currentAudioInst])

    const onAddOneFromFav = useCallback((songs) => {

        const existingIndex = playingList.findIndex((s) => s.id == songs[0].id)
        //console.log(existingIndex)
        if (existingIndex != -1) {
            return
        }
        updateCurrentAudioList({ songs: songs, immediatePlay: false })
    }, [params, playingList])

    const onPlayAllFromFav = useCallback((songs) => {
        console.debug('current PlayMode is', params.playMode)
        updateCurrentAudioList({ 
            songs: songs,
            immediatePlay: false,
            replaceList: true,
            newAudioListPlayIndex: params.playMode === 'shufflePlay' 
                ? Math.floor(Math.random() * songs.length)>>0 
                : 0
        })

    }, [params])

    const onAddFavToList = useCallback((songs) => {
        //If song exists in currentPlayList, remove it
        const newSongsInList = songs.filter(v => playingList.find(s => s.id == v.id) == undefined)

        updateCurrentAudioList({ songs: newSongsInList, immediatePlay: false, replaceList: false })
    }, [params, playingList])

    const playByIndex = useCallback((index) => {
        currentAudioInst.playByIndex(index)
    }, [currentAudioInst])

    const onPlayModeChange = (playMode) => {
        //console.log('play mode change:', playMode)
        playerSettings.playMode = playMode
        setPlayerSettings(playerSettings)
        params.playMode = playMode
        StorageManager.setPlayerSetting(playerSettings)
        setparams(params)
    }

    const onAudioVolumeChange = (currentVolume) => {
        // console.log('audio volume change', currentVolume)
        playerSettings.defaultVolume = Math.sqrt(currentVolume)
        setPlayerSettings(playerSettings)
        StorageManager.setPlayerSetting(playerSettings)
    }

    const onAudioPlay = useCallback((audioInfo) => {
        // console.log('audio playing', audioInfo)
        checkBVLiked(
            audioInfo.bvid,
            (videoLikeStatus) => {
                setBvidLiked(videoLikeStatus);
                const newParam = {
                    ...params,
                    extendsContent: BiliBiliIcon({ bvid: audioInfo.bvid, liked: videoLikeStatus, handleThumbsUp: (val) => {
                        console.debug('like video returned', val)
                        setparams({...params, extendsContent: BiliBiliIcon({ bvid: audioInfo.bvid, liked: 1 })})
                    } })
                }
                setparams(newParam)
            })
        setcurrentAudio(audioInfo)
        chrome.storage.local.set({ ['CurrentPlaying']: {cid:audioInfo.id.toString(), playUrl:audioInfo.musicSrc} })
    }, [params])

    const onAudioListsChange = useCallback((currentPlayId, audioLists, audioInfo) => {
        // Sync latest-playinglist
        StorageManager.setLastPlayList(audioLists)
        setplayingList(audioLists)
        //console.log('audioListChange:', audioLists)
    }, [params, playingList])

    const onAudioError = (errMsg, currentPlayId, audioLists, audioInfo) => {
        console.error('audio error', errMsg, audioInfo)
    }

    const onAudioProgress = (audioInfo) => {
        // this is updated every 0.1sec or so. disabling this seems to make playing >3000 songs list 
        // a tinny bit faster; the other slowing part is audioTimeUpdate's setState in JKmusicplayer. 
        // its probably because with a huge songlist, updating musicplayer state recreatign it somehow and its very slow
        // to recreate objects with that huge songlist. it might need to be restructured to have player send next music signal
        // to controller (player.js here) so it doesnt have to save that list anymore.

        if (showLyric) {
            setcurrentAudio(audioInfo);
        }
    }

    const getAudioInstance = (audio) => {
        setcurrentAudioInst(audio)
    }

    const customDownloader = (downloadInfo) => {
        fetch(downloadInfo.src)
            .then(res => {
                return res.blob();
            }).then(blob => {
                const href = window.URL.createObjectURL(blob);
                const link = document.createElement('a')
                link.href = href // a.mp3
                link.download = currentAudioInst.title + '.mp3'
                document.body.appendChild(link)
                link.click()
            }).catch(err => console.error(err));
    }

    const onCoverClick = () => {
        setShowLyric(!showLyric)
    }

    // Initialization effect
    useEffect(() => {
        // using this debug message, even when songList is changed this is only initialized once. but why? 
        console.debug('ran Init useEffect - Player', songList.length)
        if (!songList || songList[0] == undefined)
            return;
        async function initPlayer() {
            let setting = await StorageManager.getPlayerSetting()
            let previousPlaying = (await StorageManager.readLocalStorage('CurrentPlaying'))
            if (previousPlaying === undefined) previousPlaying = {}
            let previousPlayingSongIndex = Math.max(0, (songList.findIndex((s) => s.id == previousPlaying.cid)))
            options.extendsContent = BiliBiliIcon({ bvid: songList[previousPlayingSongIndex].bvid, liked: undefined })
            // oath2agent.onBtnClick()
            // chrome.storage.local.set({ ['CurrentPlaying']: {} })
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

    // //console.log('params')
    // //console.log(params)
    // //console.log('lyric' + lyric)
    // console.log(currentAudio)
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
                audioName={currentAudio.name}
                audioId={currentAudio.id}
                audioCover={currentAudio.cover}
                artist={currentAudio.singer}
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
                        />
                </React.Fragment>}
        </React.Fragment>
    )
}