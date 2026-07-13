#!/usr/bin/env tsx
/**
 * Font subsetting pipeline.
 *
 * Usage:
 *   pnpm subset <path-to-font-file> [path-to-font-file ...]
 *
 * Steps per file:
 *   1. Subset to Latin + Latin Extended-A via pyftsubset
 *   2. Convert to .woff2
 *   3. Hash the output → non-descriptive filename
 *   4. Place in /public/fonts
 *   5. Print the mapping (weightStyle → hashed filename)
 *
 * Requires: Python fonttools (pyftsubset) on PATH or at the path below.
 */

import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, basename, extname } from "node:path";

const PUBLIC_FONTS_DIR = resolve(import.meta.dirname, "..", "public", "fonts");
const TEMP_DIR = resolve(import.meta.dirname, "..", "_source", ".tmp");

// Latin + Latin Extended-A covers ñ, accented vowels, and most European glyphs
const UNICODE_RANGES = "U+0000-00FF,U+0100-017F,U+2000-206F,U+20AC,U+2122";

function findPyftsubset(): string {
  // Try the venv pyftsubset first, then fall back to PATH
  const hermesPyftsubset =
    "C:\\Users\\user\\AppData\\Local\\hermes\\hermes-agent\\venv\\Scripts\\pyftsubset.exe";
  try {
    execSync(`"${hermesPyftsubset}" --help`, { stdio: "ignore" });
    return hermesPyftsubset;
  } catch {
    // fall through
  }
  return "pyftsubset";
}

function hashFileBuffer(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex").slice(0, 8);
}

function subsetFont(inputPath: string, pyftsubset: string): string {
  const absInput = resolve(inputPath);
  const name = basename(absInput, extname(absInput));

  mkdirSync(TEMP_DIR, { recursive: true });
  mkdirSync(PUBLIC_FONTS_DIR, { recursive: true });

  // Step 1: subset to a temp TTF
  const tempTtf = join(TEMP_DIR, `${name}-subset.ttf`);
  const subsetCmd = [
    `"${pyftsubset}"`,
    `"${absInput}"`,
    `--output-file="${tempTtf}"`,
    `--unicodes=${UNICODE_RANGES}`,
    "--layout-features=*",
    "--no-hinting",
    "--desubroutinize",
  ].join(" ");
  execSync(subsetCmd, { stdio: "pipe" });

  // Step 2: convert subsetted TTF to WOFF2 via fonttools
  const tempWoff2 = join(TEMP_DIR, `${name}-subset.woff2`);
  const convertCmd = [
    "python",
    "-c",
    `"from fonttools.ttLib import TTFont; f=TTFont('${tempTtf.replace(/\\/g, "\\\\")}'); f.flavor='woff2'; f.save('${tempWoff2.replace(/\\/g, "\\\\")}')"`,
  ].join(" ");
  execSync(convertCmd, { stdio: "pipe" });

  // Step 3: hash the WOFF2 content for a non-descriptive filename
  const woff2Buf = readFileSync(tempWoff2);
  const hash = hashFileBuffer(woff2Buf);
  const outFilename = `${hash}.woff2`;
  const outPath = join(PUBLIC_FONTS_DIR, outFilename);

  // Step 4: copy to /public/fonts
  writeFileSync(outPath, woff2Buf);

  // Report
  const originalSize = readFileSync(absInput).length;
  const subsetSize = woff2Buf.length;
  const reduction = ((1 - subsetSize / originalSize) * 100).toFixed(1);
  console.log(`  ${basename(absInput)} → ${outFilename}`);
  console.log(
    `    ${originalSize.toLocaleString()} → ${subsetSize.toLocaleString()} bytes (${reduction}% reduction)`,
  );

  return outFilename;
}

// --- Main ---
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: pnpm subset <font-file> [font-file ...]");
  process.exit(1);
}

const pyftsubset = findPyftsubset();
console.log("Subsetting fonts (Latin + Latin Extended-A → WOFF2):\n");

for (const arg of args) {
  try {
    subsetFont(arg, pyftsubset);
  } catch (err) {
    console.error(`  FAILED: ${arg}`);
    console.error(err);
    process.exit(1);
  }
}

console.log("\nDone. Update the font's fileMap in its content entry with the output filenames.");
