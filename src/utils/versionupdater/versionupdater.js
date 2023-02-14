import { setLocalStorage, readLocalStorage, MY_FAV_LIST_KEY } from '../../objects/Storage';

export const getVersion = () => {
    return chrome.runtime.getManifest().version;
}

/**
 * a version updater in case there are any breaking changes.
 * unfortunately, my breaking changes actually breaks myself...
 */
export default async () => {
    let settingsVersion = await readLocalStorage('nox-version');
    const currentVersion = getVersion();
    if (settingsVersion === undefined) settingsVersion = 0;
    switch (settingsVersion) {
        case (0):
    }
    setLocalStorage('nox-version', currentVersion);
}