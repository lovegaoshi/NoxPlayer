/* eslint-disable react/require-default-props */
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

import { searchBiliURLs } from '@APM/utils/BiliSearch';
import { useNoxSetting } from '@APM/stores/useApp';
import { StorageKeys } from '@enums/Storage';

interface Props {
  setSearchInputVal: (input: string) => void;
}
export default function Search({ setSearchInputVal }: Props) {
  const [searchValue, setSearchValue] = useState('');
  const [progressVal, setProgressVal] = useState(100);
  const [loading, setLoading] = useState(false);
  const searchPlaylist = useNoxSetting((state) => state.searchPlaylist);
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const setSelectedList = useNoxSetting((state) => state.setCurrentPlaylist);
  const setSearchList = useNoxSetting((state) => state.setSearchPlaylist);
  const toggleRefresh = useNoxSetting(
    (state) => state.togglePlaylistShouldReRender,
  );

  // TODO: type
  const onSearchTextChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const searchBili = async (input: string) => {
    setLoading(true);
    setProgressVal(100);
    const searchedList = {
      ...searchPlaylist,
      id: StorageKeys.SEARCH_PLAYLIST_KEY,
      ...(await searchBiliURLs({
        input,
        progressEmitter: setProgressVal,
        fastSearch: playerSetting.fastBiliSearch,
        cookiedSearch: playerSetting.noCookieBiliSearch,
      })),
    };
    setSearchList(searchedList);
    setSelectedList(searchedList);
    setLoading(false);
    toggleRefresh();
  };

  const keyPress = (e: any) => {
    // Enter clicked
    if (e.keyCode === 13) {
      const input = e.target.value;
      // console.log('value', input); // Validation of target Val
      // Handles BV search
      searchBili(input);
    }
  };

  const progressBar = () => {
    if (loading) {
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
            setSearchInputVal(searchValue);
          }}
          sx={{ fontSize: '40px' }}
        >
          <SearchIcon fontSize='inherit' />
        </IconButton>
      </Tooltip>
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
}
