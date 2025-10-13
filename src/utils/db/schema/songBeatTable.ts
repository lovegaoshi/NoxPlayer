import { integer, pgTable, varchar, text } from 'drizzle-orm/pg-core';

// this table merely keeps a list of songcids to allow a faster innerjoin.
const table = pgTable('song-beat-table', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  songcid: varchar({ length: 255 }).notNull(),
  beat: text().notNull(),
});

export default table;
