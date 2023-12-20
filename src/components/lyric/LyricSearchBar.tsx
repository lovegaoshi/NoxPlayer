import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useNoxSetting } from '@APM/stores/useApp';
import { searchLyricOptions, searchLyric } from '@APM/utils/LyricFetch';

interface Props {
  SearchKey: string;
  songId: string;
  setLyric: (v: any) => void;
  setLyricOffset: (v: number) => void;
}
export default function LyricSearchBar({
  SearchKey,
  songId,
  setLyric,
  setLyricOffset,
}: Props) {
  const setLyricMapping = useNoxSetting((state) => state.setLyricMapping);
  const lyricMapping = useNoxSetting((state) => state.lyricMapping);
  const [options, setOptions] = useState<NoxNetwork.NoxFetchedLyric[]>([]);
  const [value, setValue] = useState<NoxNetwork.NoxFetchedLyric>({
    key: '',
    songMid: '',
    label: '',
  });

  // Initializes options
  useEffect(() => {
    (async () => {
      setOptions(await searchLyricOptions(SearchKey));
    })();
  }, [SearchKey]);

  useEffect(() => {
    if (options.length === 0) {
      return;
    }
    function initLyric() {
      const detail = lyricMapping.get(songId);
      console.log(lyricMapping, detail);
      if (undefined !== detail) {
        setLyricOffset(detail.lyricOffset);
        const index = options.findIndex((v) => v.songMid === detail.lyricKey);
        if (index !== -1) {
          onOptionSet({}, options[index]);
          return;
        }

        options.unshift({
          key: detail.lyricKey,
          songMid: detail.lyricKey,
          label: detail.songId,
        });
        setOptions(options);
      }
      onOptionSet({}, options[0]);
    }
    initLyric();
  }, [options]);

  const onOptionSet = (_: any, newValue?: NoxNetwork.NoxFetchedLyric) => {
    if (newValue === undefined) return;
    setValue(newValue);
    searchLyric(newValue.songMid, setLyric);
    setLyricMapping({
      songId,
      lyricKey: newValue.key,
    });
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
