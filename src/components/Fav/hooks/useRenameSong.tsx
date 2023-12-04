import React, { useState } from 'react';

const useRenameSong = () => {
  const [songObjEdited, setSongObjEdited] = useState<NoxMedia.Song>();
  const [songEditDialogOpen, setSongEditDialogOpen] = useState(false);
  const openSongEditDialog = (song: NoxMedia.Song) => {
    setSongObjEdited(song);
    setSongEditDialogOpen(true);
  };

  return {
    songObjEdited,
    songEditDialogOpen,
    openSongEditDialog,
    setSongEditDialogOpen,
    setSongObjEdited,
  };
};

export default useRenameSong;
