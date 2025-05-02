import { eq } from 'drizzle-orm';

import playbackTable from './schema/playbackCount';
import db from './sql';

// TODO: deal with no TS inferred typing to reuse from APM

export const clearPlaybackCount = async () => {
  await db.delete(playbackTable);
};

export const getPlaybackCounts = async () => {
  const res = await db.select().from(playbackTable);
  const result: { [id: string]: number } = {};
  res.forEach((v) => {
    result[v.songcid] = v.count;
  });
  return result;
};

export const getPlaybackCount = async (songcid: string | null) => {
  if (!songcid) {
    return 0;
  }
  const res = await db
    .select({ field1: playbackTable.count })
    .from(playbackTable)
    .where(eq(playbackTable.songcid, songcid));
  return res[0]?.field1;
};

export const increasePlaybackCount = async (
  songcid: string | null,
  inc = 1,
) => {
  if (!songcid) {
    return;
  }
  const count = await getPlaybackCount(songcid);
  if (count === undefined) {
    await db.insert(playbackTable).values({ songcid, count: inc });
    return;
  }
  await db
    .update(playbackTable)
    .set({ count: count + inc })
    .where(eq(playbackTable.songcid, songcid));
};
