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
import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';
import { songText } from './Fav';
import { getName } from '../utils/re';
import { skinPreset } from '../styles/skin';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import { FixedSizeList as List } from 'react-window';
import RandomGIFIcon from './randomGIF';

let colorTheme = skinPreset.colorTheme;

const columns = [
    {
        id: 'operation',
        label: '操作',
        minWidth: '10%',
        align: 'center',
    },
    { id: 'name', label: '歌曲名', minWidth: '20%' },
];

const CRUDIcon = {
    ':hover': {
        cursor: 'pointer'
    },
    width: '1.2em',
    color: colorTheme.songListIconColor
}

export const Fav = (function ({
    FavList, onSongIndexChange, onAddOneFromFav,
    handleDeleteFromSearchList, handleAddToFavClick,
    onPlaylistTitleClick,
    setSubscribeURL, onRssUpdate, Loading,
    currentAudioID }) {
    const [currentFavList, setCurrentFavList] = useState(null);
    const [rows, setRows] = useState(null);
    const [songIconVisible, setSongIconVisible] = useState(false);
    const FavPanelRef = useRef(null);
    const [searchBarVal, setSearchBarVal] = useState('');
    const favPanelHeight = useRef(window.innerHeight - 320);
    
    const findInFavList = (songList, audioid) => {
        for (let i=0, n=songList.length; i<n; i++) {
            if (songList[i].id === audioid) {
                return i;
            }
        }
        console.debug(audioid, 'is not found in the current playlist.');
        return 0;
    }

    useEffect(() => {
        setCurrentFavList(FavList);
        setRows(FavList.songList);
        // this should be saved to localStorage
        if (FavPanelRef.current) FavPanelRef.current.scrollToItem(0);
        requestSearch({target:{value:''}})
    }, [FavList])

    const requestSearch = (e) => {
        const searchedVal = e.target.value
        setSearchBarVal(searchedVal)
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
                onClick={songIconVisible? () => {} : () => onSongIndexChange([song], currentFavList)}
            >
                {songIconVisible && 
                (<ListItemButton>
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
                                    handleSearch(searchBarVal);
                                }
                            } />
                    </Tooltip>
                </ListItemButton>)}
                <ListItemButton 
                    variant="text" 
                    sx={songText} 
                    style={{ overflow: 'hidden' }}
                    onClick={songIconVisible? () => onSongIndexChange([song], currentFavList) : () => {}}
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
                                <IconButton size="large" onClick={() => setSubscribeURL()}>
                                    <RssFeedIcon />
                                    </IconButton>
                                    <IconButton 
                                        size="large" 
                                        onClick={() => {
                                            onRssUpdate()
                                        }}
                                    >
                                        {Loading ? <CircularProgress size={24} /> : <AutorenewIcon />}
                                    </IconButton>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'right', padding: '0px' }}>
                                <TextField
                                    id="outlined-basic"
                                    color="secondary"
                                    size="small"
                                    label="搜索歌曲"
                                    onChange={requestSearch}
                                    align="center"
                                    autoComplete='off'
                                />
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
                            backgroundColor: colorTheme.FavlistBackgroundColor, }}
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
                                            style={{ backgroundColor: colorTheme.FavlistBackgroundColor, color:colorTheme.songListColumnHeaderColor }}
                                            
                                        >
                                            {column.label}{column.id == 'name' ? '(' + currentFavList.songList.length + ')' : ''}
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
