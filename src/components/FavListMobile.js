import React, { forwardRef, useEffect, useState, useCallback, memo, useContext } from "react";
import { searchBiliURLs, Search } from '../components/Search';
import { Fav } from './FavMobile';
import { ScrollBar } from "../styles/styles";
import { AlertDialog } from "./ConfirmDialog";
import { AddFavDialog } from "./AddFavDialogMobile";
import { NewFavDialog, UpdateSubscribeDialog, SettingsDialog } from './AddFavDialog';
import Dialog from '@mui/material/Dialog';
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
import Slide from '@mui/material/Slide';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import IconButton from "@mui/material/IconButton";
import {CRUDBtn, outerLayerBtn, DiskIcon} from './FavList';
import SettingsIcon from '@mui/icons-material/Settings';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});


const CRUDIcon = {
    ':hover': {
        cursor: 'pointer'
    },
    width: '30px',
    height: '30px',
    paddingTop: '12px',
    paddingBottom: '12px',
    color: '#ab5fff',
}

const CRUDIconDisable = {
    ':hover': {
        cursor: 'default'
    },
    width: '1.2em',
    height: '1.2em',
    paddingBottom: '2px',
    color: '##adadad'
}

const AddFavIcon = {
    ':hover': {
        cursor: 'pointer'
    },
    width: '40px',
    color: '#ab5fff',
}


