import { eq } from 'drizzle-orm';

import db from './sql';
import playbackTable from './schema/playbackCount';
import tempTable from './schema/tempSongTable';
import r128GainTable from './schema/r128gainTable';
import lyricTable from './schema/lyricTable';
import abrepeatTable from './schema/abrepeatTable';

export const exportSQL = async () => {
  const res = {
    playbackCount: await db.select().from(playbackTable),
    lyric: await db.select().from(lyricTable),
    r128gain: await db.select().from(r128GainTable),
    abrepeat: await db.select().from(abrepeatTable),
  };
  return JSON.stringify(res);
};

export const getPlaybackCountAPI = async (songcid: string) => {
  const res = await db
    .select({
      count: playbackTable.count,
      lastPlayed: playbackTable.lastPlayed,
    })
    .from(playbackTable)
    .where(eq(playbackTable.songcid, songcid));
  return res[0];
};

export const getPlaybackCountsAPI = async () => {
  const res = await db
    .select({
      id: playbackTable.songcid,
      count: playbackTable.count,
      lastPlayed: playbackTable.lastPlayed,
    })
    .from(playbackTable)
    .innerJoin(tempTable, eq(tempTable.songcid, playbackTable.songcid));
  return res.reduce(
    (acc, curr) => {
      acc[curr.id] = {
        count: curr.count,
        lastPlayed: curr.lastPlayed,
      };
      return acc;
    },
    {} as { [id: string]: { count: number; lastPlayed: number | null } },
  );
};

export const getR128Gain = async (songcid?: string) => {
  const res = await db
    .select({
      r128gain: r128GainTable.r128gain,
    })
    .from(r128GainTable)
    .where(eq(r128GainTable.songcid, songcid ?? ''));
  return res?.[0]?.r128gain;
};

export const getABRepeat = async (
  songcid?: string,
): Promise<[number, number]> => {
  const res = (
    await db
      .select({
        a: abrepeatTable.a,
        b: abrepeatTable.b,
      })
      .from(abrepeatTable)
      .where(eq(abrepeatTable.songcid, songcid ?? ''))
  )?.[0];
  return [res?.a ?? 0, res?.b ?? 1];
};

export const getLyric = async (
  songcid?: string,
): Promise<NoxMedia.LyricDetail | undefined> => {
  const res = await db
    .select()
    .from(lyricTable)
    .where(eq(lyricTable.songId, songcid ?? ''));
  return res?.[0] as NoxMedia.LyricDetail;
};
