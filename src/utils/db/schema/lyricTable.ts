import { integer, pgTable, varchar, text, real } from 'drizzle-orm/pg-core';

const table = pgTable('lyric-table', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  songId: varchar({ length: 255 }).unique().notNull(),
  lyricKey: varchar({ length: 255 }).notNull(),
  lyricOffset: real().notNull(),
  lyric: text().notNull(),
  source: varchar({ length: 255 }),
});

export default table;
