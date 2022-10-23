import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getSongList, getFavList, getBiliSeriesList } from '../background/DataProcess';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export const Search = function ({ handleSeach }) {

    const [searchValue, setSearchValue] = useState('')
    const [progressVal, setProgressVal] = useState(100)
    const [Loading, setLoading] = useState(false)

    const onSearchTextChange = (e) => {
        setSearchValue(e.target.value)
    }

    const searchBili = (input) => {
        setLoading(true)
        let reExtracted = /.*\.com\/(\d+)\/channel\/seriesdetail\?sid=(\d+).*/.exec(input)
        if (reExtracted !== null) {
            getBiliSeriesList(reExtracted[1], reExtracted[2], setProgressVal)
                .then((songs) => {
                    const list = {
                        songList: songs,
                        info: { title: `搜索合集- 用户${reExtracted[1]}的合集${reExtracted[2]}`, id: ('FavList-' + 'Search') }
                    }
                    handleSeach(list)
                })
                .catch((error) => {
                    console.log(error)
                    const list = {
                        songList: [],
                        info: { title: `搜索合集出错- 用户${reExtracted[1]}的合集${reExtracted[2]}`, id: ('FavList-' + 'Search') }
                    }
                    handleSeach(list)
                })
                .finally(() => setLoading(false))
            return null
        }
        if (input.startsWith('BV')) {
            getSongList(input)
                .then((songs) => {
                    const list = {
                        songList: songs,
                        info: { title: '搜索歌单-' + input, id: ('FavList-' + 'Search') }
                    }
                    handleSeach(list)
                })
                .catch((error) => {
                    //console.log(error)
                    const list = {
                        songList: [],
                        info: { title: '搜索歌单-' + input, id: ('FavList-' + 'Search') }
                    }
                    handleSeach(list)

                })
                .finally(() => setLoading(false))
        }
        // Handles Fav search
        else {
            getFavList(input)
                .then((songs) => {
                    const list = {
                        songList: songs,
                        info: { title: '搜索歌单-' + input, id: ('FavList-' + 'Search') }
                    }
                    handleSeach(list)
                })
                .catch((error) => {
                    console.log(error)
                    const list = {
                        songList: [],
                        info: { title: '搜索歌单-' + input, id: ('FavList-' + 'Search') }
                    }
                    handleSeach(list)
                })
                .finally(() => setLoading(false))
        }
    }

    const keyPress = (e) => {
        // Enter clicked
        if (e.keyCode == 13) {
            const input = e.target.value
            //console.log('value', input); // Validation of target Val    
            // Handles BV search    
            searchBili(input)

        }
    }

    const progressBar = () => {
        if (Loading) {
            if (progressVal == 100) {
                return (
                    <CircularProgress sx={{ paddingLeft: '16px', paddingRight: '16px', }} />
                )    
            } else {
                return (
                    <CircularProgress sx={{ paddingLeft: '16px', paddingRight: '16px', }} variant="determinate" value={progressVal} />
                )  
            }
        } else {
            return (
                <IconButton size='large' onClick={() => {
                    searchBili(searchValue)
                }}>
                    <SearchIcon fontSize='inherit'/>
                </IconButton>
            )
        }
    }

    return (
        <React.Fragment>
            <Box // Top Grid -- Search  
                sx={{
                    gridArea: "search",
                }}
                style={{ paddingTop: '12px' }}
            >
                <Box // Serch Grid -- SearchBox
                    sx={{ mx: "auto", textAlign: "center" }}>
                    <TextField
                        id="outlined-basic"
                        color="secondary"
                        label="BVid/fid"
                        placeholder="BV1w44y1b7MX/1303535681"
                        onKeyDown={keyPress}
                        onChange={onSearchTextChange}
                        value={searchValue}
                        type="search"
                    />
                    { progressBar() }
                </Box>
            </Box>
        </React.Fragment>
    )
}