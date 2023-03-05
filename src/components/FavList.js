import React, { useEffect, useState, useCallback, memo, useContext } from "react";
import { searchBiliURLs, Search, defaultSearchList } from '../components/Search';
import { Fav } from './Fav';
import { ScrollBar } from "../styles/styles";
import { AddFavDialog, NewFavDialog } from "./dialogs/AddFavDialog";
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
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import { skinPreset } from '../styles/skin';
import { parseSongName } from '../utils/re';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PlayerSettingsButton from "./buttons/PlayerSetttingsButton";
import { useConfirm } from "material-ui-confirm";
import HelpPanelButton from "./buttons/HelpPanelButton";
import Menu from './menus/Favlistmenu';
import { contextMenu } from "react-contexify";
import { dummyFavList } from "../objects/Storage";

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
    width: '1.1em',
    height: '1.1em',
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

/**
 * this function updates the input playlist by its subscription url to include the missing videos.
 * @param {object} listObj the playlist to be updated.
 * @param {Object} StorageManager storageManager object that is used to update chrome.storage.local.
 * calls its updateFavList method.
 * @param {function} setSelectedList useState setter for FavList that sets its selectedList state.
 * @param {Array} subscribeUrls the subscribe urls to be checked in an array format. if not specified,
 * this is defualted to be listObj.subscribeUrls.
 * this state is passed to Fav to trigger a rerender.
 */
export const updateSubscribeFavList = async (listObj, StorageManager, setSelectedList, subscribeUrls = undefined) => {
    try {
        const oldListLength = listObj.songList.length;
        if (subscribeUrls === undefined) {
            subscribeUrls = listObj.subscribeUrls;
        }
        if (subscribeUrls === undefined) return null;
        for (let i=0, n=subscribeUrls.length; i < n; i++) {
            listObj.songList = (await searchBiliURLs({
                input: subscribeUrls[i], 
                favList: [...listObj.songList.map(val => val.bvid), ...listObj.bannedBVids],
                useBiliTag: listObj.useBiliShazam,
            })).songList.concat(listObj.songList);
        }
        let uniqueSongList = new Map();
        for (const tag of listObj.songList) {
            // cid should be a unique value? its a unique identifier for videos with multiple episodes.
            uniqueSongList.set(tag.id, tag);
        }
        listObj.songList = [...uniqueSongList.values()];
        for (let i=0, n=listObj.songList.length; i < n; i++) {
            parseSongName(listObj.songList[i]);
        }
        // sinse we do NOT delete songs from this operation, any update requiring a fav update really need
        // to have a change in list size. 
        if (oldListLength !== listObj.songList.length) {
            StorageManager.updateFavList(listObj);
            setSelectedList(listObj);
            return listObj.songList;
        }
        return null;
    } catch(err) {
        console.error(err);
        return null;
    }
}

