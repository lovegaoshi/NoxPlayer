import React from 'react';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';

import uploadLocalFile from '@utils/uploadLocalFile';
import { saveCustomSkin } from '@utils/ChromeStorage';

const readFile = (f: ArrayBuffer) => {
  const enc = new TextDecoder('utf-8');
  const decoded = enc.decode(f);
  const json = JSON.parse(decoded);
  saveCustomSkin(json);
};

export default function PlayerResetButton() {
  const onClick = () => {
    uploadLocalFile(readFile);
  };

  return (
    <Button startIcon={<UploadIcon />} onClick={onClick}>
      自定义皮肤
    </Button>
  );
}
