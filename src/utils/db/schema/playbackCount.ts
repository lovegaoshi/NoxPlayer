import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

const table = pgTable('playback-count', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  songcid: varchar({ length: 255 }).notNull(),
  count: integer().notNull(),
  lastPlayed: integer(),
});

export default table;
