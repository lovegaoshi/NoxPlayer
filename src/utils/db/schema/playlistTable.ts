import { integer, pgTable, text } from 'drizzle-orm/pg-core';

const table = pgTable('playlist-table', {
  internalid: integer().primaryKey().generatedAlwaysAsIdentity(),
  id: text().unique().notNull(),
  title: text().notNull(),
  type: text().notNull(),
  lastSubscribed: integer().notNull(),
  // this is a list of song internal ids!!
  songList: text().notNull(),
  // json string of the rest
  settings: text().notNull(),
});

export default table;
