import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import { v4 as uuidv4 } from 'uuid';

import { searchBiliURLs } from '@APM/utils/BiliSearch';
import { dummyFavList } from '../utils/ChromeStorage';

export { searchBiliURLs } from '@APM/utils/BiliSearch';

export const defaultSearchList = ({
  songList = [],
  info = { title: '搜索歌单', id: `FavList-Special-Search-${uuidv4()}` },
}) => {
  const newList = dummyFavList('');
  newList.songList = songList;
  newList.info = info;
  return newList;
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
      return (
        <CircularProgress
          sx={{
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
          variant={progressVal === 100 ? 'indeterminate' : 'determinate'}
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
