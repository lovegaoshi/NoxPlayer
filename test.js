import { strFromU8, decompressSync } from 'fflate';
import fs from 'node:fs';

const data = fs.readFileSync(
  '/home/nisadmin/Downloads/noxplay_2025-01-16.noxBackup',
);
fs.writeFileSync(
  '/home/nisadmin/Downloads/nox.noxBackup.json',
  strFromU8(decompressSync(data)),
);
