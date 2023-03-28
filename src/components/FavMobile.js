import React, { useEffect, useState, useRef } from "react";
import { ScrollBar } from "../styles/styles";
import Table from "@mui/material/Table";
import TableCell from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { songText } from './Fav';
import { getName } from '../utils/re';
import { skinPreset } from '../styles/skin';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import { FixedSizeList as List } from 'react-window';
import RandomGIFIcon from './buttons/randomGIF';
import FavSettingsButtons from './buttons/FavSettingsButton';
import { getPlayerSettingKey, readLocalStorage } from '../objects/Storage';
import SongSearchBar from './dialogs/songsearchbar';

let colorTheme = skinPreset.colorTheme;

const columns = [
    {
        id: 'operation',
        label: '操作',
        minWidth: '100px',
        align: 'center',
    },
    { id: 'name', label: '歌曲名', minWidth: '275px' },
];

const CRUDIcon = {
    ':hover': {
        cursor: 'pointer'
    },
    width: '1.2em',
    color: colorTheme.songListIconColor
}

const findInFavList = (songList, audioid, key = 'id') => {
    for (const [index, song] of Object.entries(songList)) {
        if (song[key] === audioid) {
            return index;
        }
    }
    console.debug(audioid, 'is not found in the current playlist.');
    return 0;
}

