// Twin Tails — Spot the Difference. Entrypoint (Node 22, stdlib only).
// Copies game/ and screenshots/ into the output directory and writes the
// dossier with make.fun's own library, exactly as the scorer rebuilds it.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// Paths beside this file, not the working directory: the grader runs
// `node /bot/main.ts` from an arbitrary cwd, so bare 'game'/'screenshots'
// would not resolve there.
const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const name of ['game', 'screenshots']) {
  if (!existsSync(join(here, name))) throw new Error(`main.ts: no ${name}/ directory next to main.ts`);
  cpSync(join(here, name), `${outDir}/${name}`, { recursive: true });
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
