# pilipinas-foundry

Filipino fonts library by Filipino type designers.

A specimen library of free, open-license typefaces made by Filipino type
designers and creatives. No downloads, no distribution — the product is the
experience of looking closely at letterforms and knowing who made them.

## Getting Started

```sh
pnpm install
pnpm dev
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Typecheck + production build |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting without writing |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm check:integrity` | Validate font/creator content entries |
| `pnpm subset` | Subset a font file (requires `pyftsubset`) |
| `pnpm hash-font` | Hash a font file for cache-busting |
| `pnpm generate:font-face` | Generate `@font-face` CSS from content |

## Tech Stack

- **Framework:** Vite + React + TypeScript (strict)
- **Styling:** Tailwind CSS v4 (CSS-first config)
- **Components:** shadcn/ui (Base UI primitives, Luma style)
- **Validation:** Zod (runtime content schema checks)
- **Deployment:** Cloudflare Pages

## Project Structure

```
src/
  components/
    home/           # Homepage collection grid
    layout/         # Header, footer, shell
    preview/        # Font preview & specimen (Phase 5)
    ui/             # Shared primitives (button, slider, dialog, etc.)
  content/
    fonts/          # Per-font data files (one .ts per font)
    creators/       # Per-creator data files (one .ts per creator)
  hooks/            # React hooks (useFontFace, etc.)
  lib/              # Schema, content accessors, utilities
  styles/           # Generated font-face declarations
public/
  fonts/            # Subsetted .woff2 files (hashed names)
scripts/            # Font subsetting, hashing, generation tooling
.agents/docs/       # Project spec, philosophy, build phases
```

## How It Works

Each font on the site is a static entry under `src/content/fonts/` — a TypeScript
file with metadata (name, creator, weights, license, file map). Font files are
subsetted `.woff2` stored in `public/fonts/` under hashed, non-descriptive names.
The site loads fonts lazily via `@font-face` injection only when selected.

Creator profiles live alongside font entries under `src/content/creators/`,
keeping attribution as a first-class data concern, not an afterthought.

## Adding a Font

See the ingestion workflow in `.agents/docs/PROJECT.md` section 5. The short
version:

1. Confirm the font is made by a Filipino creator under a free/open license.
2. Subset the source file to Latin + Latin Extended-A.
3. Convert to `.woff2` and place in `public/fonts/` with a hashed filename.
4. Add a content entry in `src/content/fonts/` and update the creator entry.
5. Run `pnpm check:integrity` to validate.

## License

This project is open source. The fonts featured on the site are each under their
own license (OFL, Apache 2.0, etc.) — see individual font entries for details.
