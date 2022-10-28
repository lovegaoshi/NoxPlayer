import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getSongList, getFavList, getBiliSeriesList, getBiliColleList } from '../background/DataProcess';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';



export const searchBiliURLs = async (input, progressEmitter = (res) => {}, favList = []) => {
    /**
     * @param {string}  input  input, can be a biliseries list url, or bvid, or fid
     * @param {function} progressEmitter    a emitter for ciurcularprogress.
     * @param {array} favList a list of old BVIds; any BVid included in this list will not be processed for efficiency.
     */
    let list = {songList: [],
                    info: { title: '搜索歌单', id: ('FavList-Search')}
                }
    
    try {    
        let reExtracted = /.*\.com\/(\d+)\/channel\/seriesdetail\?sid=(\d+).*/.exec(input)
        if (reExtracted !== null) {
            list.songList = await getBiliSeriesList(reExtracted[1], reExtracted[2], progressEmitter, favList)
                .then((songs) => {return songs})
            throw 're matched biliseries; raising a dummy error breaking loop.'
        }
        reExtracted = /.*\.com\/(\d+)\/channel\/collectiondetail\?sid=(\d+).*/.exec(input)
        if (reExtracted !== null) {
            list.songList = await getBiliColleList(reExtracted[1], reExtracted[2], progressEmitter, favList)
                .then((songs) => {return songs})
            throw 're matched bilicollection; raising a dummy error breaking loop.'
        }
        if (input.startsWith('BV')) {
            list.songList = await getSongList(input)
            .then((songs) => {return songs})
        }
        // Handles Fav search
        else {
            list.songList = await getFavList(input, progressEmitter, favList)
            .then((songs) => {return songs})
        }
    } catch (err) {
        console.error(err)
    }
    console.debug('searched bv list', list)
    return list
}

export const Search = function ({ handleSearch }) {

    const [searchValue, setSearchValue] = useState('')
    const [progressVal, setProgressVal] = useState(100)
    const [Loading, setLoading] = useState(false)

    const onSearchTextChange = (e) => {
        setSearchValue(e.target.value)
    }
    // id be lying if i understand any of this async stuff
    const searchBili = async (input) => {
        setLoading(true)
        handleSearch(await searchBiliURLs(input, setProgressVal))
        setLoading(false)
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