export * from '@APM/utils/Utils';

export const isPlayerFocused = (callback: () => void) => {
  if (
    !document
      .getElementsByClassName('react-jinke-music-player-main')[0]
      ?.contains(document.activeElement)
  ) {
    callback();
  }
};
