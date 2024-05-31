import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';

/**
 *
 * @param {*} texts
 */
const textToDialogContent = (texts: string[]) => {
  return (
    <DialogContent>
      {texts.map((val) => {
        return (
          <Typography
            gutterBottom
            key={uuidv4()}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {val.length === 1 ? ' ' : val}
          </Typography>
        );
      })}
    </DialogContent>
  );
};

export default textToDialogContent;
