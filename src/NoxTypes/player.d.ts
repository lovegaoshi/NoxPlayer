declare namespace NoxPlayer {
  export interface Option {
    mode: string;
    showThemeSwitch: boolean;
    showLyric: boolean;
    toggleMode: boolean;
    locale: string;
    autoPlayInitLoadPlayList: boolean;
    autoPlay: boolean;
    defaultPlayIndex: number;
    bannerBg: string;
    themeOverwrite: any;
    extendsContent?: JSX.Element[];
  }
}
