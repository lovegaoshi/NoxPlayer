import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useNoxSetting } from '@APM/stores/useApp';
import { searchLyricOptions, searchLyric } from '../../utils/Data';

export default function LyricSearchBar({
  SearchKey,
  SongId,
  setLyric,
  setLyricOffset,
}) {
  const setLyricMapping = useNoxSetting((state) => state.setLyricMapping);
  const lyricMapping = useNoxSetting((state) => state.lyricMapping);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState('');

  // Initializes options
  useEffect(() => {
    searchLyricOptions(SearchKey, setOptions);
  }, [SearchKey]);

  useEffect(() => {
    if (options.length === 0) {
      return;
    }
    function initLyric() {
      const detail = lyricMapping.get(String(SongId));
      if (undefined !== detail) {
        setLyricOffset(detail.lrcOffset);
        const index = options.findIndex(
          (v) => v.songMid === detail.lrc.songMid,
        );
        if (index !== -1) {
          onOptionSet({}, options[index]);
          return;
        }

        options.unshift(detail.lrc);
        setOptions(options);
      }
      onOptionSet({}, options[0]);
    }
    initLyric();
  }, [options]);

  const onOptionSet = (e, newValue) => {
    if (newValue !== undefined) {
      setValue(newValue);
      searchLyric(newValue.songMid, setLyric);
      setLyricMapping(SongId.toString(), newValue);
    }
  };

  // //console.log("SearchBarValue:", options)

  return (
    <div>
      <Autocomplete
        disableClearable
        onChange={onOptionSet}
        value={value}
        id='LyricSearchBar'
        options={options}
        sx={{ width: 500 }}
        size='small'
        renderInput={(params) => <TextField {...params} label='歌词选择' />}
        isOptionEqualToValue={(option, value2) =>
          option.songMid === value2.songMid
        }
      />
    </div>
  );
}
