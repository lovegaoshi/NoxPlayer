// src/db/helpers.ts
import { sql, getTableColumns } from 'drizzle-orm';
import {
  PgUpdateSetSource,
  PgTable,
  getTableConfig,
} from 'drizzle-orm/pg-core';

export function conflictUpdateSetAllColumns<
  T extends PgTable,
  // HACK: instead of $inferInsert, this gives compatibility with sqlite...
  E extends (keyof T['$inferSelect'])[],
>(table: T, except?: E): PgUpdateSetSource<T> {
  const columns = getTableColumns(table);
  const config = getTableConfig(table);
  const { name: tableName } = config;
  const conflictUpdateSet = Object.entries(columns).reduce(
    (acc, [columnName, columnInfo]) => {
      if (except && except.includes(columnName as E[number])) {
        return acc;
      }
      if (!columnInfo.default) {
        // @ts-ignore
        acc[columnName] = sql.raw(
          `COALESCE("excluded"."${columnInfo.name}", "${tableName}"."${columnInfo.name}")`,
        );
      }
      return acc;
    },
    {},
  ) as PgUpdateSetSource<T>;
  return conflictUpdateSet;
}

export default conflictUpdateSetAllColumns;
