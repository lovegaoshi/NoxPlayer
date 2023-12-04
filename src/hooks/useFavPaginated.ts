import React, { useState } from 'react';

import useFav from './useFav';
/**
 * use hook for the paginated fav view. has rows.
 * @param playlist
 * @returns
 */
const useFavP = (playlist: NoxMedia.Playlist) => {
  const usedFav = useFav(playlist);

  const [page, setPage] = useState(0);
  const defaultRowsPerPage = Math.max(
    1,
    Math.floor((window.innerHeight - 305) / 40),
  );
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  return {
    ...usedFav,
    page,
    setPage,
    defaultRowsPerPage,
    rowsPerPage,
    setRowsPerPage,
  };
};

export default useFavP;
