import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import { v4 as uuidv4 } from 'uuid';
import { extractWith } from '../utils/re';
import {
  getSongList,
  getFavList,
  getBiliSeriesList,
  getBiliColleList,
  getBiliChannelList,
  getBilSearchList,
  getSongListFromAudio,
  getYoutubeVideo,
} from '../background/DataProcess';
import { dummyFavList } from '../utils/ChromeStorage';

export const defaultSearchList = ({ songList = [], info = { title: '搜索歌单', id: (`FavList-Special-Search-${uuidv4()}`) } }) => {
  const newList = dummyFavList('');
  newList.songList = songList;
  newList.info = info;
  return newList;
};

const extractBiliSeries = ({
  reExtracted, progressEmitter, favList, useBiliTag,
}) => getBiliSeriesList({
  mid: reExtracted[1], sid: reExtracted[2], progressEmitter, favList, useBiliTag,
});

const extractBiliColle = ({
  reExtracted, progressEmitter, favList, useBiliTag,
}) => getBiliColleList({
  mid: reExtracted[1], sid: reExtracted[2], progressEmitter, favList, useBiliTag,
});

const extractBiliChannel = ({
  reExtracted, progressEmitter, favList, useBiliTag,
}) => getBiliChannelList({
  url: reExtracted.input, progressEmitter, favList, useBiliTag,
});

const extractBiliAudio = ({
  reExtracted, progressEmitter, favList,
}) => getSongListFromAudio({ bvid: reExtracted[1], progressEmitter, favList });

const extractBiliVideo = ({
  reExtracted, useBiliTag,
}) => getSongList({ bvid: reExtracted[1], useBiliTag });

const extractBiliFavList = ({
  reExtracted, progressEmitter, favList, useBiliTag,
}) => getFavList({
  mid: reExtracted[1], progressEmitter, favList, useBiliTag,
});

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
    [/space.bilibili\.com\/(\d+)\/channel\/seriesdetail\?sid=(\d+)/, extractBiliSeries],
    [/space.bilibili\.com\/(\d+)\/channel\/collectiondetail\?sid=(\d+)/, extractBiliColle],
    [/space.bilibili\.com\/(\d+)\/video/, extractBiliChannel],
    [/bilibili.com\/audio\/au([^/?]+)/, extractBiliAudio],
    [/(BV[^/?]+)/, extractBiliVideo],
    [/.*bilibili\.com\/\d+\/favlist\?fid=(\d+)/, extractBiliFavList],
    [/.*bilibili\.com\/medialist\/detail\/ml(\d+)/, extractBiliFavList],
    [/youtu(?:.*\/v\/|.*v=|\.be\/)([A-Za-z0-9_-]{11})/, ({ reExtracted }) => getYoutubeVideo({ bvid: reExtracted[1] })],
  ];
  for (const reExtraction of reExtractions) {
    const reExtracted = reExtraction[0].exec(url);
    if (reExtracted !== null) {
      return await reExtraction[1]({
        reExtracted, progressEmitter, favList, useBiliTag,
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
    list.songList = await reExtractSearch(input, progressEmitter, favList, useBiliTag);
  } catch (err) {
    console.warn(err);
  }
  return list;
};

export const Search = function ({
  handleSearch, handleOpenFav, playListIcon, handleSetSearchInputVal,
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
    handleSearch(await searchBiliURLs({ input, progressEmitter: setProgressVal }));
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
          <CircularProgress sx={{
            paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px',
          }}
          />
        );
      }
      return (
        <CircularProgress
          sx={{
            paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px',
          }}
          variant="determinate"
          value={progressVal}
        />
      );
    }
    return (

      <Tooltip title="搜索">
        <IconButton
          size="large"
          onClick={() => {
            searchBili(searchValue);
            handleSetSearchInputVal(searchValue);
          }}
          sx={{ fontSize: '40px' }}
        >
          <SearchIcon fontSize="inherit" />
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
        size="large"
        onClick={() => { handleOpenFav(); }}
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
          mx: 'auto', textAlign: 'left', overflow: 'hidden', height: '64px', paddingTop: '12px',
        }}
      >
        { favListButton() }
        <TextField
          id="outlined-basic"
          label="搜索b站url"
          onKeyDown={keyPress}
          onChange={onSearchTextChange}
          value={searchValue}
          type="search"
          sx={{ width: '55%' }}
        />
        { progressBar() }
      </Box>
    </Box>
  );
};
