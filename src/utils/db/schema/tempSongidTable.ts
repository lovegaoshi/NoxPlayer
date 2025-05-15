import { integer, pgTable } from 'drizzle-orm/pg-core';

// this table merely keeps a list of song SQLids to allow a faster innerjoin.
const table = pgTable('tempid-table', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  songid: integer().unique().notNull(),
});

export default table;
