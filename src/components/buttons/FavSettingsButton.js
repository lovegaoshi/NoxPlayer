import React, { useState, useContext, useRef, useEffect } from "react";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { UpdateSubscribeDialog } from "../dialogs/FavSettingsDialog";
import RssFeedIcon from '@mui/icons-material/RssFeed';
import StorageManagerCtx from '../../popup/App';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';
import { getPlayerSettingKey, readLocalStorage, setLocalStorage } from '../../objects/Storage';

/**
 * a component that includes a setting button; an update button; and a setting dialog.
 * this component serves in Fav.js that it opens the setting window for a playlist;
 * and update playlist according to its subscription urls. 
 * @param {Object} currentList playlist object.
 * @param {function} rssUpdate function that updates the playlist's content, fetching its subscription urls.
 * @returns 
 */
export default function FavSettingsButtons({ currentList, rssUpdate }) {

    const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
    const StorageManager = useContext(StorageManagerCtx);
    const [Loading, setLoading] = useState(false);
    const favListAutoUpdateTimestamps = useRef({});

    // because in mobile view, fav gets destoryed when music is playing due to its UI layout;
    // favListAutoUpdateTimestamps is not persisted. thus a dict stored in chrome.storage.local
    // is mounted here. this has the additional benefit now that i dont have to see playlists 
    // get auto updated every time i reload the page because its now persisted through sessions
    useEffect( () => {
        readLocalStorage('favListAutoUpdateTimestamp').then(val => {
            if (val === undefined) return;
            favListAutoUpdateTimestamps.current = val;
        })
    }, [])

    useEffect(() => {

        const checkFavListAutoUpdate = async ({favList, updateInterval = 1000*60*60*24}) => {
            if (favList.info.id === 'Search' || ! await getPlayerSettingKey('autoRSSUpdate')) return false;
            console.debug(favList.info.title, 'previous updated timestamp is:', favListAutoUpdateTimestamps.current[favList.info.id]);
            if (favListAutoUpdateTimestamps.current[favList.info.id] === undefined || 
                (new Date() - new Date(favListAutoUpdateTimestamps.current[favList.info.id])) > updateInterval) {
                favListAutoUpdateTimestamps.current[favList.info.id] = new Date().toISOString();
                setLocalStorage('favListAutoUpdateTimestamp', favListAutoUpdateTimestamps.current);
                return true;
            }
            return false;
        }

        if (!currentList) {
            return;
        }
        checkFavListAutoUpdate({favList: currentList}).then((val) => {
            if (val) {
                setLoading(true);
                rssUpdate().then(res => setLoading(false)).catch(err => setLoading(false));
            }
        })
    }, [currentList])

    return (
        <React.Fragment >
            <Tooltip title="歌单设置">
                <IconButton 
                    size="large" 
                    onClick={() => setOpenSettingsDialog(true)}
                >
                    <RssFeedIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="歌单更新">
                <IconButton 
                    size="large" 
                    onClick={() => {
                        setLoading(true);
                        rssUpdate().then(res => setLoading(false)).catch(err => setLoading(false));
                    }}
                    disabled={false}
                >
                    {Loading ? <CircularProgress size={24} /> : <AutorenewIcon />}
                </IconButton>
            </Tooltip>
            <UpdateSubscribeDialog
                id='FavSettingsDialog'
                openState={openSettingsDialog}
                onClose={(settings)=>{
                    if (settings) {
                        StorageManager.setPlayerSetting(settings)
                    }
                    setOpenSettingsDialog(false)
                }}
                fromList={currentList}
                rssUpdate={rssUpdate}
            />
        </React.Fragment >
    )
}