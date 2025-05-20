import { initialize as initializeAppStore } from '@APM/stores/appStore';
import { useNoxSetting } from '@APM/stores/useApp';
import { initPlayerObject, importStorageRaw } from '@utils/ChromeStorage';
import useApp from '@stores/useApp';
import versionUpdate from '@utils/versionupdater/versionupdater';
import APMMigration from '@APM/utils/db/migration';
import { initialize as initializeRegexStore } from './regexStore';

const useInitializeStore = () => {
  const initPlayer = useNoxSetting((state) => state.initPlayer);
  const initApp = useApp((state) => state.initialize);

  const initializeStores = async () => {
    await versionUpdate();
    await APMMigration();
    initializeAppStore();
    await initializeRegexStore();
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
