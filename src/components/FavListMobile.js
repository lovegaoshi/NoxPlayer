import React, { forwardRef, useEffect, useState, useCallback, memo, useContext } from "react";
import { searchBiliURLs, Search } from '../components/Search';
import { Fav } from './FavMobile';
import { ScrollBar } from "../styles/styles";
import { AlertDialog } from "./ConfirmDialog";
import { AddFavDialog, NewFavDialog } from "./dialogs/AddFavDialog";
import { UpdateSubscribeDialog } from "./dialogs/FavSettingsDialog";
import { SettingsDialog } from "./dialogs/PlayerSettingsDialog";
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
import { CRUDBtn, outerLayerBtn, DiskIcon, reorder } from './FavList';
import SettingsIcon from '@mui/icons-material/Settings';
import { skinPreset } from '../styles/skin';
import { parseSongName } from '../utils/re';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { useSwipeable } from "react-swipeable";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

let colorTheme = skinPreset.colorTheme;
let modifiedBackgroundPalette = colorTheme.palette;

try {
    modifiedBackgroundPalette.components.MuiPaper.styleOverrides.root.backgroundColor = colorTheme.PCBackgroundColor;
} catch (e) {
    
}

const theme = createTheme(modifiedBackgroundPalette);

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const TransitionRight = forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});


const CRUDIcon = {
    ':hover': {
        cursor: 'pointer'
    },
    width: '30px',
    height: '30px',
    paddingTop: '12px',
    paddingBottom: '12px',
    color: colorTheme.playListIconColor,
}

const AddFavIcon = {
    ':hover': {
        cursor: 'pointer'
    },
    width: '40px',
    color: colorTheme.playListIconColor,
}


