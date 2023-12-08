import { skinPreset } from '@styles/skin';

const { colorTheme } = skinPreset;

export const outerLayerBtn = { padding: 'unset' };

export const CRUDBtn = {
  ':hover': {
    cursor: 'default',
  },
  paddingLeft: '8px',
  paddingRight: '8px',
};

export const CRUDIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1.1em',
  height: '1.1em',
  paddingBottom: '2px',
  color: colorTheme.playListIconColor,
};

export const AddFavIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1em',
  color: colorTheme.playListIconColor,
};

export const DiskIcon = {
  minWidth: '36px',
};
