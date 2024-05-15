import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface Props {
  searchKey: string;
  currentAudio: NoxMedia.Song;
  usedLyric: any;
}

export default function LyricSearchBar({
  searchKey,
  currentAudio,
  usedLyric,
}: Props) {
  const {
    fetchAndSetLyricOptions,
    initTrackLrcLoad,
    lrcOptions,
    lrcOption,
    searchAndSetCurrentLyric,
  } = usedLyric;

  // Initializes options
  useEffect(() => {
    (() => {
      if (searchKey === '') return;
      fetchAndSetLyricOptions(searchKey);
    })();
  }, [searchKey]);

  useEffect(() => {
    initTrackLrcLoad();
  }, [currentAudio]);

  const onOptionSet = (_: any, newValue?: NoxNetwork.NoxFetchedLyric) => {
    if (newValue === undefined) return;
    searchAndSetCurrentLyric(0, [newValue]);
  };

  return (
    <div>
      <Autocomplete
        disableClearable
        onChange={onOptionSet}
        value={lrcOption}
        id='LyricSearchBar'
        options={lrcOptions}
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
