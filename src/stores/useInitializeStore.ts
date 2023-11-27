import { initializeR128Gain } from '@APM/utils/ffmpeg/r128Store';
import { initializePlayerSetting } from '@APM/stores/playerSettingStore';
import { initialize as initializeAppStore } from '@APM/stores/appStore';
import { useNoxSetting } from '@APM/stores/useApp';
import { initPlayerObject, importStorageRaw } from '@utils/ChromeStorage';

const useInitializeStore = () => {
  const initPlayer = useNoxSetting((state) => state.initPlayer);

  const initializeStores = async () => {
    initializeAppStore();
    initializeR128Gain();
    initializePlayerSetting();
    return await initPlayer(await initPlayerObject());
  };

  const initializeFromSync = async (content: Uint8Array) => {
    await importStorageRaw(content);
    return initializeStores();
  };

  return { initializeStores, initializeFromSync };
};

export default useInitializeStore;
