import { eq } from 'drizzle-orm';

import db from './sql';
import playbackTable from './schema/playbackCount';

export const getPlaybackCountTable = async () =>
  db.select().from(playbackTable);

export const getPlaybackCountAPI = async (songcid: string) => {
  const res = await db
    .select({ field1: playbackTable.count })
    .from(playbackTable)
    .where(eq(playbackTable.songcid, songcid));
  return res[0]?.field1;
};
