import { eq } from 'drizzle-orm';

import db from './sql';
import playbackTable from './schema/playbackCount';
import tempTable from './schema/tempSongTable';

export const getPlaybackCountTable = async () =>
  db.select().from(playbackTable);

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