export const FavList = memo(function ({ onSongListChange, onPlayOneFromFav, onPlayAllFromFav, onAddFavToList, onAddOneFromFav, showFavList, currentAudioID }) {
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
    const [favOpen, setFavOpen] = useState(false)
    const [songsStoredAsNewFav, setSongsStoredAsNewFav] = useState(null)
    const [searchInputVal, setSearchInputVal] = useState('')
    const [open, setOpen] = useState(true);
    const StorageManager = useContext(StorageManagerCtx)
    
    useEffect(() => {
        if (!selectedList) {
            setOpen(!open);
        } else {
            setFavOpen(!favOpen);
        }
    }, [showFavList])

    const handleClose = () => {
        if (selectedList) {
            setFavOpen(!favOpen);
        } 
        setOpen(false);
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
        setOpen(false)
        setFavOpen(true)
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

    const searchBarComponent = (playListIcon) => {
        return (
                <Search 
                    handleSearch={handleSearch}
                    handleOpenFav={() => {
                        setOpen(!open)
                    }}
                    playListIcon={playListIcon}
                    handleSetSearchInputVal={setSearchInputVal}
                />
        )
    }

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        let newFavLists = reorder(
            favLists,
            result.source.index,
            result.destination.index
        );
        setFavLists(newFavLists);
        StorageManager.saveMyFavList(newFavLists);
      }

    const renderFavListItem = ({ v, i }) => {
        return (
            <React.Fragment key={i}>
                <ListItemButton
                    disableRipple
                    sx={outerLayerBtn}
                >
                    <ListItemButton 
                        style={{ maxWidth: 'calc(100% - 136px)' }} 
                        onClick={() => {
                            setOpen(false);
                            setFavOpen(true);
                            setSelectedList(v);
                        }} 
                        id={v.info.id} >
                        <ListItemIcon sx={DiskIcon}>
                            <AlbumOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '1.1em' }} primary={v.info.title} />
                    </ListItemButton>
                    <Box component="div" sx={CRUDBtn}  align="right">
                        <Tooltip title="播放歌单">
                            <PlaylistPlayIcon sx={CRUDIcon} onClick={() => handlePlayListClick(v)}/>
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
        )
    }

    const favListComponent = () => {
        return (
            <Box // Mid Grid -- SideBar
                className={ScrollBar().root}
                style={{ overflow: "auto", height: "90%", paddingTop: "10px", lineHeight: '24px' }}
                sx={{ gridArea: "sidebar" }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1" style={{ color: colorTheme.myPlayListCaptionColor, paddingLeft: '18px' }}>
                            我的歌单
                        </Typography>
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: 'right', paddingRight: '5px', paddingLeft: '6px' }}>
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
                    sx={{ width: '100%' }}
                    component="nav"
                >
                    <React.Fragment key={searchList.id}>
                        <ListItemButton
                            disableRipple
                            sx={outerLayerBtn}
                        >
                            <ListItemButton 
                                style={{ maxWidth: 'calc(100% - 136px)' }} 
                                onClick={() => {
                                    setOpen(false)
                                    setFavOpen(true)
                                    setSelectedList(searchList)
                                    }} 
                                id={searchList.info.id} >
                                <ListItemIcon sx={DiskIcon}>
                                    <ManageSearchIcon />
                                </ListItemIcon>
                                <ListItemText style={{ maxWidth: '50%' }} primaryTypographyProps={{ fontSize: '1.1em' }} primary={searchList.info.title} />
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

                    {favLists && <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                {favLists.map((item, index) => (
                                    <Draggable key={`item-${index}`} draggableId={`item-${index}`} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{background: snapshot.isDragging? colorTheme.clickHoldBackground : null, ...provided.draggableProps.style}}
                                        >
                                            {renderFavListItem({ v:item, i: index })}
                                        </div>
                                    )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>}
                </List>
            </Box>
        )
    }

    const favComponent = () => {
        return (
            <Box // Mid Grid -- Fav Detail 
                style={{ height: "calc(100% - 86px)", maxHeight: "calc(100% - 86px)", paddingLeft: '20px', overflow: "auto" }}
                sx={{ gridArea: "Lrc", padding: '0.2em' }}>
                {selectedList &&
                    <Fav FavList={selectedList}
                        onSongListChange={onSongListChange}
                        onSongIndexChange={onPlayOneFromFav}
                        onAddOneFromFav={onAddOneFromFav}
                        handleDeleteFromSearchList={handleDeleteFromSearchList}
                        handleAddToFavClick={handleAddToFavClick}
                        onPlaylistTitleClick={() => handlePlayListClick(selectedList)}
                        setSubscribeURL={() => setOpenUpdateSubscribeDialog(true)}
                        onRssUpdate={() => {
                            updateSubscribeFavList(selectedList)
                        }}
                        Loading={rssLoading}
                        currentAudioID={currentAudioID}
                    />}
            </Box>
        )
    }

    const FavListSwipeHandlers = useSwipeable({
        onSwipedRight: (eventData) => setOpen(false),
      });

    const FavSwipeHandlers = useSwipeable({
        onSwipedRight: (eventData) => {
            setOpen(false);
            setFavOpen(false);
        },
        onSwipedLeft: (eventData) => setOpen(true),
      });

    return (
        <React.Fragment>
            
        <ThemeProvider theme={theme}>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                hideBackdrop
                TransitionComponent={Transition}
            >
                <div id='favListSwipePlane' {...FavListSwipeHandlers} style={{ height: '95%' }}>
                    { searchBarComponent((<ArrowBackIcon fontSize='inherit'/>)) }
                    { favListComponent() }
                </div>
            </Dialog>
                <Dialog
                    fullScreen
                    open={favOpen}
                    onClose={handleClose}
                    hideBackdrop
                    TransitionComponent={Transition}
                >
                    <div id='favSwipePlane' {...FavSwipeHandlers} style={{ height: '100%' }}>
                        { searchBarComponent((<MoreHorizIcon fontSize='inherit'/>)) }
                        { favComponent() }
                    </div>
                </Dialog>
        </ThemeProvider>
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
                isMobile={true}
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
        />

        </React.Fragment >
    )
})