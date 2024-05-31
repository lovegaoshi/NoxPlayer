import { saveItem, getItem } from '../ChromeStorage';
import update1118 from './1.1.1.8';
import update3000 from './3.0.0.0';
import update4000 from './4.0.0.0';

const getVersion = () => {
  return chrome.runtime.getManifest().version;
};

type Version = [number, number, number, number];

const convertVersion = (ver = '0.0.0.0'): Version => {
  try {
    return ver.split('.').map((v) => Number(v)) as Version;
  } catch {
    return [0, 0, 0, 0];
  }
};

const needUpdate = (
  curVer: Version,
  toVer: Version,
  iterateIndex = 0,
): boolean => {
  if (curVer[iterateIndex] < toVer[iterateIndex]) {
    return true;
  }
  if (curVer[iterateIndex] > toVer[iterateIndex]) {
    return false;
  }
  if (iterateIndex === 3) {
    return false;
  }
  return needUpdate(curVer, toVer, iterateIndex + 1);
};

const updates: [Version, () => void | Promise<void>][] = [
  [convertVersion('1.1.1.9'), update1118],
  [convertVersion('3.0.0.0'), update3000],
  [convertVersion('4.0.0.0'), update4000],
];

/**
 * a version updater in case there are any breaking changes.
 * unfortunately, my breaking changes actually breaks myself...
 */
export default async () => {
  const oldVer = await getItem('nox-version');
  const oldVerParsed = convertVersion(oldVer);
  const currVer = getVersion();
  const updatedString = `Noxplayer is updated from ${oldVer} to ${currVer}! \nRead what's new in settings.\n电闹播放器更新了！去帮助里更新说明看更新了什么鬼玩意儿。`;
  let updated = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const update of updates) {
    if (needUpdate(oldVerParsed, update[0])) {
      await update[1]();
      updated = true;
    }
  }
  // eslint-disable-next-line no-alert
  if (updated) alert(updatedString);
  saveItem('nox-version', currVer);
};
