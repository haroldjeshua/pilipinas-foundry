/**
 * Generates @font-face declarations from the font content entries.
 *
 * Usage:
 *   pnpm generate:font-face
 *
 * Outputs src/styles/font-faces.css — a single file importing all font-face
 * rules, ready to be included in the app's CSS entry point.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getFonts } from "../src/lib/content";

const OUT_PATH = resolve(import.meta.dirname, "..", "src", "styles", "font-faces.css");

function generateFontFace(font: { id: string; name: string; fileMap: Record<string, string> }): string {
  const lines: string[] = [];

  for (const [weightStyle, woff2Path] of Object.entries(font.fileMap)) {
    // Parse "400" → weight 400, normal; "400i" → weight 400, italic; "700i" → weight 700, italic
    const match = weightStyle.match(/^(\d+)(i?)$/);
    if (!match) continue;
    const [, weight, italic] = match;
    const style = italic === "i" ? "italic" : "normal";

    lines.push(`@font-face {`);
    lines.push(`  font-family: "${font.name}";`);
    lines.push(`  font-weight: ${weight};`);
    lines.push(`  font-style: ${style};`);
    lines.push(`  font-display: swap;`);
    lines.push(`  src: url("/fonts/${woff2Path}") format("woff2");`);
    lines.push(`}`);
    lines.push(``);
  }

  return lines.join("\n");
}

const fonts = getFonts();
const css = fonts.map(generateFontFace).join("");

writeFileSync(OUT_PATH, css);
console.log(`Generated @font-face CSS for ${fonts.length} fonts → ${OUT_PATH}`);
