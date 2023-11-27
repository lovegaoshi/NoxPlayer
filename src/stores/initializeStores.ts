import { initializeR128Gain } from '@APM/utils/ffmpeg/r128Store';
import { initializePlayerSetting } from '@APM/stores/playerSettingStore';
import { initialize as initializeAppStore } from '@APM/stores/appStore';
import { useNoxSetting } from '@APM/stores/useApp';

const useInitializeStore = () => {
  const initPlayer = useNoxSetting((state) => state.initPlayer);

  const initializeStores = async () => {
    initializeAppStore();
    initializeR128Gain();
    initializePlayerSetting();
  };
  return { initializeStores };
};

export default useInitializeStore;
