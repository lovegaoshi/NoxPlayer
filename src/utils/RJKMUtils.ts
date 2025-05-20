import { NoxRepeatMode } from '@enums/RepeatMode';

export const NoxRepeatModeToRJKM = {
  [NoxRepeatMode.Repeat]: 'order',
  [NoxRepeatMode.RepeatTrack]: 'orderLoop',
  [NoxRepeatMode.Shuffle]: 'shufflePlay',
};

export default {};
