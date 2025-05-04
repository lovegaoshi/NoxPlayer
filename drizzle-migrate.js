import { readMigrationFiles } from 'drizzle-orm/migrator';
import { join } from 'node:path';
import fs from 'node:fs';

const migrations = readMigrationFiles({ migrationsFolder: './drizzle/' });

fs.writeFileSync(join('./migrations.json'), JSON.stringify(migrations));

console.log('Migrations compiled!');
