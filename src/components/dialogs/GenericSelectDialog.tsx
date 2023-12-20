import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

interface Props<T> {
  visible: boolean;
  options: Array<T>;
  renderOptionTitle?: (val: T) => string;
  selectTitle?: string;
  title?: string;
  defaultIndex?: T;
  onClose?: (index?: T) => void;
  onSubmit?: (index: T) => void;
  children?: React.ReactNode;
}
export default function AddFavDialog<T>({
  visible,
  options,
  selectTitle,
  renderOptionTitle = (val) => String(val),
  title,
  defaultIndex,
  onClose = () => undefined,
  onSubmit = () => undefined,
  children,
}: Props<T>) {
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  const handleClose = () => {
    onClose(currentIndex);
    setCurrentIndex(defaultIndex);
  };

  const handleSubmit = () => {
    if (currentIndex === undefined) {
      handleClose();
      return;
    }
    onClose(currentIndex);
    onSubmit(currentIndex);
  };

  React.useEffect(() => setCurrentIndex(defaultIndex), [defaultIndex]);

  return (
    <Dialog open={visible} onClose={handleClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent style={styles.dialogContent}>
        <Box sx={styles.dialogContentBox}>
          {children}
          <FormControl fullWidth>
            {selectTitle && (
              <InputLabel
                id='demo-simple-select-label'
                style={styles.inputLabel}
              >
                {selectTitle}
              </InputLabel>
            )}
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={currentIndex ?? ''}
              label='genericSelect'
              onChange={(e) => setCurrentIndex(e.target.value as T)}
              input={<Input />}
              MenuProps={styles.select}
            >
              {options.map((option, i) => (
                <MenuItem key={`menu${i}`} value={String(option)}>
                  {renderOptionTitle(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        {currentIndex ? (
          <Button onClick={handleSubmit}>确认</Button>
        ) : (
          <Button disabled>确认</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

const styles = {
  dialogContent: { paddingTop: '24px' },
  dialogContentBox: { minWidth: 400, minHeight: 50 },
  select: { PaperProps: { sx: { maxHeight: '40vh' } } },
  inputLabel: { paddingTop: '10px' },
};
