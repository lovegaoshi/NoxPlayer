import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import { v4 as uuidv4 } from 'uuid';

import {
  getBilSearchList,
  getSongListFromAudio,
  getYoutubeVideo,
} from '../background/DataProcess';
import { dummyFavList } from '../utils/ChromeStorage';
import steriatkFetch from '../utils/mediafetch/steriatk';
import bilivideoFetch from '../utils/mediafetch/bilivideo';
import biliseriesFetch from '../utils/mediafetch/biliseries';
import bilicolleFetch from '../utils/mediafetch/bilicolle';
import bilifavlistFetch from '../utils/mediafetch/bilifavlist';
import bilichannelFetch from '../utils/mediafetch/bilichannel';

export const defaultSearchList = ({
  songList = [],
  info = { title: '搜索歌单', id: `FavList-Special-Search-${uuidv4()}` },
}) => {
  const newList = dummyFavList('');
  newList.songList = songList;
  newList.info = info;
  return newList;
};

const extractBiliAudio = ({ reExtracted, progressEmitter, favList }) =>
  getSongListFromAudio({ bvid: reExtracted[1], progressEmitter, favList });

/**
 * assign the proper extractor based on the provided url. uses regex.
 * @param {string} url
 * @param {function} progressEmitter
 * @param {array} favList
 * @param {boolean} useBiliTag
 * @returns
 */
const reExtractSearch = async (url, progressEmitter, favList, useBiliTag) => {
  const reExtractions = [
    [biliseriesFetch.regexSearchMatch, biliseriesFetch.regexFetch],
    [bilicolleFetch.regexSearchMatch, bilicolleFetch.regexFetch],
    [bilichannelFetch.regexSearchMatch, bilichannelFetch.regexFetch],
    [/bilibili.com\/audio\/au([^/?]+)/, extractBiliAudio],
    [bilifavlistFetch.regexSearchMatch, bilifavlistFetch.regexFetch],
    [bilifavlistFetch.regexSearchMatch2, bilifavlistFetch.regexFetch],
    [
      /youtu(?:.*\/v\/|.*v=|\.be\/)([A-Za-z0-9_-]{11})/,
      ({ reExtracted }) => getYoutubeVideo({ bvid: reExtracted[1] }),
    ],
    [steriatkFetch.regexSearchMatch, steriatkFetch.regexFetch],
    [bilivideoFetch.regexSearchMatch, bilivideoFetch.regexFetch],
  ];
  for (const reExtraction of reExtractions) {
    const reExtracted = reExtraction[0].exec(url);
    if (reExtracted !== null) {
      return await reExtraction[1]({
        reExtracted,
        progressEmitter,
        favList,
        useBiliTag,
      });
    }
  }
  return await getBilSearchList({ mid: url, progressEmitter });
};

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
  const list = defaultSearchList({});
  try {
    list.songList = await reExtractSearch(
      input,
      progressEmitter,
      favList,
      useBiliTag,
    );
  } catch (err) {
    console.warn(err);
  }
  return list;
};

export const Search = function ({
  handleSearch,
  handleOpenFav,
  playListIcon,
  handleSetSearchInputVal,
}) {
  const [searchValue, setSearchValue] = useState('');
  const [progressVal, setProgressVal] = useState(100);
  const [Loading, setLoading] = useState(false);

  const onSearchTextChange = (e) => {
    setSearchValue(e.target.value);
  };
  // id be lying if i understand any of this async stuff
  const searchBili = async (input) => {
    setLoading(true);
    handleSearch(
      await searchBiliURLs({ input, progressEmitter: setProgressVal }),
    );
    setLoading(false);
  };

  const keyPress = (e) => {
    // Enter clicked
    if (e.keyCode === 13) {
      const input = e.target.value;
      // console.log('value', input); // Validation of target Val
      // Handles BV search
      searchBili(input);
    }
  };

  const progressBar = () => {
    if (Loading) {
      if (progressVal === 100) {
        return (
          <CircularProgress
            sx={{
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '8px',
              paddingBottom: '8px',
            }}
          />
        );
      }
      return (
        <CircularProgress
          sx={{
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
          variant='determinate'
          value={progressVal}
        />
      );
    }
    return (
      <Tooltip title='搜索'>
        <IconButton
          size='large'
          onClick={() => {
            searchBili(searchValue);
            handleSetSearchInputVal(searchValue);
          }}
          sx={{ fontSize: '40px' }}
        >
          <SearchIcon fontSize='inherit' />
        </IconButton>
      </Tooltip>
    );
  };

  const favListButton = () => {
    if (!handleOpenFav) {
      return;
    }
    return (
      <IconButton
        size='large'
        onClick={() => {
          handleOpenFav();
        }}
        sx={{ fontSize: '40px', marginTop: Loading ? '-42px' : '0px' }}
      >
        {playListIcon}
      </IconButton>
    );
  };

  // <QueueMusicIcon fontSize='inherit'/>
  return (
    <Box // Top Grid -- Search
      sx={{
        gridArea: 'search',
      }}
    >
      <Box // Serch Grid -- SearchBox
        sx={{
          mx: 'auto',
          textAlign: 'left',
          overflow: 'hidden',
          height: '64px',
          paddingTop: '12px',
        }}
      >
        {favListButton()}
        <TextField
          id='outlined-basic'
          label='搜索b站url'
          onKeyDown={keyPress}
          onChange={onSearchTextChange}
          value={searchValue}
          type='search'
          sx={{ width: '55%' }}
        />
        {progressBar()}
      </Box>
    </Box>
  );
};
