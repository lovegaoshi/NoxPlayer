import { getSettings } from '@APM/utils/ChromeStorage';
import { buttonStyle, ScrollBar } from '@hooks/useTheme';
import { getCustomSkin } from '@utils/ChromeStorage';
import AzusaTheme from './skins/azusa';
import ItsukiTheme from './skins/itsuki';
import NoxTheme from './skins/nox';
import ClessSTheme from './skins/clesss';
import AmeliaTheme from './skins/amelia';
import GuraTheme from './skins/gura';
import PomeloTheme from './skins/pomelo';
import HeraKrisTheme from './skins/heraKris';
import RinaHayashiTheme from './skins/rinahayashi';
import TaojiTheme from './skins/taojiovo';
import SteriaTheme from './skins/steria';
import AriaTheme from './skins/aria';
import NoirTheme from './skins/noir';
import RyniaTheme from './skins/rynia';
import NiyaTheme from './skins/nyiaibu';
import LumiTheme from './skins/lumi';
import KeroroTheme from './skins/keroro';

// needs to enable top-level await; necessary for other modules to import current skin config
const setting = await getSettings();
// http://192.168.50.1:19527/getimg?imgserve=itsuki&file=herabanner.png

const customSkin = await getCustomSkin();

export const SkinMap: { [key: string]: () => any } = {
  诺莺Nox: () => NoxTheme(),
  阿梓Azusa: () => AzusaTheme(),
  星谷樹itsuki: () => ItsukiTheme(),
  clessS: () => ClessSTheme(),
  'Amelia Watson': () => AmeliaTheme(),
  'Gawr Gura': () => GuraTheme(),
  Pokemon安妮: () => PomeloTheme(),
  赫拉Kris: () => HeraKrisTheme(),
  林莉奈RinaHayashi: () => RinaHayashiTheme(),
  薇Steria: () => SteriaTheme(),
  桃几OvO: () => TaojiTheme(),
  阿蕊娅Aria: () => AriaTheme(),
  黑泽诺亚NOIR: () => NoirTheme(),
  莱妮娅Rynia: () => RyniaTheme(),
  阿布: () => NiyaTheme(),
  露米Lumi: () => LumiTheme(),
  蛙吹Keroro: () => KeroroTheme(),
  Custom: () => customSkin ?? NoxTheme(),
};

export const skins = (key = setting.skin) => {
  const getSkin = () => {
    /**
     * skin requires:
     * player banner (~2000*80)
     * mobile player banner (~600*400)
     * gif icon (60*60)
     * various color themes
     *
     */
    return SkinMap[key ?? '诺莺Nox']?.() ?? NoxTheme();
  };
  const playerStyle = getSkin();
  return {
    ...playerStyle,
    outerLayerBtn: { padding: 'unset' },
    CRUDBtn: {
      ':hover': {
        cursor: 'default',
      },
      paddingLeft: '8px',
      paddingRight: '8px',
    },

    CRUDIcon: {
      ':hover': {
        cursor: 'pointer',
      },
      width: '1.1em',
      height: '1.1em',
      paddingBottom: '2px',
      color: playerStyle.colorTheme.playListIconColor,
    },

    AddFavIcon: {
      ':hover': {
        cursor: 'pointer',
      },
      width: '1em',
      color: playerStyle.colorTheme.playListIconColor,
    },

    DiskIcon: {
      minWidth: '36px',
    },
    buttonStyle: buttonStyle(
      playerStyle.reactJKPlayerTheme.sliderColor,
      playerStyle.desktopTheme,
    ),
    ScrollBar: ScrollBar(playerStyle.colorTheme.scrollbarColor),
  };
};

export const skinPreset = skins();
