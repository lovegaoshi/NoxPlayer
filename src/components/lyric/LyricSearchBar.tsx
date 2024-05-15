import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import useLyric from '@hooks/useLyric';

interface Props {
  searchKey: string;
  currentAudio: NoxMedia.Song;
  setLyric: (v: string) => void;
  setLyricOffset: (v: number) => void;
}

export default function LyricSearchBar({
  searchKey,
  currentAudio,
  setLyric,
}: Props) {
  const {
    fetchAndSetLyricOptions,
    initTrackLrcLoad,
    lrcOptions,
    lrcOption,
    searchAndSetCurrentLyric,
  } = useLyric(currentAudio);

  // Initializes options
  useEffect(() => {
    (() => {
      if (searchKey === '') return;
      fetchAndSetLyricOptions(searchKey);
    })();
  }, [searchKey]);

  useEffect(() => {
    if (lrcOptions.length === 0) {
      return;
    }
    initTrackLrcLoad();
  }, [lrcOptions]);

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
