import React, { useEffect, useState } from "react";
import { getRandomHeaderGIF } from '../utils/Data'
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
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { zhCN } from '@mui/material/locale';
import Tooltip from '@mui/material/Tooltip';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';
import { StyledTableRow, StyledTableCell, songText, TablePaginationActions } from './Fav';
import { reExtract } from '../utils/re';
import { skinPreset } from '../styles/skin';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';

let colorTheme = skinPreset.colorTheme;

const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
        components: {
            MuiTablePagination: {
                styleOverrides: {
                    spacer: {
                        display: "none"
                    },
                    selectLabel: {
                        display: "none"
                    },
                }
            }
        }
    },
    zhCN,
);


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
    color: colorTheme.playListIconColor
}

export const Fav = (function ({
    FavList, onSongIndexChange, onAddOneFromFav,
    handleDelteFromSearchList, handleAddToFavClick,
    playCurrentPlaylist,
    setSubscribeURL, rssUpdate, Loading,
    currentAudioID, scrollPageFlag }) {
    const [currentFavList, setCurrentFavList] = useState(null);
    const [rows, setRows] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [songIconVisible, setSongIconVisible] = useState(false);
    const [randomGIFSrc, setRandomGIFSrc] = useState(null);
    const [scrollPageFlagSlave, setScrollPageFlagSlave] = useState(scrollPageFlag);
    
    const findInFavList = (songList, audioid) => {
        for (let i=0, n=songList.length; i<n; i++) {
            if (songList[i].id === audioid) {
                return i;
            }
        }
        return -1;
    }

    useEffect(() => {
        setCurrentFavList(FavList)
        setRows(FavList.songList)
        // this should be saved to localStorage
        let rowsPerPage = 8
        setPage(Math.max(0, Math.floor(findInFavList(FavList.songList, currentAudioID) / rowsPerPage)))
        setRowsPerPage(rowsPerPage)
        //console.log(FavList)
    }, [FavList])

    useEffect(() => {
        let n = scrollPageFlag - scrollPageFlagSlave;
        if (n > 0) {
            setPage(Math.min(Math.ceil(rows.length / rowsPerPage) - 1, page + 1));
        } else if (n < 0) {
            setPage(Math.max(0, page - 1));
        }
        setScrollPageFlagSlave(scrollPageFlag);
    }, [scrollPageFlag])

    useEffect(() => {
        setRandomGIFSrc(getRandomHeaderGIF());
    }, [FavList, page])

    const requestSearch = (e) => {
        const searchedVal = e.target.value
        setPage(0)
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

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //console.log('rener Fav')
    const className = ScrollBar().root

    const playlistTitleParse = (title) => {
        if (title.includes('-')) {
            return title.substring(0, title.indexOf('-'))
        }
        return title
    }

    return (
        <React.Fragment>
            {currentFavList &&
                <React.Fragment>
                    <Box sx={{ flexGrow: 1, height: '144px' }} >
                        <Grid container spacing={2} style={{ paddingTop: '18px', paddingBottom: '8px' }}>
                            <Grid item xs={4} style={{ textAlign: 'left', padding: '0px', paddingLeft: '16px' }}>
                                <Button onClick={playCurrentPlaylist}> 
                                    <Typography variant="h6" style={{ color: colorTheme.playlistCaptionColor, whiteSpace: 'nowrap', fontSize: '2rem' }}>
                                        {playlistTitleParse(currentFavList.info.title)}
                                    </Typography>
                                </Button>

                            </Grid>
                            <Grid item xs={4} style={{ textAlign: 'right', padding: '0px' }}>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign: 'right', padding: '0px', paddingRight: '8px' }}>
                                <img style={{ width: '66px', height: '66px', zIndex: "5" }}
                                    src={randomGIFSrc}></img>
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
                                            rssUpdate()
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
                        sx={{ maxHeight: "calc(100% - 220px)", maxWidth: "95%" }} 
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
                            <TableBody>
                                { (rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                ).map((song, index) =>
                                    <StyledTableRow
                                        key={index}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        { songIconVisible
                                        ? <StyledTableCell align="left" sx={{
                                            paddingRight: '8px', width: '20px',
                                            whiteSpace: 'nowrap'
                                        }}
                                            style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                                            <Tooltip title="添加到播放列表">
                                                <AddOutlinedIcon sx={CRUDIcon} onClick={() => onAddOneFromFav([song])} />
                                            </Tooltip>
                                            <Tooltip title="添加到收藏歌单">
                                                <AddBoxOutlinedIcon sx={CRUDIcon} onClick={() => handleAddToFavClick(currentFavList.info.id, song)} />
                                            </Tooltip>
                                            <Tooltip title="删除歌曲">
                                                <DeleteOutlineOutlinedIcon sx={CRUDIcon} onClick={() => handleDelteFromSearchList(currentFavList.info.id, index)} />
                                            </Tooltip>
                                        </StyledTableCell>
                                        : <></> }
                                        <StyledTableCell align="left" sx={{
                                            paddingLeft: '8px', width: '45%',
                                            whiteSpace: 'nowrap'
                                        }}
                                        >
                                            <ListItemButton 
                                                variant="text" 
                                                sx={songText} 
                                                onClick={() => onSongIndexChange([song], currentFavList)}
                                            >{reExtract(song.name, song.singer)}</ListItemButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <ThemeProvider theme={theme}>
                                        <TablePagination
                                            id="pagination-toolbar"
                                            rowsPerPageOptions={[8, 25, 99]}
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
                                            labelDisplayedRows={
                                                ({ from, to, count }) => {
                                                    return `${from}-${to} / ${count !== -1 ? count : `> ${to}`}`;  
                                                }
                                            }
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
