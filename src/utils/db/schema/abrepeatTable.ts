import { integer, pgTable, varchar, real } from 'drizzle-orm/pg-core';

const table = pgTable('abrepeat-table', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  songcid: varchar({ length: 255 }).unique().notNull(),
  a: real(),
  b: real(),
  aAbs: real(),
  bAbs: real(),
  resumePlayback: real(),
});

export default table;
