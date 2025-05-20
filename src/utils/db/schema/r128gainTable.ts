import { integer, pgTable, varchar, real } from 'drizzle-orm/pg-core';

const table = pgTable('r128gain-table', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  songcid: varchar({ length: 255 }).unique().notNull(),
  r128gain: real(),
});

export default table;
