import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();
let r128gain = 0;

ffmpeg.on('log', ({ message }) => {
  const parseTrackGain = /track_gain = (-?\d+\.\d+) dB/.exec(message);
  if (parseTrackGain !== null) {
    // eslint-disable-next-line prefer-destructuring
    r128gain = Number(parseTrackGain[1]!);
  }
  console.debug(message);
});
await ffmpeg.load({
  coreURL: chrome.runtime.getURL('js/ffmpeg-core.js'),
  wasmURL: chrome.runtime.getURL('js/ffmpeg-core.wasm'),
  workerURL: chrome.runtime.getURL('js/ffmpeg-core.worker.js'),
});

export default async (url: string) => {
  await ffmpeg.writeFile('temp.m4a', await fetchFile(url));
  await ffmpeg.exec([
    '-nostats',
    '-i',
    'temp.m4a',
    '-filter_complex',
    'replaygain',
    '-f',
    'null',
    '-',
  ]);
  console.log(`[r128gain] found r128gain: ${r128gain}`);
  return r128gain;
};