export const Fav = (function ({
    FavList, onSongIndexChange, onAddOneFromFav,
    handleDeleteFromSearchList, handleAddToFavClick,
    onPlaylistTitleClick,
    onRssUpdate, currentAudioID }) {
    const [currentFavList, setCurrentFavList] = useState(null);
    const [rows, setRows] = useState(null);
    const [songIconVisible, setSongIconVisible] = useState(false);
    const FavPanelRef = useRef(null);
    const searchBarRef = useRef({current: {}});
    const favPanelHeight = useRef(window.innerHeight - 320);

    useEffect(() => {
        setCurrentFavList(FavList);
        setRows(FavList.songList);
        // this should be saved to localStorage
        if (FavPanelRef.current) FavPanelRef.current.scrollToItem(0);
        requestSearch({target:{value:''}})
    }, [FavList.info.id])

    const requestSearch = (e) => {
        const searchedVal = e.target.value
        handleSearch(searchedVal)
    }

    const handleSearch = (searchedVal) => {
        if (searchedVal == '') {
            setRows(FavList.songList)
            return
        }

        const filteredRows = FavList.songList.filter((row) => {
            // const cleanString = row.name.replace('《') // TODO: some english char can't search
            return row.name.toLowerCase().includes(searchedVal.toLowerCase())
        })
        setRows(filteredRows)
    }

    //console.log('rener Fav')
    const className = ScrollBar().root

    const playlistTitleParse = (title) => {
        if (title.includes('-')) {
            return title.substring(0, title.indexOf('-'))
        }
        return title
    }

    const rowRenderer = ({ song, index, style }) => {
        return (
            <ListItem 
                key={index}
                className='favItem'
                style={{ ...style, borderBottom: colorTheme.favMobileBorder, listStyle: 'none', overflow: 'hidden', width: '98%' } }
                onClick={songIconVisible? () => {} : () => getPlayerSettingKey('keepSearchedSongListWhenPlaying').then((val) => {
                    onSongIndexChange([song], { songList: val? rows : FavList.songList, info: FavList.info })
                })}
            >
                {songIconVisible && 
                (<ListItemButton style={{ maxWidth: '100px' }}>
                    <Tooltip title="添加到播放列表">
                        <AddOutlinedIcon sx={CRUDIcon} onClick={() => onAddOneFromFav([song])} />
                    </Tooltip>
                    <Tooltip title="添加到收藏歌单">
                        <AddBoxOutlinedIcon sx={CRUDIcon} onClick={() => handleAddToFavClick(currentFavList.info.id, song)} />
                    </Tooltip>
                    <Tooltip title="删除歌曲">
                        <DeleteOutlineOutlinedIcon 
                            sx={CRUDIcon}
                            onClick={
                                () => {
                                    handleDeleteFromSearchList(currentFavList.info.id, song.id);
                                    handleSearch(searchBarRef.current.value);
                                }
                            } />
                    </Tooltip>
                </ListItemButton>)}
                <ListItemButton 
                    variant="text" 
                    sx={songText} 
                    style={{ overflow: 'hidden' }}
                    onClick={songIconVisible? () => onSongIndexChange([song], {songList: rows}) : () => {}}
                >
                    {getName(song, true)}
                </ListItemButton>
            </ListItem>
        )
    }

    const Row = ({ index, style }) => {
        return rowRenderer({ song: rows[index], index, style });
    }

    return (
        <React.Fragment>
            {currentFavList &&
                <div>
                    <Box sx={{ flexGrow: 1, height: '144px' }} >
                        <Grid container spacing={2} style={{ paddingTop: '18px', paddingBottom: '8px' }}>
                            <Grid item xs={8} style={{ textAlign: 'left', padding: '0px', paddingLeft: '16px' }}>
                                <Button onClick={onPlaylistTitleClick}> 
                                    <Typography variant="h6" style={{ color: colorTheme.playlistCaptionColor, whiteSpace: 'nowrap', fontSize: '2rem' }}>
                                        {playlistTitleParse(currentFavList.info.title)}
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign: 'right', padding: '0px', paddingRight: '8px' }}>
                                <RandomGIFIcon gifs={skinPreset.gifs} favList={currentFavList.info.id}></RandomGIFIcon>
                            </Grid>
                            <Grid item xs={5} style={{ textAlign: 'right', padding: '0px' }}>
                                <IconButton size="large" onClick={() => {
                                    setSongIconVisible(!songIconVisible)
                                    }}>
                                    {songIconVisible ? <EditOffIcon /> : <EditIcon />}
                                </IconButton>
                                {!currentFavList.info.id.includes('Search') && 
                                    <FavSettingsButtons
                                        currentList={currentFavList}
                                        rssUpdate={ async (subscribeUrls) => {
                                            const val = await onRssUpdate(subscribeUrls);
                                            if (val !== null) setRows(val);
                                            return new Promise((resolve, reject) => {resolve(1)});
                                        }}
                                    />
                                }
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'right', padding: '0px' }}>
                                <SongSearchBar requestSearch={requestSearch} ref={searchBarRef} />
                            </Grid>
                            
                        </Grid>
                    </Box>
                    <TableContainer 
                        className={className}
                        id='FavTable' 
                        component={Paper} 
                        sx={{ maxHeight: "calc(100% - 180px)", maxWidth: "95%" }} 
                        style={{ 
                            overflowY: "auto", 
                            overflowX: "hidden", 
                            boxShadow: colorTheme.songListShadowStyle, 
                            backgroundColor: colorTheme.FavBackgroundColor, }}
                    >
                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead>
                                <TableRow>
                                    {
                                    (songIconVisible
                                        ? columns 
                                        : columns.slice(1))
                                    .map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            sx={{ width: column.minWidth, paddingLeft: column.paddingLeft, padding: column.padding }}
                                            style={{ backgroundColor: colorTheme.FavBackgroundColor, color:colorTheme.songListColumnHeaderColor }}
                                            
                                        >
                                            {column.label}{column.id == 'name' ? '(' + rows.length + ')' : ''}
                                        </TableCell>))}
                                </TableRow>
                            </TableHead>
                        </Table>
                        <div className="FavPanel-content">
                            {
                                rows
                                && (
                                    <List
                                        className={className}
                                        height={favPanelHeight.current}
                                        itemCount={rows.length}
                                        itemSize={50}
                                        ref={FavPanelRef}
                                        initialScrollOffset={50 * findInFavList(rows, currentAudioID)}
                                        width={window.innerWidth}
                                    >
                                        {Row}
                                    </List>)
                            }
                        </div>
                    </TableContainer >
                </div>
            }
        </React.Fragment>
    );
})
