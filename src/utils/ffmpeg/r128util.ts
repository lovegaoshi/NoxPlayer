import { fetchPlayUrlPromise } from '@APM/utils/mediafetch/resolveURL';
import { getR128Gain } from '@utils/db/sqlAPI';
import { setR128Gain } from '@APM/utils/db/sqlStorage';
import r128gain from './ffmpeg';
import { r128gain2Volume } from '../Utils';

interface Props {
  song: NoxMedia.Song;
  getSource: (song: NoxMedia.Song) => Promise<NoxNetwork.ParsedNoxMediaURL>;
}
const getOrSetR128Gain = async ({
  song,
  getSource = (v) => fetchPlayUrlPromise({ song: v }),
}: Props) => {
  const r128Val = await getR128Gain(song.id);
  if (r128Val) {
    return r128gain2Volume(r128Val);
  }
  const source = await getSource(song);
  const val = source.loudness ? -source.loudness : await r128gain(source.url);
  await setR128Gain(song.id, val);
  return r128gain2Volume(val);
};

export default getOrSetR128Gain;
