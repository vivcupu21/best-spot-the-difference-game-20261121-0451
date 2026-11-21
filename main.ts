// Twin Tails — Spot the Difference. Entrypoint (Node 22, stdlib only).
// Copies game/ and screenshots/ into the output directory and writes the
// dossier with make.fun's own library, exactly as the scorer rebuilds it.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { buildDossier } from './vendor/makefun-game.ts';

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const name of ['game', 'screenshots']) {
  if (!existsSync(name)) throw new Error(`main.ts: no ${name}/ directory next to main.ts`);
  cpSync(name, `${outDir}/${name}`, { recursive: true });
}

writeFileSync(
  `${outDir}/dossier.json`,
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
  }),
);

console.log(`main.ts: wrote ${outDir}/dossier.json from game/ + screenshots/`);
