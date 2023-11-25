import { initializeR128Gain } from '@APM/utils/ffmpeg/r128Store';
import { initializePlayerSetting } from '@APM/stores/playerSettingStore';
import { initializeAppStore } from './appStore';

export default async () => {
  initializeAppStore();
  initializeR128Gain();
  initializePlayerSetting();
};
