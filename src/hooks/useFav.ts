import React, { useState } from 'react';

import { reParseSearch } from '@APM/utils/re';

const useFav = (favlist: NoxMedia.Playlist) => {
  const [rows, setRows] = useState<NoxMedia.Song[]>([]);

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
    handleSearch,
  };
};

export default useFav;
