/**
 * Integrity check: verifies every font.creatorId resolves to a real creator,
 * and every creator.fontIds resolves to real fonts.
 *
 * Run: npx tsx scripts/check-integrity.ts
 */

import { getFonts, getCreators } from "../src/lib/content";

const fonts = getFonts();
const creators = getCreators();

const fontIds = new Set(fonts.map((f) => f.id));
const creatorIds = new Set(creators.map((c) => c.id));

let failed = false;

for (const font of fonts) {
  if (!creatorIds.has(font.creatorId)) {
    console.error(
      `ERROR: Font "${font.id}" references nonexistent creator "${font.creatorId}"`,
    );
    failed = true;
  }
}

for (const creator of creators) {
  for (const fontId of creator.fontIds) {
    if (!fontIds.has(fontId)) {
      console.error(
        `ERROR: Creator "${creator.id}" references nonexistent font "${fontId}"`,
      );
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log(
    `OK: ${fonts.length} fonts, ${creators.length} creators — all references valid.`,
  );
}
