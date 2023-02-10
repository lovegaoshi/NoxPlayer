import React, { forwardRef, useEffect, useState, useCallback, memo, useContext } from "react";
import { searchBiliURLs, Search } from '../components/Search';
import { Fav } from './FavMobile';
import { ScrollBar } from "../styles/styles";
import { AddFavDialog, NewFavDialog } from "./dialogs/AddFavDialog";
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
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Box from "@mui/material/Box";
import Slide from '@mui/material/Slide';
import { CRUDBtn, outerLayerBtn, DiskIcon, reorder, updateSubscribeFavList } from './FavList';
import { skinPreset } from '../styles/skin';
import { parseSongName } from '../utils/re';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { useSwipeable } from "react-swipeable";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PlayerSettingsButton from "./buttons/PlayerSetttingsButton";
import IconButton from '@mui/material/IconButton';
import { useConfirm } from "material-ui-confirm";

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
    width: '24px',
    color: colorTheme.playListIconColor,
}


export const FavList = memo(function ({ 
    onSongListChange, 
    onPlayOneFromFav, 
    onPlayAllFromFav, 
    onAddFavToList, 
    onAddOneFromFav, 
    showFavList, 
    currentAudioID }) {
    const [favLists, setFavLists] = useState(null)
    const [selectedList, setSelectedList] = useState(null)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openNewDialog, setOpenNewDialog] = useState(false)
    const [actionFavId, setActionFavId] = useState(null)
    const [actionFavSong, setActionFavSong] = useState(null)
    const [searchList, setSearchList] = useState({ info: { title: '搜索歌单', id: 'Search' }, songList: [] })
    const [favOpen, setFavOpen] = useState(false)
    const [songsStoredAsNewFav, setSongsStoredAsNewFav] = useState(null)
    const [searchInputVal, setSearchInputVal] = useState('')
    const [open, setOpen] = useState(false);
    const StorageManager = useContext(StorageManagerCtx)
    const confirm = useConfirm()

    useEffect(() => {
        if (!selectedList) {
            setOpen(!open);
        } else {
            setFavOpen(!favOpen);
        }
    }, [showFavList])

    // this is here because i have overcomplicated the dialog open logic by implementing 
    // it as a state in player.js, but also a state here;
    // then for some reason when state is initialized as true but turned off because of the above logic (triggered when 
    // a swipe action is executed (?), the music player part wont render; i have to do below
    // similar problem happened to lyricOverlay; I took out lyricOverlay's open state inside the component, but is having 
    // trouble with this one. alas, this patch seems to work... 
    useEffect(() => {
        setOpen(false)
    }, [])
    
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

    const handleDeleteFavClick = (playlistName, id) => {
        confirm({ 
            title: '删除歌单？', 
            description: `确认要删除歌单${playlistName}吗？`,
            confirmationText: '好的',
            cancellationText: '算了',
         })
        .then( () => {
            const newFavListIDs = favLists.filter(FavId => FavId.info.id != id)
            StorageManager.deletFavList(id, newFavListIDs)
            if (selectedList && selectedList.info.id == id)
                setSelectedList(null)
        })
        .catch( () => {
            console.debug('canceled playlist delete.')
        });
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

    const handlePlayListClick = (FavList) => {
        onPlayAllFromFav(FavList.songList)
        handleClose()
    }

    const handleAddPlayListClick = (FavList) => {
        onAddFavToList(FavList.songList)
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
                            <DeleteOutlineOutlinedIcon sx={CRUDIcon} onClick={() => handleDeleteFavClick(v.info.title, v.info.id)} />
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
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: 'right', paddingRight: '5px', paddingLeft: '6px' }}>
                        <Tooltip title="新建歌单">
                            <IconButton size='large' onClick={() => setOpenNewDialog(true)} >
                                <AddIcon sx={AddFavIcon}/>
                            </IconButton>
                        </Tooltip>
                        <PlayerSettingsButton AddFavIcon={AddFavIcon}></PlayerSettingsButton>
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
                        onRssUpdate={async () => updateSubscribeFavList(selectedList, StorageManager, setSelectedList)}
                        currentAudioID={currentAudioID}
                    />}
            </Box>
        )
    }

    const FavListSwipeHandlers = useSwipeable({
        onSwipedRight: (eventData) => setOpen(false),
        swipeDuration: 250 // only swipes under 250ms will trigger callbacks
      });

    const FavSwipeHandlers = useSwipeable({
        onSwipedRight: (eventData) => {
            setOpen(false);
            setFavOpen(false);
        },
        onSwipedLeft: (eventData) => setOpen(true),
        swipeDuration: 250 // only swipes under 250ms will trigger callbacks
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
        </React.Fragment >
    )
})