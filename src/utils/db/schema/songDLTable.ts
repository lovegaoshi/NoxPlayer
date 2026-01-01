import { integer, pgTable, varchar, text } from 'drizzle-orm/pg-core';

// this table merely keeps a list of songcids to allow a faster innerjoin.
const table = pgTable('song-download-table', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  songcid: varchar({ length: 255 }).notNull(),
  downloadPath: text().notNull(),
});

export default table;
