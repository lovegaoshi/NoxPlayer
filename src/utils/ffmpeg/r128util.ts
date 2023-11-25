import { fetchPlayUrlPromise } from '@APM/utils/mediafetch/resolveURL';
import { getR128Gain, addR128Gain } from '@APM/utils/ffmpeg/r128Store';
import r128gain from './ffmpeg';

const getOrSetR128Gain = async (
  song: NoxMedia.Song,
  getSource = fetchPlayUrlPromise,
) => {
  const r128Val = getR128Gain(song);
  if (r128Val !== null) {
    return r128Val;
  }
  const source = await getSource(song);
  const val = await r128gain(source.url);
  addR128Gain(song, val);
  return val;
};

export default getOrSetR128Gain;
