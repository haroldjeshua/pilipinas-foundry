import { FontSchema, CreatorSchema, type Font, type Creator } from "./schema.js";
import { fonts as rawFonts } from "../content/fonts/index.js";
import { creators as rawCreators } from "../content/creators/index.js";

let validatedFonts: Font[] | null = null;
let validatedCreators: Creator[] | null = null;

function validateFonts(): Font[] {
  if (validatedFonts) return validatedFonts;
  validatedFonts = rawFonts.map((f: unknown, i: number) => {
    const result = FontSchema.safeParse(f);
    if (!result.success) {
      const label = (f as Record<string, unknown>)["id"] ?? `index ${i}`;
      throw new Error(
        `Invalid font entry "${label}":\n${result.error.format()}`,
      );
    }
    return result.data;
  });
  return validatedFonts;
}

function validateCreators(): Creator[] {
  if (validatedCreators) return validatedCreators;
  validatedCreators = rawCreators.map((c: unknown, i: number) => {
    const result = CreatorSchema.safeParse(c);
    if (!result.success) {
      const label = (c as Record<string, unknown>)["id"] ?? `index ${i}`;
      throw new Error(
        `Invalid creator entry "${label}":\n${result.error.format()}`,
      );
    }
    return result.data;
  });
  return validatedCreators;
}

export function getFonts(): Font[] {
  return validateFonts()!;
}

export function getFont(id: string): Font | undefined {
  return validateFonts().find((f) => f.id === id);
}

export function getCreators(): Creator[] {
  return validateCreators()!;
}

export function getCreator(id: string): Creator | undefined {
  return validateCreators().find((c) => c.id === id);
}

export function getFontsByCreator(creatorId: string): Font[] {
  return validateFonts().filter((f) => f.creatorId === creatorId);
}
