import React, { useState } from 'react';

import { reParseSearch } from '@APM/utils/re';

const useFav = (favlist: NoxMedia.Playlist) => {
  const [rows, setRows] = useState<NoxMedia.Song[]>([]);

  const requestSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchedVal = e.target.value;
    handleSearch(searchedVal);
  };

  const handleSearch = (searchedVal: string) => {
    if (searchedVal === '') {
      setRows(favlist.songList);
      return;
    }
    setRows(reParseSearch({ searchStr: searchedVal, rows: favlist.songList }));
  };
  return {
    rows,
    setRows,
    requestSearch,
    handleSearch,
  };
};

export default useFav;