export const FavList = memo(function ({ onSongListChange, onPlayOneFromFav, onPlayAllFromFav, onAddFavToList, onAddOneFromFav, playerSettings }) {
    const [favLists, setFavLists] = useState(null)
    const [selectedList, setSelectedList] = useState(null)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openNewDialog, setOpenNewDialog] = useState(false)
    const [actionFavId, setActionFavId] = useState(null)
    const [actionFavSong, setActionFavSong] = useState(null)
    const [searchList, setSearchList] = useState(defaultSearchList({}))
    const [songsStoredAsNewFav, setSongsStoredAsNewFav] = useState(null)
    const [searchInputVal, setSearchInputVal] = useState('')
    const confirm = useConfirm()
    const StorageManager = useContext(StorageManagerCtx)
    const [favoriteList, dummySetter] = useState(dummyFavList());

    useEffect(() => {
        // Caches setter and latest favList in StoreMng
        StorageManager.setFavLists = setFavLists
        StorageManager.initFavLists()
    }, [])

    const handleSearch = useCallback((list) => {
        setSearchList(list)
        setSelectedList(list)
    }, [searchList, selectedList])

    const handleDeleteFromSearchList = useCallback((listid, songid) => {
        const findList = async (listid) => {
            console.log(listid)
            switch (listid) {
                case favoriteList?.info?.id:
                    return StorageManager.getFavFavList();
                default: 
                    break;
            }
            return listid.includes('FavList-Special-Search') 
            ? searchList 
            : favLists.find(f => f.info.id == listid)
        }
        findList(listid)
        .then( favList => {
            console.log(favList)
            let index = favList.songList.findIndex((song) => song.id === songid)
            console.log(index)
            if (index === -1) return
            favList.songList.splice(index, 1)
            const updatedToList = { ...favList }
            listid.includes('FavList-Special-Search') ? setSearchList(updatedToList) : StorageManager.updateFavList(updatedToList)
        })
        
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
            else if (fromId.includes('FavList-Special-Search'))
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
    }

    const handleAddPlayListClick = (FavList) => {
        onAddFavToList(FavList.songList)
    }

    const loadToSearchList = (songList) => {
        handleSearch(defaultSearchList({ songList }));
        onPlayAllFromFav(songList);
    }

    const shuffleAll = () => {
        let allFavSongList = [];
        favLists.map((val) => allFavSongList = allFavSongList.concat(val.songList));
        loadToSearchList(allFavSongList);
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
                    onContextMenu={(event, row, index) => {
                        event.preventDefault();
                        contextMenu.show({
                        id: "favlistmenu",
                        event: event,
                        props: { favlist: v, updateFavList: (val) => {
                            const newList = {...val};
                            StorageManager.updateFavList(newList);
                            // well, we resorted back to this...
                            setSelectedList(null);
                            setSelectedList(newList);
                        } },
                    });
                    }}
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
                            <DeleteOutlineOutlinedIcon sx={CRUDIcon} onClick={() => handleDeleteFavClick(v.info.title, v.info.id)} />
                        </Tooltip>
                    </Box>
                </ListItemButton>
            </React.Fragment>
        )
    }

    const renderSpecialList = (specialList, handleClick = undefined) => {
        if (specialList === null) return;
        if (handleClick === undefined) handleClick = () => setSelectedList(specialList);

        return (
            <React.Fragment key={specialList.info.id}>
                <ListItemButton
                    disableRipple
                    sx={outerLayerBtn}
                >
                    <ListItemButton style={{ maxWidth: 'calc(100% - 84px)' }} onClick={handleClick} id={specialList.info.id} >
                        <ListItemIcon sx={DiskIcon}>
                            <ManageSearchIcon />
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '1.1em' }} primary={specialList.info.title} />
                    </ListItemButton>
                    <Box component="div" sx={CRUDBtn}>
                        <Tooltip title="播放歌单">
                            <PlaylistPlayIcon sx={CRUDIcon} onClick={() => handlePlayListClick(specialList)} />
                        </Tooltip>
                        <Tooltip title="添加到播放列表">
                            <PlaylistAddIcon sx={CRUDIcon} onClick={() => handleAddPlayListClick(specialList)} />
                        </Tooltip>
                        <Tooltip title="添加到收藏歌单">
                            <AddBoxOutlinedIcon sx={CRUDIcon} onClick={() => handleAddToFavClick(specialList.info.id)} />
                        </Tooltip>
                        <Tooltip title="新建为歌单">
                            <FiberNewIcon 
                                sx={CRUDIcon} 
                                onClick={() => {
                                    setSongsStoredAsNewFav(specialList.songList)
                                    setOpenNewDialog(true)
                                }}/>
                        </Tooltip>
                    </Box>
                </ListItemButton>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <Menu
                theme={colorTheme.generalTheme}
            />
            <Search 
                handleSearch={handleSearch}
                handleSetSearchInputVal={setSearchInputVal}
            />
            <Box // Mid Grid -- SideBar
                style={{ overflow: "hidden", maxHeight: "calc(100vh - 180px)", backgroundColor: colorTheme.FavListBackgroundColor }}
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
                            <IconButton size='large' onClick={shuffleAll}>
                                <ShuffleIcon sx={AddFavIcon} />
                            </IconButton>
                        </Tooltip>
                        <PlayerSettingsButton AddFavIcon={AddFavIcon} />
                        <HelpPanelButton AddFavIcon={AddFavIcon} />
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
                    style={{ overflow: "auto", maxHeight: "calc(100% - 50px)" }}
                    className={ScrollBar().root}
                    sx={{ width: '100%' }}
                    component="nav"
                >
                    {renderSpecialList(searchList)}    
                    {false && renderSpecialList(favoriteList, () => StorageManager.getFavFavList().then(setSelectedList))}                  
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
                        rssUpdate={async (subscribeUrls) => { 
                            return updateSubscribeFavList(selectedList, StorageManager, setSelectedList, subscribeUrls)
                        } }
                        playerSettings={playerSettings}
                    />}
            </Box>
            {favLists &&
                <AddFavDialog
                    id="AddFav"
                    openState={openAddDialog}
                    onClose={onAddFav}
                    fromId={actionFavId}
                    favLists={favLists.map(v => v.info)}
                    song={actionFavSong}
                    MenuProps={{ style: { maxHeight: 200 }, }}
                />}
        </React.Fragment >
    )
})