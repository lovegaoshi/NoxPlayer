import React, { useEffect, useState, useContext, useRef } from "react";
import { ScrollBar } from "../styles/styles";
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { zhCN } from '@mui/material/locale';
import Tooltip from '@mui/material/Tooltip';
import { skinPreset } from '../styles/skin';
import { getName } from '../utils/re';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RandomGIFIcon from './buttons/randomGIF';
import { getPlayerSettingKey, readLocalStorage } from '../objects/Storage';
import { CurrentAudioContext } from "../contexts/CurrentAudioContext";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FavSettingsButtons from './buttons/FavSettingsButton';
import SongSearchBar from './dialogs/songsearchbar';

let colorTheme = skinPreset.colorTheme;

const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
    },
    zhCN,
);


const columns = [
    { id: 'name', label: '歌曲名', minWidth: '20%' },
    { id: 'uploader', label: 'UP主', align: 'center', padding: '0px' },
    {
        id: 'operation',
        label: '操作',
        minWidth: '20%',
        align: 'right',
    }
];

const CRUDIcon = {
    ':hover': {
        cursor: 'pointer'
    },
    width: '1em',
    color: colorTheme.songListIconColor
}

export const songText = {
    fontSize: 16,
    minWidth: 0,
    overflow: 'hidden',
    paddingBottom: '4px',
    paddingTop: '4px',
}

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: colorTheme.FavAlternateBackgroundColor,//theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 16,
        padding: 0
    },
}));

