import { makeStyles } from '@mui/styles';
import { css } from '@emotion/react';

export const buttonStyle = (sliderColor: string, desktopTheme: string) => css`
  cursor: pointer;
  &:hover {
    color: ${sliderColor};
  }
  background-color: transparent;
  color: ${desktopTheme === 'light' ? '7d7d7d' : 'white'};
`;

export const ScrollBar = (scrollbarColor: string = 'white') =>
  makeStyles((theme) => ({
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
        backgroundColor: scrollbarColor,
      },
    },
  }));
