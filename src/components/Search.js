import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getSongList, getFavList, getBiliSeriesList, getBiliColleList, getBiliChannelList } from '../background/DataProcess';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

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
        let reExtracted = /.*space.bilibili\.com\/(\d+)\/channel\/seriesdetail\?sid=(\d+).*/.exec(input)
        if (reExtracted !== null) {
            list.songList = await getBiliSeriesList(reExtracted[1], reExtracted[2], progressEmitter, favList)
                .then((songs) => {return songs})
            throw 're matched biliseries; raising a dummy error breaking loop.'
        }
        reExtracted = /.*space.bilibili\.com\/(\d+)\/channel\/collectiondetail\?sid=(\d+).*/.exec(input)
        if (reExtracted !== null) {
            list.songList = await getBiliColleList(reExtracted[1], reExtracted[2], progressEmitter, favList)
                .then((songs) => {return songs})
            throw 're matched bilicollection; raising a dummy error breaking loop.'
        }
        //https://www.bilibili.com/video/BV1se4y147qM/
        reExtracted = /.*space.bilibili\.com\/(\d+)\/video.*/.exec(input)
        if (reExtracted !== null) {
            list.songList = await getBiliChannelList(reExtracted[1], progressEmitter, favList)
                .then((songs) => {return songs})
            throw 're matched bilichannel; raising a dummy error breaking loop.'
        }
        reExtracted = /.*bilibili\.com\/video\/(BV.+)\/.*/.exec(input)
        if (reExtracted !== null) {
            input = reExtracted[1]
        }
        if (input.startsWith('BV')) {
            list.songList = await getSongList(input)
            .then((songs) => {return songs})
            throw 're matched single BVID; raising a dummy error breaking loop.'
        }
        // Handles Fav search
        // https://space.bilibili.com/94558176/favlist?fid=314856176
        reExtracted = /.*bilibili\.com\/\d+\/favlist\?fid=(\d+)/.exec(input)
        if (reExtracted !== null) {
            input = reExtracted[1]
        }
        list.songList = await getFavList(input, progressEmitter, favList)
        .then((songs) => {return songs})
        
    } catch (err) {
        if (!err.startsWith('re matched')) {
            console.warn(err)
        }
    }
    console.debug('searched bv list', list)
    return list
}

export const Search = function ({ handleSearch, handleOpenFav, playListIcon, handleSetSearchInputVal }) {

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
                    <CircularProgress sx={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }} />
                )    
            } else {
                return (
                    <CircularProgress sx={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }} variant="determinate" value={progressVal} />
                )  
            }
        } else {
            return (
                
                <Tooltip title="搜索">
                    <IconButton 
                        size='large'
                        onClick={() => { 
                            searchBili(searchValue);
                            handleSetSearchInputVal(searchValue);
                        }}
                        sx={{ fontSize: "40px" }}
                        >
                        <SearchIcon fontSize='inherit'/>
                    </IconButton>
                </Tooltip>
            )
        }
    }

    const favListButton = () => {
        if (!handleOpenFav) {
            return
        }
        return (
            <IconButton 
                size='large'
                onClick={ () => {handleOpenFav()} }
                sx={{ fontSize: "40px", marginTop: Loading? '-42px' : '0px' }}
            >
                {playListIcon}
            </IconButton>
        )
    }

    //<QueueMusicIcon fontSize='inherit'/>
    return (
        <React.Fragment>
            <Box // Top Grid -- Search  
                sx={{
                    gridArea: "search",
                }}
                style={{ paddingTop: '12px' }}
            >
                <Box // Serch Grid -- SearchBox
                    sx={{ mx: "auto", textAlign: "left", overflow: 'hidden', height: '64px' }}>
                    { favListButton() }
                    <TextField
                        id="outlined-basic"
                        label="BVid/fid"
                        placeholder="BV1w44y1b7MX/1303535681"
                        onKeyDown={keyPress}
                        onChange={onSearchTextChange}
                        value={searchValue}
                        type="search"
                        sx={{ width: `55%` }}
                    />
                    { progressBar() }
                </Box>
            </Box>
        </React.Fragment>
    )
}