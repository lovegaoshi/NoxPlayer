import React, { useEffect, useState, useCallback, useContext } from "react";
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../css/react-jinke-player.css';
import Box from "@mui/material/Box";
import { FavListMobile } from './FavListMobile'
import { BiliBiliIcon } from "./bilibiliIcon";
import { LyricOverlay } from './LyricOverlay';
import StorageManagerCtx from '../popup/App';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import IconButton from "@mui/material/IconButton";

// Initial Player options
const options = {
    mode: 'full',
    showThemeSwitch: false,
    showLyric: false,
    toggleMode: false,
    locale: 'zh_CN',
    autoPlayInitLoadPlayList: true,
    autoPlay: false,
    defaultPlayIndex: 0,
    isInitRemember: true,
}

export const PlayerMobile = function ({ songList }) {

    // Params to init music player
    const [params, setparams] = useState(null)
    // Playing List
    const [playingList, setplayingList] = useState(null)
    // Current Audio info
    const [currentAudio, setcurrentAudio] = useState(null)
    // Current Audio Inst
    const [currentAudioInst, setcurrentAudioInst] = useState(null)
    // Lyric Dialog
    const [showLyric, setShowLyric] = useState(false)
    // FavList Dialog
    const [showFavList, setShowFavList] = useState(false)
    // Player Settings
    const [playerSettings, setPlayerSettings] = useState(null)
    // Sync data to chromeDB
    const StorageManager = useContext(StorageManagerCtx)

    const updateCurrentAudioList = useCallback(({ songs, immediatePlay = false, replaceList = false }) => {
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
            audioLists: newAudioLists
        }
        //console.log(newParam)
        setparams(newParam)
        setplayingList(newAudioLists)
    }, [params, playingList])

    const onPlayOneFromFav = useCallback((songs) => {

        const existingIndex = playingList.findIndex((s) => s.id == songs[0].id)
        //console.log(existingIndex)
        if (existingIndex != -1) {
            currentAudioInst.updatePlayIndex(existingIndex)
            return
        }

        updateCurrentAudioList({ songs: songs, immediatePlay: true })
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
        updateCurrentAudioList({ songs: songs, immediatePlay: false, replaceList: true })

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
        StorageManager.setPlayerSetting(playerSettings)
    }

    const onAudioVolumeChange = (currentVolume) => {
        // console.log('audio volume change', currentVolume)
        playerSettings.defaultVolume = Math.sqrt(currentVolume)
        setPlayerSettings(playerSettings)
        StorageManager.setPlayerSetting(playerSettings)
    }

    const playlistButton = () => {
        return (
            <span className="go2playlist" title="playlist">
                <IconButton>            
                    <QueueMusicIcon 
                        style={{ width: '32px', height: '32px' }}
                        sx={{ color: 'gray' }} 
                        onClick={() => {
                            setShowFavList(favState => !favState)
                        }}
                    ></QueueMusicIcon>
                </IconButton>
            </span >
        )
    }

    const onAudioPlay = useCallback((audioInfo) => {
        // console.log('audio playing', audioInfo)
        const link = 'https://www.bilibili.com/video/' + audioInfo.bvid
        const newParam = {
            ...params,
            extendsContent: (
                <span className="go2playlist" title="playlist">
                    <IconButton>            
                        <QueueMusicIcon 
                            style={{ width: '32px', height: '32px' }}
                            sx={{ color: 'gray' }} 
                            onClick={() => {
                                setShowFavList(favState => !favState)
                            }}
                        ></QueueMusicIcon>
                    </IconButton>
                </span >
                
            )
        }
        console.debug(audioInfo)
        setparams(newParam)
        chrome.storage.local.set({ ['CurrentPlaying']: {cid:audioInfo.id.toString(),playUrl:audioInfo.musicSrc} })
    }, [params])

    const onAudioListsChange = useCallback((currentPlayId, audioLists, audioInfo) => {
        // Sync latest-playinglist
        StorageManager.setLastPlayList(audioLists)
        setplayingList(audioLists)
        //console.log('audioListChange:', audioLists)
    }, [params, playingList])

    const onAudioError = (errMsg, currentPlayId, audioLists, audioInfo) => {
        console.error('audio error', errMsg, currentPlayId, audioLists, audioInfo)
        setTimeout(() => {
            console.debug ('retrying...')
            currentAudioInst.playByIndex(1, true)
        }, "1000")
        
    }

    const onAudioProgress = (audioInfo) => {
        setcurrentAudio(audioInfo)
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
        // console.log('ran Init useEffect - Player', songList)
        if (!songList || songList[0] == undefined)
            return;
        chrome.storage.local.set({ ['CurrentPlaying']: {} })
        
        async function initPlayer() {
            let setting = await StorageManager.getPlayerSetting()
            // console.log('setting:' + setting)
            if (undefined == setting) {
                setting = { playMode: 'shufflePlay', defaultPlayMode: 'shufflePlay', defaultVolume: 1 }
                StorageManager.setPlayerSetting(setting)
            }

            const link = 'https://www.bilibili.com/video/' + songList[0].bvid
            options.extendsContent = (
                <span className="go2playlist" title="playlist">
                    <IconButton>            
                        <QueueMusicIcon 
                            style={{ width: '32px', height: '32px' }}
                            sx={{ color: 'gray' }} 
                            onClick={() => {
                                setShowFavList(favState => !favState)
                            }}
                        ></QueueMusicIcon>
                    </IconButton>
                </span >
            )
            const params = {
                ...options,
                ...setting,
                audioLists: songList
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
            {params && <FavListMobile currentAudioList={params.audioLists}
                onSongIndexChange={playByIndex}
                onPlayOneFromFav={onPlayOneFromFav}
                onPlayAllFromFav={onPlayAllFromFav}
                onAddFavToList={onAddFavToList}
                onAddOneFromFav={onAddOneFromFav}
                showFavList={showFavList}
            />}
            {currentAudio && <LyricOverlay
                showLyric={showLyric}
                currentTime={currentAudio.currentTime}
                audioName={currentAudio.name}
                audioId={currentAudio.id}
                audioCover={currentAudio.cover}
                isMobile={true}
                />}
                

            {params &&
                <React.Fragment>
                    <Box // Bottom Grid -- Footer
                        display="flex"
                        flex="1"
                        justifyContent="space-around"
                        style={{ maxHeight: "100%", height: "64px" }} // Relative height against the Player
                        sx={{ gridArea: "footer" }}
                    >
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
                        />
                    </Box>
                </React.Fragment>}
        </React.Fragment>
    )
}