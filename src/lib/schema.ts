import { z } from "zod";

export const FontSchema = z.object({
  id: z.string(),
  name: z.string(),
  creatorId: z.string(),
  description: z.string(),
  category: z.enum(["sans", "serif", "display", "script", "monospace"]),
  weights: z.array(z.number()),
  hasItalic: z.boolean(),
  license: z.string(),
  licenseUrl: z.string().url(),
  sourceUrl: z.string().url(),
  fileMap: z.record(z.string(), z.string()),
  dateAdded: z.string(),
});

export type Font = z.infer<typeof FontSchema>;

export const CreatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string(),
  location: z.string().optional(),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string().url(),
    }),
  ),
  avatarUrl: z.string().url().optional(),
  fontIds: z.array(z.string()),
});

export type Creator = z.infer<typeof CreatorSchema>;
