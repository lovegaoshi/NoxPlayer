import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();
ffmpeg.on('log', (log) => console.log(log));
await ffmpeg.load({
  coreURL: chrome.runtime.getURL('js/ffmpeg-core.js'),
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
};