export function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
                style={{ color:colorTheme.playListIconColor }}
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
                style={{ color:colorTheme.playListIconColor }}
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                style={{ color:colorTheme.playListIconColor }}
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
                style={{ color:colorTheme.playListIconColor }}
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export const Fav = (function ({ 
    FavList, onSongIndexChange, onAddOneFromFav, 
    handleDeleteFromSearchList, handleAddToFavClick,
    rssUpdate, playerSettings, }) {
    // currentFavList is stored solely for keeping in check rows
    // still is FavList in props; we can make rows 
    // a dict and store the favlist.info.id with it, so 
    // theres no need for currentFavList at all. 
    const [currentFavList, setCurrentFavList] = useState(null);
    const [rows, setRows] = useState(null);
    const [page, setPage] = useState(0);
    const defaultRowsPerPage = Math.max(1, Math.floor((window.innerHeight - 305) / 40));
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const searchBarRef = useRef({current: {}});
    const [currentAudio, setcurrentAudio] = useContext(CurrentAudioContext);
    
    /**
     * because of delayed state update/management, we need a reliable way to get
     * the current playlist songs (which may be filtered by some search string). 
     * this method returns the accurate current playlist's songs.
     * @returns rows when currentFavList is the same as the Favlist props; or Favlist.songlist
     */
    const getCurrentRow = () => {
        if (currentFavList !== null && rows !== null && currentFavList.info.id === FavList.info.id) {
            return rows;
        }
        return FavList.songList;
    }

    /**
     * this method primes the current page displaying songs to the one containing the song
     * that is currently in play. the current song is found by reading the locally stored 
     * value "currentPlaying". this function is in a useEffect. 
     */
    const primePageToCurrentPlaying = () => {
        try {
            const songList = getCurrentRow();
            readLocalStorage('CurrentPlaying').then((r) => {
                for (let i=0, n=songList.length; i<n; i++) {
                    if (songList[i].id == r.cid) {
                        setPage(Math.floor(i / defaultRowsPerPage));
                        break;
                    }
                }});
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        setCurrentFavList(FavList)
        setRowsPerPage(defaultRowsPerPage)
        requestSearch({target:{value:''}})
        primePageToCurrentPlaying()
        if (searchBarRef.current !== null) {
            setTimeout(() => {
                searchBarRef.current.value = "";
            }, 100);
        }
    }, [FavList.info.id])
    
    const requestSearch = (e) => {
        const searchedVal = e.target.value
        setPage(0)
        handleSearch(searchedVal)
    }

    const handleSearch = (searchedVal) => {
        if (searchedVal == '') {
            setRows(FavList.songList)
            return
        }

        const filteredRows = FavList.songList.filter((row) => {
            return row.name.toLowerCase().includes(searchedVal.toLowerCase())
        })
        setRows(filteredRows)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const className = ScrollBar().root
    // onSongIndexChange([song], {songList: rows})
    
    const rowRenderer = ({ song, index }) => {
        return (
            <StyledTableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                <StyledTableCell align="left" sx={{
                    paddingLeft: '8px', width: '45%',
                    whiteSpace: 'nowrap'
                }}
                >
                    <ListItemButton variant="text" sx={songText} onClick={() => getPlayerSettingKey('keepSearchedSongListWhenPlaying').then((val) => {
                        onSongIndexChange([song], {songList: val? rows : FavList.songList})
                    })}>
                        {song.id === currentAudio.id && <ListItemIcon sx={{ minWidth: '30px' }}><PlayCircleIcon/></ListItemIcon>}
                        <ListItemText primary={getName(song, playerSettings.parseSongName)}></ListItemText>
                    </ListItemButton>
                </StyledTableCell>
                <StyledTableCell align="center" sx={{
                    width: '10%', fontSize: 4,
                    minWidth: 0,
                    color: colorTheme.uploaderCaptionColor,
                    whiteSpace: 'nowrap',
                }}
                style={{ overflow: 'visible' }} >
                    <a href={"https://space.bilibili.com/" + song.singerId} target="_blank" style={{ color: 'inherit', textDecoration: 'none' }} >
                        {song.singer}
                    </a>
                </StyledTableCell>
                <StyledTableCell align="right" sx={{
                    paddingRight: '8px', width: '45%',
                    whiteSpace: 'nowrap'
                }}
                    style={{ paddingLeft: '40px', paddingRight: '8px' }}>
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
                </StyledTableCell>
            </StyledTableRow>
        )
    }

    return (
        <React.Fragment>
            {currentFavList &&
                <React.Fragment>
                    <Box sx={{ flexGrow: 1, maxHeight: '72px' }} style={{ paddingBottom: '8px' }}>
                        <Grid container spacing={2} style={{ paddingTop: '8px' }}>
                            <Grid item xs={5} style={{ textAlign: 'left', padding: '0px', paddingLeft: '12px', paddingTop: '4px' }} overflow="hidden">
                                <Typography variant="h6" style={{ color: colorTheme.playlistCaptionColor, whiteSpace: 'nowrap', fontSize: '2rem' }}>
                                    {currentFavList.info.title}
                                </Typography>

                            </Grid>
                            <Grid item xs={2} style={{ textAlign: 'center', padding: '0px' }}>
                                <RandomGIFIcon 
                                    gifs={skinPreset.gifs}
                                    favList={currentFavList.info.id + page.toString()}
                                    onClickCallback={primePageToCurrentPlaying}
                                />
                            </Grid>
                            <Grid item xs={5} style={{ textAlign: 'right', padding: '0px' }}>
                                <FavSettingsButtons
                                    currentList={currentFavList}
                                    rssUpdate={ async () => {
                                        const val = await rssUpdate();
                                        if (val !== null) setRows(val);
                                        return new Promise((resolve, reject) => {resolve(1)});
                                    }}
                                ></FavSettingsButtons>
                                <SongSearchBar requestSearch={requestSearch} ref={searchBarRef} />
                            </Grid>
                        </Grid>
                    </Box>
                    <TableContainer 
                        className={className}
                        id='FavTable'
                        component={Paper}
                        sx={{ maxHeight: "calc(100% - 65px)" }}
                        style={{ overflow: "auto", boxShadow: colorTheme.songListShadowStyle, backgroundColor: colorTheme.FavBackgroundColor }} 
                    >

                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead >
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            sx={{ width: column.minWidth, paddingLeft: column.paddingLeft, padding: column.padding }}
                                            style={{ 
                                                backgroundColor: colorTheme.FavBackgroundColorSolid === undefined 
                                                    ? colorTheme.FavBackgroundColor 
                                                    : colorTheme.FavBackgroundColorSolid, 
                                                color:colorTheme.songListColumnHeaderColor }}
                                        >
                                            {column.label}{column.id == 'name' ? '(' + currentFavList.songList.length + ')' : ''}
                                        </TableCell>))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                ).map((song, index) =>
                                    rowRenderer( {song, index} )
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <ThemeProvider theme={theme}>
                                        <TablePagination
                                            rowsPerPageOptions={[defaultRowsPerPage, 99, currentFavList.songList.length]}
                                            colSpan={3}
                                            count={rows.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                                inputProps: {
                                                    'aria-label': 'rows per page',
                                                },
                                                native: true,
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                            style={{ color:colorTheme.playListIconColor }}
                                        />
                                    </ThemeProvider>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer >
                </React.Fragment>
            }
        </React.Fragment>
    );
})
