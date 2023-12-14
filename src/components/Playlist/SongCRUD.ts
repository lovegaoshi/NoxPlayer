import { getName } from '@APM/utils/re';
import { songExport2URL } from '@APM/utils/mediafetch/resolveURL';

export const searchSongOnWeb = (song: NoxMedia.Song) => {
  chrome.search.query({
    text: getName(song, true),
    disposition: 'NEW_TAB',
  });
};

export const searchSongOnBili = (song: NoxMedia.Song) =>
  window.open(
    `https://search.bilibili.com/all?keyword=${getName(
      song,
      true,
    )}&from_source=webtop_search`,
  );

export const copyToClipboard = (song: NoxMedia.Song) =>
  navigator.clipboard.writeText(getName(song, true));

export const copyLinkToClipboard = (song: NoxMedia.Song) =>
  navigator.clipboard.writeText(songExport2URL(song));
