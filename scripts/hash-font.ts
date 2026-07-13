#!/usr/bin/env tsx
/**
 * Hash and place font files into /public/fonts.
 *
 * Usage:
 *   pnpm hash-font <file> [file ...]
 *
 * For each file:
 *   1. Hash content → non-descriptive filename
 *   2. Copy to /public/fonts/<hash>.woff2
 *   3. Print the mapping
 *
 * Use this for pre-subsetted WOFF2 files (e.g. from fontsource).
 * For raw TTF/OTF, use `pnpm subset` instead.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, basename } from "node:path";

const PUBLIC_FONTS_DIR = resolve(import.meta.dirname, "..", "public", "fonts");

function hashFileBuffer(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex").slice(0, 8);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: pnpm hash-font <font-file> [font-file ...]");
  process.exit(1);
}

mkdirSync(PUBLIC_FONTS_DIR, { recursive: true });

console.log("Hashing font files:\n");

for (const arg of args) {
  const absPath = resolve(arg);
  const buf = readFileSync(absPath);
  const hash = hashFileBuffer(buf);
  const outFilename = `${hash}.woff2`;
  const outPath = resolve(PUBLIC_FONTS_DIR, outFilename);

  writeFileSync(outPath, buf);

  console.log(`  ${basename(absPath)} → ${outFilename} (${buf.length.toLocaleString()} bytes)`);
}

console.log("\nDone. Update the font's fileMap in its content entry with the output filenames.");
