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
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openNewDialog, setOpenNewDialog] = useState(false)
    const [actionFavId, setActionFavId] = useState(null)
    const [actionFavSong, setActionFavSong] = useState(null)
    const [searchList, setSearchList] = useState({ info: { title: '搜索歌单', id: 'Search' }, songList: [] })
    const [songsStoredAsNewFav, setSongsStoredAsNewFav] = useState(null)
    const [searchInputVal, setSearchInputVal] = useState('')
    const confirm = useConfirm()
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

    const updateSubscribeFavList = async (listObj) => {
        try{
            let oldListLength = listObj.songList.length
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
            // sinse we do NOT delete songs from this operation, any update requiring a fav update really need
            // to have a change in list size. 
            if (oldListLength !== listObj.songList.length) {
                StorageManager.updateFavList(listObj)
                // otherwise fav wont update
                setSelectedList(listObj)
            }
        } catch(err) {
            console.error(err)
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
    }

    const handleAddPlayListClick = (FavList) => {
        onAddFavToList(FavList.songList)
    }

    const shuffleAll = () => {
        let allFavSongList = [];
        for (let i=0, n=favLists.length; i<n; i++ ) {
            allFavSongList = allFavSongList.concat(favLists[i].songList);
        } 
        handleSearch(defaultSearchList({ songList: allFavSongList }));
        onPlayAllFromFav(allFavSongList);
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

    return (
        <React.Fragment>
            <Search 
                handleSearch={handleSearch}
                handleSetSearchInputVal={setSearchInputVal}
            />

            <Box // Mid Grid -- SideBar
                style={{ overflow: "hidden", maxHeight: "96%", backgroundColor: colorTheme.FavListBackgroundColor }}
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
                        rssUpdate={async () => {
                            return await updateSubscribeFavList(selectedList)
                        }}
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
                />}
        </React.Fragment >
    )
})