import React, { useEffect, useState, useCallback, useContext } from "react";
import ReactJkMusicPlayer from 'react-jinke-music-player';
import '../css/react-jinke-player.css';
import Box from "@mui/material/Box";
import { FavList } from './FavListMobile';
import { BiliBiliIcon } from "./bilibiliIcon";
import { LyricOverlay } from './LyricOverlay';
import StorageManagerCtx from '../popup/App';
import { skins } from '../styles/skin';
import { checkBVLiked } from '../utils/BiliOperate';

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
    isInitRemember: true,
    bannerBg: "",
    themeOverwrite: skins().reactJKPlayerTheme,
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
    const [lrcOverlayOpenStateEmitter, setLrcOverlayOpenStateEmitter] = useState(false)
    const [audioListsPanelState, setAudioListsPanelState] = useState(false)
    const [bvidLiked, setBvidLiked] = useState(0)

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

    const onPlayOneFromFav = useCallback((songs, favList) => {
        const existingIndex = playingList.findIndex((s) => s.id == songs[0].id)
        //console.log(existingIndex)
        if (existingIndex != -1) {
            currentAudioInst.playByIndex(existingIndex)
            return
        }

        updateCurrentAudioList({ songs: songs.concat(favList.songList), replaceList: true })
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
        StorageManager.setPlayerSetting(playerSettings)
    }

    const onAudioVolumeChange = (currentVolume) => {
        // console.log('audio volume change', currentVolume)
        playerSettings.defaultVolume = Math.sqrt(currentVolume)
        setPlayerSettings(playerSettings)
        StorageManager.setPlayerSetting(playerSettings)
    }

    const onAudioPlay = useCallback((audioInfo) => {
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
        if (lrcOverlayOpenStateEmitter) {
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
        // console.log('ran Init useEffect - Player', songList)
        if (!songList || songList[0] == undefined)
            return;
        chrome.storage.local.set({ ['CurrentPlaying']: {} })
        
        async function initPlayer() {
            let setting = await StorageManager.getPlayerSetting()
            options.extendsContent = BiliBiliIcon({ bvid: songList[0].bvid, liked: undefined })
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

    // handles swipe action: call playlist when swiping left
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);
    
    function handleTouchStart(e) {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    }
    
    function handleTouchMove(e) {
        setTouchEnd(e.targetTouches[0].clientX);
    }
    
    function handleTouchEnd() {
        if (!touchEnd || audioListsPanelState) {
            return;
        }
        if (touchStart - touchEnd > 50) {
            // do your stuff here for left swipe
            setShowFavList(favState => !favState);
        }    
    }
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
                showFavList={showFavList}
                currentAudioID={currentAudio? currentAudio.id : -1}
            />}
            {currentAudio && <LyricOverlay
                showLyric={showLyric}
                currentTime={currentAudio.currentTime}
                audioName={currentAudio.name}
                audioId={currentAudio.id}
                audioCover={currentAudio.cover}
                isMobile={true}
                artist={currentAudio.singer}
                setOpenStateEmitter={setLrcOverlayOpenStateEmitter}
                />}
                

            {params &&
                <React.Fragment>
                    <Box // Bottom Grid -- Footer
                        display="flex"
                        flex="1"
                        justifyContent="space-around"
                        style={{ maxHeight: "0%", height: "0px" }} // Relative height against the Player
                        sx={{ gridArea: "footer" }}
                        onTouchStart={touchStartEvent => handleTouchStart(touchStartEvent)}
                        onTouchMove={touchMoveEvent => handleTouchMove(touchMoveEvent)}
                        onTouchEnd={() => handleTouchEnd()}
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
                            onAudioListsPanelChange={setAudioListsPanelState}
                        />
                    </Box>
                </React.Fragment>}
        </React.Fragment>
    )
}