export const FavList = memo(function ({ onSongListChange, onPlayOneFromFav, onPlayAllFromFav, onAddFavToList, onAddOneFromFav, showFavList }) {
    const [favLists, setFavLists] = useState(null)
    const [selectedList, setSelectedList] = useState(null)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openUpdateSubscribeDialog, setOpenUpdateSubscribeDialog] = useState(false)
    const [openNewDialog, setOpenNewDialog] = useState(false)
    const [actionFavId, setActionFavId] = useState(null)
    const [actionFavSong, setActionFavSong] = useState(null)
    const [searchList, setSearchList] = useState({ info: { title: '搜索歌单', id: 'Search' }, songList: [] })
    const [rssLoading, setRSSLoading] = useState(false)
    const [openSettingsDialog, setOpenSettingsDialog] = useState(false)
    
    const StorageManager = useContext(StorageManagerCtx)

    const [open, setOpen] = useState(true);
    useEffect(() => {
        setOpen(!open)
    }, [showFavList])

    const handleClose = () => {
        setOpen(false)
    };

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

    const handleDelteFromSearchList = useCallback((id, index) => {
        let favList = id == 'Search' ? searchList : favLists.find(f => f.info.id == id)

        favList.songList.splice(index, 1)
        const updatedToList = { ...favList }

        id == 'Search' ? setSearchList(updatedToList) : StorageManager.updateFavList(updatedToList)
    }, [searchList, selectedList, favLists])

    const onNewFav = (val) => {
        setOpenNewDialog(false)
        if (val) {
            //console.log(val)
            StorageManager.addFavList(val, favLists)
        }
    }
    
    const updateSubscribeURL = (listObj, urls) => {
        setOpenUpdateSubscribeDialog(false)
        if (listObj) {
            listObj.subscribeUrls = urls
            StorageManager.updateFavList(listObj)
        }
    }

    const updateSubscribeFavList = async (listObj) => {
        setRSSLoading(true)
        for (let i=0, n=listObj.subscribeUrls.length; i < n; i++) {
            listObj.songList = (await searchBiliURLs(listObj.subscribeUrls[i], (arg) => {}, listObj.songList)).songList.concat(listObj.songList)
        }
        StorageManager.updateFavList(listObj)
        // otherwise fav wont update
        setSelectedList(null)
        setSelectedList(listObj)
        setRSSLoading(false)
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
        handleClose()
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
        if (!touchEnd) {
            return;
        }
        if (touchStart - touchEnd < -50) {
            // do your stuff here for right swipe
            handleClose();
        }
    }
    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                hideBackdrop
                TransitionComponent={Transition}
            >
            <Grid container spacing={1} align="center" justify = "center" alignItems = "center">
                <Grid item xs={1} style={{ paddingLeft: '18px' }}>
                    <IconButton onClick={handleClose} size='large'>            
                        <ArrowBackIosNewIcon size='large'></ArrowBackIosNewIcon>
                    </IconButton>
                </Grid>
                <Grid item xs={11}>
                    <Search 
                        handleSearch={handleSearch}
                    />
                </Grid>
            </Grid>

            <Box // Mid Grid -- SideBar
                className={ScrollBar().root}
                style={{ overflow: "auto", maxHeight: "96%", minHeight: "20%", paddingTop: "10px", lineHeight: '32px' }}
                sx={{ gridArea: "sidebar" }}
                onTouchStart={touchStartEvent => handleTouchStart(touchStartEvent)}
                onTouchMove={touchMoveEvent => handleTouchMove(touchMoveEvent)}
                onTouchEnd={() => handleTouchEnd()}
            >
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1" style={{ color: '#9600af94', paddingLeft: '18px' }}>
                            我的歌单
                        </Typography>
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: 'right', paddingRight: '5px' }}>
                        <Tooltip title="新建歌单">
                            <AddIcon sx={AddFavIcon} onClick={() => setOpenNewDialog(true)} />
                        </Tooltip>
                        <Tooltip title="导出歌单">
                            <DownloadIcon sx={AddFavIcon} onClick={() => exportFav()} />
                        </Tooltip>
                        <Tooltip title="导入歌单">
                            <FileUploadIcon sx={AddFavIcon} onClick={() => importFav()} />
                        </Tooltip>
                        <Tooltip title="播放器设置">
                            <SettingsIcon sx={AddFavIcon} onClick={() => setOpenSettingsDialog(true)} />
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
                    sx={{ width: '100%'}}
                    component="nav"
                >
                    <React.Fragment key={searchList.id}>
                        <ListItemButton
                            disableRipple
                            sx={outerLayerBtn}
                        >
                            <ListItemButton style={{ maxWidth: 'calc(100% - 136px)' }} onClick={() => setSelectedList(searchList)} id={searchList.info.id} >
                                <ListItemIcon sx={DiskIcon}>
                                    <ManageSearchIcon />
                                </ListItemIcon>
                                <ListItemText style={{ maxWidth: '50%' }} sx={{ color: '#9c55fac9' }} primaryTypographyProps={{ fontSize: '1.1em' }} primary={searchList.info.title} />
                            </ListItemButton>
                            <Box component="div" sx={CRUDBtn} align="right">
                                <Tooltip title="播放歌单">
                                    <PlaylistPlayIcon sx={CRUDIcon} onClick={() => handlePlayListClick(searchList)} />
                                </Tooltip>
                                <Tooltip title="添加到播放列表">
                                    <PlaylistAddIcon sx={CRUDIcon} onClick={() => handleAddPlayListClick(searchList)} />
                                </Tooltip>
                                <Tooltip title="添加到收藏歌单">
                                    <AddBoxOutlinedIcon sx={CRUDIcon} onClick={() => handleAddToFavClick(searchList.info.id)} />
                                </Tooltip>
                                <Tooltip title="删除歌单">
                                    <DeleteOutlineOutlinedIcon sx={CRUDIconDisable} style={{ opacity: '0' }}/>
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
                                <ListItemButton style={{ maxWidth: 'calc(100% - 136px)' }} onClick={() => setSelectedList(v)} id={v.info.id} >
                                    <ListItemIcon sx={DiskIcon}>
                                        <AlbumOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText sx={{ color: '#9600af94' }} primaryTypographyProps={{ fontSize: '1.1em' }} primary={v.info.title} />
                                </ListItemButton>
                                <Box component="div" sx={CRUDBtn}  align="right">
                                    <Tooltip title="播放歌单">
                                        <PlaylistPlayIcon onClick={() => handlePlayListClick(v)} sx={CRUDIcon}/>
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
                style={{ maxHeight: "80%", paddingTop: '20px', paddingLeft: '20px', overflow: "auto" }}
                sx={{ gridArea: "Lrc", padding: '0.2em' }}>
                {selectedList &&
                    <Fav FavList={selectedList}
                        onSongListChange={onSongListChange}
                        onSongIndexChange={onPlayOneFromFav}
                        onAddOneFromFav={onAddOneFromFav}
                        handleDelteFromSearchList={handleDelteFromSearchList}
                        handleAddToFavClick={handleAddToFavClick}
                        playCurrentPlaylist={() => handlePlayListClick(selectedList)}
                        setSubscribeURL={() => setOpenUpdateSubscribeDialog(true)}
                        rssUpdate={() => {
                            updateSubscribeFavList(selectedList)
                        }}
                        Loading={rssLoading}
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

        </Dialog>
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
                StorageManager.setPlayerSetting(settings)
                setOpenSettingsDialog(false)
            }}
            settings={StorageManager.getPlayerSetting()}
            />

        </React.Fragment >
    )
})