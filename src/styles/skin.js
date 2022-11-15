import StorageManager from '../objects/Storage';
import { AzusaTheme } from './skins/azusa';
import { ItsukiTheme } from './skins/itsuki';
import { NoxTheme } from './skins/nox';
import { ClessSTheme } from './skins/clesss';
// needs to enable top-level await; necessary for other modules to import current skin config
let setting = await new StorageManager().getPlayerSetting();
export const SkinKeys = [
    '诺莺nox',
    '阿梓azusa',
    '星谷樹itsuki',
    'clessS',
];

export const skins = (key = setting.skin) => {

    /**
     * skin requires:
     * player banner (~2000*80)
     * mobile player banner (~600*400)
     * gif icon (60*60)
     * various color themes
     * 
     */
    if (!key) {
        key = '诺莺nox';
    }
    switch (key) {
        case 'clessS': 
            return ClessSTheme;
        case '诺莺nox': 
            return NoxTheme;
        case '星谷樹itsuki': 
            return ItsukiTheme;
    }
    // default is azusa skin.
    return AzusaTheme;
}

export var skinPreset = skins();