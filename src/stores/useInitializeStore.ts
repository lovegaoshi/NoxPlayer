import { initializeR128Gain } from '@APM/utils/ffmpeg/r128Store';
import { initializePlayerSetting } from '@APM/stores/playerSettingStore';
import { initialize as initializeAppStore } from '@APM/stores/appStore';
import { useNoxSetting } from '@APM/stores/useApp';
import { initPlayerObject, importStorageRaw } from '@utils/ChromeStorage';
import useApp from '@stores/useApp';
import versionUpdate from '@utils/versionupdater/versionupdater';

const useInitializeStore = () => {
  const initPlayer = useNoxSetting((state) => state.initPlayer);
  const initApp = useApp((state) => state.initialize);

  const initializeStores = async () => {
    await versionUpdate();
    initializeAppStore();
    initializeR128Gain();
    initializePlayerSetting();
    const initializedObject = await initPlayerObject();
    initApp(initializedObject);
    return initPlayer(initializedObject);
  };

  const initializeFromSync = async (content: Uint8Array) => {
    await importStorageRaw(content);
    return initializeStores();
  };

  return { initializeStores, initializeFromSync };
};

export default useInitializeStore;
