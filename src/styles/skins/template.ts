interface backgroundResolveFn {
  (): Promise<string>
}

interface gifIconResolveFn {
  (): string
}

interface overrideMUITheme {
  [key: string]: any
}

export interface skinInterface {
  playerBanner: string;
  playerBannerMobile: backgroundResolveFn;
  playerBackgroundMobileVideo: boolean;
  playerBackground: backgroundResolveFn;
  playerBackgroundVideo: boolean;
  gifs: Array<string>;
  gifIcon: gifIconResolveFn;
  appTitle: string;
  desktopTheme: string;
  colorTheme: overrideMUITheme;
  reactJKPlayerTheme: overrideMUITheme;
  maintainer: string;
  maintainerTooltip: string;
  maintainerURL: string;
  [key: string]: any;
}

const skinTemplate = (): skinInterface => {
  return {
    playerBanner: '',
    playerBannerMobile: async () => new Promise<string>((resolve) => { resolve(''); }),
    playerBackgroundMobileVideo: false,
    playerBackground: async () => new Promise<string>((resolve) => { resolve(''); }),
    playerBackgroundVideo: false,
    gifs: [],
    gifIcon: () => '',
    appTitle: 'noxplayer',
    desktopTheme: 'dark',
    colorTheme: {},
    reactJKPlayerTheme: {},
    maintainer: 'lovegaoshi',
    maintainerTooltip: "he's too lazy to leave anything here.",
    maintainerURL: '',
  };
};

export function randomChoice(list: Array<any>) {
  return list[Math.floor(Math.random() * list.length) >> 0];
}

export default function template(skin: {[key: string]: any}) {
  return { ...skinTemplate(), ...skin };
}
