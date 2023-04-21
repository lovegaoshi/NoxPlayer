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

const skinTemplate: skinInterface = {
  playerBanner: '',
  playerBannerMobile: async () => new Promise((resolve) => { resolve(''); }),
  playerBackgroundMobileVideo: false,
  playerBackground: async () => new Promise((resolve) => { resolve(''); }),
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
