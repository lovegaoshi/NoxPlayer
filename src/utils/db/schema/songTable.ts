import { integer, pgTable, text, real, boolean } from 'drizzle-orm/pg-core';

const table = pgTable('song-table', {
  internalid: integer().primaryKey().generatedAlwaysAsIdentity(),
  id: text().unique().notNull(),
  bvid: text().notNull(),
  name: text().notNull(),
  nameRaw: text().notNull(),
  singer: text().notNull(),
  singerId: text().notNull(),
  cover: text().notNull(),
  coverLowRes: text(),
  lyric: text(),
  lyricOffset: real(),
  parsedName: text().notNull(),
  biliShazamedName: text(),
  page: integer(),
  duration: integer().notNull(),
  album: text(),
  addedDate: integer(),
  source: text(),
  isLive: boolean(),
  liveStatus: boolean(),
  metadataOnLoad: boolean(),
  metadataOnReceived: boolean(),
  order: integer(),
  localPath: text(),
});

export default table;
