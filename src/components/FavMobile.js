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
    setSubscribeURL, rssUpdate, Loading }) {
    const [currentFavList, setCurrentFavList] = useState(null);
    const [rows, setRows] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        setCurrentFavList(FavList)
        setRows(FavList.songList)
        setPage(0)
        setRowsPerPage(25)
        //console.log(FavList)
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
                    <Box sx={{ flexGrow: 1, maxHeight: '144px' }} >
                        <Grid container spacing={2} style={{ paddingTop: '8px', paddingBottom: '8px' }}>
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
                                    src={getRandomHeaderGIF()}></img>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign: 'right', padding: '0px' }}>
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
                            <Grid item xs={4} style={{ textAlign: 'right', padding: '0px' }}>
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
                        sx={{ maxHeight: "80%", maxWidth: "95%" }} 
                        style={{ overflow: "auto", boxShadow: colorTheme.songListShadowStyle }}
                    >
                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            sx={{ width: column.minWidth, paddingLeft: column.paddingLeft, padding: column.padding }}
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
                                    <StyledTableRow
                                        key={index}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <StyledTableCell align="left" sx={{
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
                                        <StyledTableCell align="left" sx={{
                                            paddingLeft: '8px', width: '45%',
                                            whiteSpace: 'nowrap'
                                        }}
                                            style={{ paddingLeft: '10px' }}>
                                            <Button variant="text" sx={songText} onClick={() => onSongIndexChange([song], currentFavList)} >{reExtract(song.name, song.singer)}</Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <ThemeProvider theme={theme}>
                                        <TablePagination
                                            id="pagination-toolbar"
                                            rowsPerPageOptions={[25, 75, 100]}
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
                                            labelDisplayedRows={
                                                ({ from, to, count }) => {
                                                    return `${from}-${to} / ${count !== -1 ? count : `> ${to}`}`;  
                                                }
                                            }
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
