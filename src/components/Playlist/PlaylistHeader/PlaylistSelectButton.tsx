import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import DeselectIcon from '@mui/icons-material/Deselect';

interface UsePlaylist {
  checking: boolean;
  setChecking: React.Dispatch<React.SetStateAction<boolean>>;
  resetSelected: () => void;
}
interface Props {
  usePlaylist: UsePlaylist;
}

export default function ({ usePlaylist }: Props) {
  const onClick = () => {
    if (usePlaylist.checking) {
      usePlaylist.resetSelected();
    }
    usePlaylist.setChecking((val) => !val);
    console.log(usePlaylist);
  };
  return (
    <Tooltip title={usePlaylist.checking ? '取消选择' : '选择'}>
      <IconButton size='large' onClick={onClick}>
        {usePlaylist.checking ? <DeselectIcon /> : <CropSquareIcon />}
      </IconButton>
    </Tooltip>
  );
}
