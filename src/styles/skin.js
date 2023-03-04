import StorageManager from '../objects/Storage';
import { AzusaTheme } from './skins/azusa';
import { ItsukiTheme } from './skins/itsuki';
import { NoxTheme } from './skins/nox';
import { ClessSTheme } from './skins/clesss';
import { AmeliaTheme } from './skins/amelia';
import { GuraTheme } from './skins/gura';
import { PomeloTheme } from './skins/pomelo';
import { HeraKrisTheme } from './skins/heraKris';
import { RinaHayashiTheme } from './skins/rinahayashi';
// needs to enable top-level await; necessary for other modules to import current skin config
let setting = await new StorageManager().getPlayerSetting();
// http://192.168.50.1:19527/getimg?imgserve=itsuki&file=herabanner.png
export const SkinKeys = [
    '诺莺nox',
    '阿梓azusa',
    '星谷樹itsuki',
    'clessS',
    'Amelia Watson',
    'Gawr Gura',
    'Pokemon安妮',
    '赫拉Kris',
    '林莉奈RinaHayashi',
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
        case 'Amelia Watson': 
            return AmeliaTheme;
        case 'Gawr Gura': 
            return GuraTheme;
        case 'Pokemon安妮': 
            return PomeloTheme;
        case '赫拉Kris': 
            return HeraKrisTheme;
        case '林莉奈RinaHayashi':
            return RinaHayashiTheme;
    }
    // default is azusa skin.
    return AzusaTheme;
}

export var skinPreset = skins();