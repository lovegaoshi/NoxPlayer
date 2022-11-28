import React, { useEffect, useState, useRef, forwardRef } from "react";
import { ScrollBar } from "../styles/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
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
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';
import { StyledTableRow, StyledTableCell, songText, TablePaginationActions } from './Fav';
import { getName } from '../utils/re';
import { skinPreset } from '../styles/skin';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import { getRandomNumberExclude } from '../styles/skins/utils';
import { FixedSizeList as List } from 'react-window';

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
    handleDelteFromSearchList, handleAddToFavClick,
    onPlaylistTitleClick,
    setSubscribeURL, onRssUpdate, Loading,
    currentAudioID, handleTouchStart, handleTouchMove, handleTouchEnd }) {
    const [currentFavList, setCurrentFavList] = useState(null);
    const [rows, setRows] = useState(null);
    const [songIconVisible, setSongIconVisible] = useState(false);
    const [randomGIFSrc, setRandomGIFSrc] = useState(getRandomNumberExclude(skinPreset.gifs.length, -1));
    const FavPanelRef = useRef(null);
    
    const findInFavList = (songList, audioid) => {
        for (let i=0, n=songList.length; i<n; i++) {
            if (songList[i].id === audioid) {
                return i;
            }
        }
        return 0;
    }

    useEffect(() => {
        setCurrentFavList(FavList)
        setRows(FavList.songList)
        // this should be saved to localStorage
        setRandomGIFSrc(getRandomNumberExclude(skinPreset.gifs.length, randomGIFSrc));
    }, [FavList])

    const requestSearch = (e) => {
        const searchedVal = e.target.value
        if (searchedVal == '') {
            setRows(FavList.songList)
            return
        }

        const filteredRows = FavList.songList.filter((row) => {
            // const cleanString = row.name.replace('《') // TODO: some english char can't search
            return row.name.includes(searchedVal)
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
                style={{ ...style, borderBottom: colorTheme.favMobileBorder, listStyle: 'none', overflow: 'hidden' } }
                onClick={() => onSongIndexChange([song], currentFavList)}
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
                        <DeleteOutlineOutlinedIcon sx={CRUDIcon} onClick={() => handleDelteFromSearchList(currentFavList.info.id, index)} />
                    </Tooltip>
                </ListItemButton>)}
                <ListItemButton 
                    variant="text" 
                    sx={songText} 
                    style={{ overflow: 'hidden' }}
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
                <React.Fragment>
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
                                <IconButton 
                                    onClick={() => setRandomGIFSrc(getRandomNumberExclude(skinPreset.gifs.length, randomGIFSrc))} 
                                    sx={{ marginTop: -1, "&:hover": { backgroundColor: 'transparent' } }}
                                >
                                    <img style={{ width: '66px', height: '66px' }}
                                        src={skinPreset.gifs[randomGIFSrc]}></img>
                                </IconButton>
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
                        sx={{ maxHeight: "calc(100% - 160px)", maxWidth: "95%" }} 
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
                                        className="FavList"
                                        height={window.innerHeight - 320}
                                        itemCount={rows.length}
                                        itemSize={50}
                                        width={window.innerWidth}
                                        ref={FavPanelRef}
                                        initialScrollOffset={50 * findInFavList(rows, currentAudioID)}
                                    >
                                        {Row}
                                    </List>)
                            }
                        </div>
                    </TableContainer >
                </React.Fragment>
            }
        </React.Fragment>
    );
})
