import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const client = new PGlite('idb://noxplayer');
const db = drizzle({ client });

export default db;
