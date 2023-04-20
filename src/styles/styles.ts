import { makeStyles } from '@mui/styles';
import { skinPreset } from './skin';

export const ScrollBar = makeStyles((theme) => ({
  root: {
    '&::-webkit-scrollbar': {
      width: '14px',
      height: '18px',
      background: 'transparent',
    },

    '&::-webkit-scrollbar-thumb': {
      height: '29px',
      border: '5px solid rgba(0, 0, 0, 0)',
      backgroundClip: 'padding-box',
      borderRadius: '7px',
      '-webkit-border-radius': '7px',
      backgroundColor: skinPreset.colorTheme.scrollbarColor,
    },
  },
}));

export const btnActiveStyle = makeStyles((theme) => ({
  button: {
    '&.active': {
      background: '#e6e6e694',
    },
  },
}));
