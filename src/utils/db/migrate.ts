import type { MigrationConfig } from 'drizzle-orm/migrator';
import db from './sql';
import migrations from '../../../migrations.json';

export default async () =>
  // @ts-expect-error dialect and session will appear to not exist...but they do
  db.dialect.migrate(migrations, db.session, {
    migrationsTable: 'drizzle_migrations',
  } satisfies Omit<MigrationConfig, 'migrationsFolder'>);
