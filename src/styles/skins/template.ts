import { SerializedStyles } from '@emotion/react';
import { ClassNameMap } from '@mui/material';

import resolveBackgroundImage, {
  RESOLVE_TYPE,
} from '@APM/utils/mediafetch/mainbackgroundfetch';
import { randomChoice } from '@utils/Utils';

interface overrideMUITheme {
  [key: string]: any;
}

interface SkinTemplate {
  playerBanner: string;
  playerBackground: () => Promise<NoxTheme.backgroundImage>;
  gifs: string[];
  appTitle: string;
  desktopTheme: string;
  colorTheme: overrideMUITheme;
  reactJKPlayerTheme: overrideMUITheme;
  maintainer: string;
  maintainerTooltip: string;
  maintainerURL: string;
  [key: string]: any;
}

export interface Skin extends SkinTemplate {
  buttonStyle: SerializedStyles;
  ScrollBar: (props?: any) => ClassNameMap<'root'>;
  outerLayerBtn: any;
  CRUDBtn: any;
  CRUDIcon: any;
  AddFavIcon: any;
  DiskIcon: any;
}

const skinTemplate = (): SkinTemplate => {
  return {
    playerBanner: '',
    playerBackground: async () => ({
      type: RESOLVE_TYPE.image,
      identifier: '',
    }),
    gifs: [],
    appTitle: 'noxplayer',
    desktopTheme: 'dark',
    colorTheme: {},
    reactJKPlayerTheme: {},
    maintainer: 'lovegaoshi',
    maintainerTooltip: "he's too lazy to leave anything here.",
    maintainerURL: '',
  };
};

export default function template(skin: { [key: string]: any }) {
  return {
    ...skinTemplate(),
    ...skin,
    playerBackground: () =>
      resolveBackgroundImage(
        randomChoice(skin.playerBackground) as
          | NoxTheme.backgroundImage
          | string,
      ),
  };
}
