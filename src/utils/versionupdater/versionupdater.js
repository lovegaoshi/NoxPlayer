import { setLocalStorage, readLocalStorage, storageCleanup, MY_FAV_LIST_KEY } from '../../objects/Storage';
import updater1118 from './1.1.1.8';
import updater1119 from './1.1.1.9';

export const getVersion = () => {
    return chrome.runtime.getManifest().version;
}

/**
 * a version updater in case there are any breaking changes.
 * unfortunately, my breaking changes actually breaks myself...
 */
export default async () => {
    let settingsVersion = await readLocalStorage('nox-version');
    let settingVal = await readLocalStorage(MY_FAV_LIST_KEY);
    const currentVersion = getVersion();
    if (settingsVersion === undefined) settingsVersion = 0;
    if (settingVal !== undefined) {
        switch (settingsVersion) {
            case (0):
            case ('1.1.1.8'):
                updater1118();
            case ('1.1.1.9'):
                updater1119();
            case currentVersion:
                break;
            default:
                alert(`Noxplayer is updated from ${settingsVersion} to ${currentVersion}! \nRead what's new in settings.\n电闹播放器更新了！去帮助里更新说明看更新了什么鬼玩意儿。`);
        }
    }
    setLocalStorage('nox-version', currentVersion);
}