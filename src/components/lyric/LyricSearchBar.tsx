import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface Props {
  currentAudio: NoxMedia.Song;
  usedLyric: any;
}

export default function LyricSearchBar({ currentAudio, usedLyric }: Props) {
  const { initTrackLrcLoad, lrcOptions, searchAndSetCurrentLyric } = usedLyric;

  useEffect(() => {
    initTrackLrcLoad();
  }, [currentAudio]);

  const onOptionSet = (_: any, newValue?: NoxLyric.NoxFetchedLyric) => {
    if (newValue === undefined) return;
    searchAndSetCurrentLyric({ index: 0, resolvedLrcOptions: [newValue] });
  };

  return (
    <div>
      <Autocomplete
        disableClearable
        onChange={onOptionSet}
        id='LyricSearchBar'
        options={lrcOptions}
        sx={style}
        size='small'
        renderInput={(params) => <TextField {...params} label='歌词选择' />}
        renderOption={(props, option) => (
          <li {...props} key={option?.key}>
            {option?.label}
          </li>
        )}
        isOptionEqualToValue={(option, value2) =>
          option?.songMid === value2?.songMid
        }
      />
    </div>
  );
}

const style = {
  width: '-webkit-fill-available',
};
