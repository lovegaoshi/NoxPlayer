import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useNoxSetting } from '@APM/stores/useApp';
import { searchLyricOptions, searchLyric } from '@APM/utils/LyricFetch';
import { LrcSource } from '@enums/LyricFetch';

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
  setLyricOffset,
}: Props) {
  const setLyricMapping = useNoxSetting((state) => state.setLyricMapping);
  const lyricMapping = useNoxSetting((state) => state.lyricMapping);
  const cachedLrc = useRef(['', '']);
  const [options, setOptions] = useState<NoxNetwork.NoxFetchedLyric[]>([]);
  const [value, setValue] = useState<NoxNetwork.NoxFetchedLyric>({
    key: '',
    songMid: '',
    label: '',
  });

  // Initializes options
  useEffect(() => {
    (async () => {
      if (searchKey === '') return;
      const resolvedOptions = await Promise.all([
        searchLyricOptions({ searchKey }),
        searchLyricOptions({
          searchKey,
          source: LrcSource.BiliBili,
          song: currentAudio,
        }),
      ]);
      setOptions(resolvedOptions.flat());
    })();
  }, [searchKey]);

  useEffect(() => {
    if (options.length === 0) {
      return;
    }
    function initLyric() {
      const detail = lyricMapping.get(currentAudio.id);
      if (detail !== undefined) {
        if (cachedLrc.current[0] === detail.lyricKey)
          setLyric(cachedLrc.current[1]!);
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
    searchLyric(newValue.songMid, newValue.source).then((v) => {
      setLyric(v);
      cachedLrc.current = [newValue.key, v];
    });
    setLyricMapping({
      songId: currentAudio.id,
      lyricKey: newValue.key,
    });
  };

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
