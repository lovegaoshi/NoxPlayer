import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

// this table merely keeps a list of songcids to allow a faster innerjoin.
const table = pgTable('temp-table', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  songcid: varchar({ length: 255 }).notNull(),
});

export default table;
