import React, { useEffect, useState, useCallback, memo, useContext } from "react";
import { searchBiliURLs, Search, defaultSearchList } from '../components/Search';
import { Fav } from './Fav';
import { ScrollBar } from "../styles/styles";
import { AlertDialog } from "./ConfirmDialog";
import { AddFavDialog, NewFavDialog, UpdateSubscribeDialog, SettingsDialog } from "./AddFavDialog";
import StorageManagerCtx from '../popup/App';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { skinPreset } from '../styles/skin';
import { parseSongName } from '../utils/re';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

let colorTheme = skinPreset.colorTheme;

export const outerLayerBtn = { padding: 'unset' }

export const CRUDBtn = {
    ':hover': {
        cursor: 'default'
    },
    paddingLeft: '8px',
    paddingRight: '8px'
}

const CRUDIcon = {
    ':hover': {
        cursor: 'pointer'
    },
    width: '1em',
    height: '1em',
    paddingBottom: '2px',
    color: colorTheme.playListIconColor,
}

const AddFavIcon = {
    ':hover': {
        cursor: 'pointer'
    },
    width: '1em',
    color: colorTheme.playListIconColor,
}

export const DiskIcon = {
    minWidth: '36px'
}

export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const FavList = memo(function ({ onSongListChange, onPlayOneFromFav, onPlayAllFromFav, onAddFavToList, onAddOneFromFav, playerSettings }) {
    const [favLists, setFavLists] = useState(null)
    const [selectedList, setSelectedList] = useState(null)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openUpdateSubscribeDialog, setOpenUpdateSubscribeDialog] = useState(false)
    const [openSettingsDialog, setOpenSettingsDialog] = useState(false)
    const [openNewDialog, setOpenNewDialog] = useState(false)
    const [actionFavId, setActionFavId] = useState(null)
    const [actionFavSong, setActionFavSong] = useState(null)
    const [searchList, setSearchList] = useState({ info: { title: '搜索歌单', id: 'Search' }, songList: [] })
    const [rssLoading, setRSSLoading] = useState(false)
    const [songsStoredAsNewFav, setSongsStoredAsNewFav] = useState(null)
    const [searchInputVal, setSearchInputVal] = useState('')

    const StorageManager = useContext(StorageManagerCtx)

    useEffect(() => {
        // Caches setter and latest favList in StoreMng
        StorageManager.setFavLists = setFavLists
        StorageManager.initFavLists()

        //console.log(favLists)
    }, [])

    const handleSearch = useCallback((list) => {
        setSearchList(list)
        setSelectedList(list)
    }, [searchList, selectedList])

    const handleDeleteFromSearchList = useCallback((listid, songid) => {
        let favList = listid == 'Search' ? searchList : favLists.find(f => f.info.id == listid)
        let index = favList.songList.findIndex((song) => song.id === songid)
        favList.songList.splice(index, 1)
        const updatedToList = { ...favList }
        listid == 'Search' ? setSearchList(updatedToList) : StorageManager.updateFavList(updatedToList)
    }, [searchList, selectedList, favLists])

    const onNewFav = (val) => {
        setOpenNewDialog(false)
        if (val) {
            //console.log(val)
            let favList = StorageManager.addFavList(val, favLists)
            if (songsStoredAsNewFav) {
                favList.songList = songsStoredAsNewFav
                setSongsStoredAsNewFav(null)
                favList.subscribeUrls = [searchInputVal.slice()]
                StorageManager.updateFavList(favList)
            }
        }
    }
    
    const updateSubscribeURL = (listObj, urls, favListName) => {
        setOpenUpdateSubscribeDialog(false)
        if (listObj) {
            listObj.subscribeUrls = urls
            listObj.info.title = favListName
            StorageManager.updateFavList(listObj)
        }
    }

    const updateSubscribeFavList = async (listObj) => {
        setRSSLoading(true)
        try{
            for (let i=0, n=listObj.subscribeUrls.length; i < n; i++) {
                listObj.songList = (await searchBiliURLs(listObj.subscribeUrls[i], (arg) => {}, listObj.songList)).songList.concat(listObj.songList)
            }
            let uniqueSongList = new Map();
            for (const tag of listObj.songList) {
                // cid should be a unique value? its a unique identifier for videos with multiple episodes.
                uniqueSongList.set(tag.id, tag);
            }
            listObj.songList = [...uniqueSongList.values()];
            for (let i=0, n=listObj.songList.length; i < n; i++) {
                parseSongName(listObj.songList[i])
            }
            StorageManager.updateFavList(listObj)
            // otherwise fav wont update
            setSelectedList(null)
            setSelectedList(listObj)
        } catch(err) {
            console.error(err)
        } finally {
            setRSSLoading(false)
        }
    }

    const handleDeleteFavClick = (id) => {
        setActionFavId(id)
        setOpenDeleteDialog(true)
    }

    const handleAddToFavClick = (id, song) => {
        setActionFavId(id)
        setActionFavSong(song)
        setOpenAddDialog(true)
    }

    /* 
        3 Scenarios:
            1. Single song add, either from searchList or favList
            2. Whole searchList
            3. Whole favList 
    */
    const onAddFav = (fromId, toId, song) => {
        setOpenAddDialog(false)
        if (toId) {
            let fromList = []
            let newSongList = []
            let toList = favLists.find(f => f.info.id == toId)
            if (song)
                fromList = { songList: [song] }
            else if (fromId == 'FavList-Search')
                fromList = searchList
            else
                fromList = favLists.find(f => f.info.id == fromId) // Handles both single song add and list add
    
            newSongList = fromList.songList.filter(s => undefined === toList.songList.find(v => v.id == s.id))
            //console.log(fromId, toId)

            const updatedToList = { info: toList.info, songList: newSongList.concat(toList.songList) }
            StorageManager.updateFavList(updatedToList)
        }
    }

    const onDelteFav = (val) => {
        setOpenDeleteDialog(false)
        if (val) {
            const newFavListIDs = favLists.filter(FavId => FavId.info.id != val)
            StorageManager.deletFavList(val, newFavListIDs)
            if (selectedList && selectedList.info.id == val)
                setSelectedList(null)
        }
    }

    const handlePlayListClick = (FavList) => {
        onPlayAllFromFav(FavList.songList)
    }

    const handleAddPlayListClick = (FavList) => {
        onAddFavToList(FavList.songList)
    }

    const exportFav = () => {
        StorageManager.exportStorage()
    }

    const importFav = () => {
        StorageManager.importStorage()
    }

    const shuffleAll = () => {
        let allFavSongList = [];
        for (let i=0, n=favLists.length; i<n; i++ ) {
            allFavSongList = allFavSongList.concat(favLists[i].songList);
        } 
        handleSearch(defaultSearchList({ songList: allFavSongList }));
        onPlayAllFromFav(allFavSongList);
    }

    const importFavButton = () => {
        return (
            <Tooltip title="导入歌单">
                <IconButton size='large' onClick={() => importFav()}>
                    <FileUploadIcon sx={AddFavIcon} />
                </IconButton>
            </Tooltip>
        )
    }

    const exportFavButton = () => {
        return (
            <Tooltip title="导出歌单">
                <IconButton size='large' onClick={() => exportFav()} >
                    <DownloadIcon sx={AddFavIcon} />
                </IconButton>
            </Tooltip>
        )
    }

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
    
        setFavLists(reorder(
            favLists,
            result.source.index,
            result.destination.index
        ));
      }

    return (
        <React.Fragment>
            <Search 
                handleSearch={handleSearch}
                handleSetSearchInputVal={setSearchInputVal}
            />

            <Box // Mid Grid -- SideBar
                style={{ overflow: "hidden", maxHeight: "96%" }}
                sx={{ gridArea: "sidebar" }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1" style={{ color: colorTheme.myPlayListCaptionColor, paddingLeft: '8px', paddingTop: '12px'}}>
                            我的歌单
                        </Typography>
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: 'right', paddingRight: '8px' }}>
                        <Tooltip title="新建歌单">
                            <IconButton size='large' onClick={() => setOpenNewDialog(true)} >
                                <AddIcon sx={AddFavIcon}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="全歌单播放">
                            <IconButton size='large' onClick={() => shuffleAll()}>
                                <ShuffleIcon sx={AddFavIcon} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="播放器设置">
                            <IconButton size='large' onClick={() => setOpenSettingsDialog(true)}>
                                <SettingsIcon sx={AddFavIcon} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <NewFavDialog
                        id="NewFav"
                        keepMounted
                        openState={openNewDialog}
                        onClose={onNewFav}
                    />
                </Grid>
                <Divider light />
                <List
                    style={{ overflow: "auto", maxHeight: "96%" }}
                    className={ScrollBar().root}
                    sx={{ width: '100%' }}
                    component="nav"
                >
                    <React.Fragment key={searchList.id}>
                        <ListItemButton
                            disableRipple
                            sx={outerLayerBtn}
                        >
                            <ListItemButton style={{ maxWidth: 'calc(100% - 84px)' }} onClick={() => setSelectedList(searchList)} id={searchList.info.id} >
                                <ListItemIcon sx={DiskIcon}>
                                    <ManageSearchIcon />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ fontSize: '1.1em' }} primary={searchList.info.title} />
                            </ListItemButton>
                            <Box component="div" sx={CRUDBtn}>
                                <Tooltip title="播放歌单">
                                    <PlaylistPlayIcon sx={CRUDIcon} onClick={() => handlePlayListClick(searchList)} />
                                </Tooltip>
                                <Tooltip title="添加到播放列表">
                                    <PlaylistAddIcon sx={CRUDIcon} onClick={() => handleAddPlayListClick(searchList)} />
                                </Tooltip>
                                <Tooltip title="添加到收藏歌单">
                                    <AddBoxOutlinedIcon sx={CRUDIcon} onClick={() => handleAddToFavClick(searchList.info.id)} />
                                </Tooltip>
                                <Tooltip title="新建为歌单">
                                    <FiberNewIcon 
                                        sx={CRUDIcon} 
                                        onClick={() => {
                                            setSongsStoredAsNewFav(searchList.songList)
                                            setOpenNewDialog(true)
                                        }}/>
                                </Tooltip>
                            </Box>
                        </ListItemButton>
                    </React.Fragment>

                    {favLists && favLists.map((v, i) =>
                        <React.Fragment key={i}>
                            <ListItemButton
                                disableRipple
                                sx={outerLayerBtn}
                            >
                                <ListItemButton style={{ maxWidth: 'calc(100% - 84px)' }} onClick={() => setSelectedList(v)} id={v.info.id} >
                                    <ListItemIcon sx={DiskIcon}>
                                        <AlbumOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primaryTypographyProps={{ fontSize: '1.1em' }} primary={v.info.title} />
                                </ListItemButton>
                                <Box component="div" sx={CRUDBtn}>
                                    <Tooltip title="播放歌单">
                                        <PlaylistPlayIcon sx={CRUDIcon} onClick={() => handlePlayListClick(v)} />
                                    </Tooltip>
                                    <Tooltip title="添加到播放列表">
                                        <PlaylistAddIcon sx={CRUDIcon} onClick={() => handleAddPlayListClick(v)} />
                                    </Tooltip>
                                    <Tooltip title="添加到收藏歌单">
                                        <AddBoxOutlinedIcon sx={CRUDIcon} onClick={() => handleAddToFavClick(v.info.id)} />
                                    </Tooltip>
                                    <Tooltip title="删除歌单">
                                        <DeleteOutlineOutlinedIcon sx={CRUDIcon} onClick={() => handleDeleteFavClick(v.info.id)} />
                                    </Tooltip>
                                </Box>
                            </ListItemButton>
                        </React.Fragment>
                    )}
                </List>
            </Box>
            <Box // Mid Grid -- Fav Detail 
                style={{ maxHeight: "100%", paddingTop: '20px', paddingLeft: '20px', overflow: "auto" }}
                sx={{ gridArea: "Lrc", padding: '0.2em' }}>
                {selectedList &&
                    <Fav FavList={selectedList}
                        onSongListChange={onSongListChange}
                        onSongIndexChange={onPlayOneFromFav}
                        onAddOneFromFav={onAddOneFromFav}
                        handleDeleteFromSearchList={handleDeleteFromSearchList}
                        handleAddToFavClick={handleAddToFavClick}
                        setSubscribeURL={() => setOpenUpdateSubscribeDialog(true)}
                        rssUpdate={() => {
                            updateSubscribeFavList(selectedList)
                        }}
                        Loading={rssLoading}
                        playerSettings={playerSettings}
                    />}
            </Box>
            <AlertDialog
                id="DeleteFav"
                openState={openDeleteDialog}
                onClose={onDelteFav}
                value={actionFavId}
            />
            {favLists &&
                <AddFavDialog
                    id="AddFav"
                    openState={openAddDialog}
                    onClose={onAddFav}
                    fromId={actionFavId}
                    favLists={favLists.map(v => v.info)}
                    song={actionFavSong}
                />}

            {selectedList && <UpdateSubscribeDialog
                id="subscribeURLDialog"
                openState={openUpdateSubscribeDialog}
                onClose={updateSubscribeURL}
                fromList={selectedList}
                rssUpdate={() => {
                    updateSubscribeFavList(selectedList)
                }}
            />}
            
            <SettingsDialog
            id='settingsDialog'
            openState={openSettingsDialog}
            onClose={(settings)=>{
                if (settings) {
                    StorageManager.setPlayerSetting(settings)
                }
                setOpenSettingsDialog(false)
            }}
            settings={StorageManager.getPlayerSetting()}
            importFavButton={importFavButton}
            exportFavButton={exportFavButton}
            />

        </React.Fragment >
    )
})