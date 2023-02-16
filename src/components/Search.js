import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { 
    getSongList,
    getFavList,
    getBiliSeriesList,
    getBiliColleList,
    getBiliChannelList,
    getBilSearchList,
    getSongListFromAudio
 } from '../background/DataProcess';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import { extractWith } from '../utils/re';
import { v4 as uuidv4 } from 'uuid';

export const defaultSearchList = ({ songList = [], info = { title: '搜索歌单', id: ('FavList-Search-' + uuidv4())} }) => {
    return {
        songList,
        info,
    }
}

/**
 * searches various types of supported bilibili url (BVid, collection, series, favlist) and 
 * returns the serached result.
 * @param {string}  input  input, can be a biliseries list url, or bvid, or fid
 * @param {function} progressEmitter    a emitter for ciurcularprogress.
 * @param {array} favList a list of old BVIds; any BVid included in this list will be skipped.
 */
export const searchBiliURLs = async ({
    input,
    progressEmitter = (res) => {},
    favList = [],
    useBiliTag = false,
}) => {
    let list = defaultSearchList({})
    try {    
        let reExtracted = /.*space.bilibili\.com\/(\d+)\/channel\/seriesdetail\?sid=(\d+).*/.exec(input)
        if (reExtracted !== null) {
            list.songList = await getBiliSeriesList({ mid: reExtracted[1], sid: reExtracted[2], progressEmitter, favList, useBiliTag })
            return list
        }
        reExtracted = /.*space.bilibili\.com\/(\d+)\/channel\/collectiondetail\?sid=(\d+).*/.exec(input)
        if (reExtracted !== null) {
            list.songList = await getBiliColleList({ mid: reExtracted[1], sid: reExtracted[2], progressEmitter, favList, useBiliTag })
            return list
        }
        //https://www.bilibili.com/video/BV1se4y147qM/
        reExtracted = /.*space.bilibili\.com\/(\d+)\/video.*/.exec(input)
        if (reExtracted !== null) {
            list.songList = await getBiliChannelList({ mid: input, progressEmitter, favList, useBiliTag })
            return list
        }
        reExtracted = /bilibili.com\/audio\/au([^/?]+)/.exec(input)
        if (reExtracted !== null) {
            list.songList = await getSongListFromAudio({ bvid: reExtracted[1], progressEmitter, favList })
            return list
        }
        input = extractWith(input, [
            /(BV[^/?]+)/,
            // favlist url from a channel page: https://space.bilibili.com/429765143/favlist?fid=452404943
            /.*bilibili\.com\/\d+\/favlist\?fid=(\d+)/,
            // https://www.bilibili.com/medialist/detail/ml452404943?type=1
            /.*bilibili\.com\/medialist\/detail\/ml(\d+)/,
        ])
        if (input.startsWith('BV')) {
            list.songList = await getSongList({ bvid: input, useBiliTag })
        } else if (!isNaN(Number(input))) {
            list.songList = await getFavList({ mid: input, progressEmitter, favList, useBiliTag })
        } else {
            list.songList = await getBilSearchList({ mid: input, progressEmitter, useBiliTag })
        }
        
    } catch (err) {
        console.warn(err)
    }
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
        handleSearch(await searchBiliURLs({input, progressEmitter: setProgressVal}))
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
                        placeholder="搜索b站url"
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