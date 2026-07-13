# Filipino Free Font Library (working name: tipong-pinoy)

Part of the Pilipinas Interface ecosystem.

## 1. Vision

A design-engineering initiative — not a font distribution service — that lets people
**preview** free/open-license fonts made by Filipino type designers and creatives,
side by side, with full typographic control (size, color, tracking, leading, custom
text). No downloads, no zip files, no "get font" button. The product is the
*experience of previewing type*, and the *spotlight on who made it*.

Inspired by [Google Fonts Preview by Tomoya Okada](https://fonts.tomoyaokada.com/) —
same interaction model (dual heading/body font pickers, live style controls), but
sourced from a hand-curated Filipino type design community instead of the Google
Fonts API, and with creator attribution as a first-class feature, not a footnote.

## 2. Core Principles

- **Design engineering showcase first.** This is a portfolio-grade build — clean
  typography, thoughtful motion, restrained UI. It should read as craft.
- **No distribution.** No download links, no zipped font packages, no "use this
  font" CTA. Preview only. (We can't stop devtools inspection — that's an
  unavoidable reality of `@font-face` — but we don't hand anyone a convenient path
  to lift a file.)
- **Creators are the point.** Every font links to a creator profile — bio, socials,
  portfolio, other fonts they've made. This is the actual differentiator from the
  Tomoya Okada inspiration, not an afterthought.
- **Filipino context through curation, not decoration.** The "Filipino-ness" of this
  project lives in *whose work is featured*. No Baybayin, no forced Tagalog UI
  copy, no gimmicks. Default preview text is a Tagalog pangram; an English
  pangram is available as an optional toggle in a settings dialog.
- **Respect licenses and creators.** Every font entry documents its license
  (OFL, Apache 2.0, etc.) and, where possible, has creator sign-off that their work
  is featured. Attribution is never optional.

## 3. Tech Stack

- Vite + React + TypeScript (strict) + Tailwind
- No backend, no database — static site, deployable to Cloudflare Pages
- Font data as static JSON (or TS modules) — content-as-code, no CMS for v1
- Fonts self-hosted as `.woff2` in `/public/fonts`, subsetted before commit
- UI typeface: Geist Sans (interface chrome), Geist Mono (numbers/metadata)

## 4. Data Model

### `fonts.json` (or per-font files under `src/content/fonts/`)
```ts
type Font = {
  id: string;              // slug, e.g. "salubong-sans"
  name: string;
  creatorId: string;       // FK to creators.json
  category: "sans" | "serif" | "display" | "script" | "monospace";
  weights: number[];       // available weights, e.g. [400, 700]
  hasItalic: boolean;
  license: "OFL" | "Apache-2.0" | string;
  licenseUrl: string;
  sourceUrl: string;       // where the font is officially published (GitHub, creator site)
  fileMap: Record<string, string>; // weight/style -> woff2 path in /public/fonts
  dateAdded: string;
};
```

### `creators.json` (or per-creator files under `src/content/creators/`)
```ts
type Creator = {
  id: string;
  name: string;
  bio: string;             // short, factual, no overwritten narrative
  location?: string;       // optional, city/region if they want it shown
  links: { label: string; url: string }[]; // twitter, behance, portfolio, github
  avatarUrl?: string;
  fontIds: string[];       // fonts they've made, featured on this site
};
```

Keeping fonts and creators as separate entities (rather than embedding creator info
inside each font) means one creator with multiple fonts only needs one profile —
important since Filipino type design is a small, overlapping community.

## 5. Font Ingestion Workflow

This is the actual pipeline for "how does a font get onto the site" — matters a lot
since there's no backend/CMS, so this is a manual, deliberate process for v1.

1. **Source & vet.** Confirm the font is made by a Filipino creator and released
   under a genuinely free/open license (OFL, Apache 2.0, or explicit permission).
   No license, no feature — this isn't negotiable.
2. **Confirm with creator (where possible).** A short note that you're featuring
   their work in a preview-only context, with credit and a link back to them.
   Not strictly required by license terms in most cases, but aligns with the
   project's spirit of celebrating the community, not just harvesting from it.
3. **Get the canonical file.** Pull from the creator's official source (their
   GitHub release, their site) — not a third-party mirror.
4. **Subset.** Use `pyftsubset` (fonttools) or `glyphhanger` to strip to the glyph
   ranges actually needed — Latin + Latin Extended-A (covers ñ and friends) is
   almost always sufficient. This is the single biggest lever against repo bloat.
5. **Convert to `.woff2`** if not already in that format.
6. **Never commit the raw source file.** Keep original TTF/OTF in a local,
   gitignored staging folder (`_source/`, not tracked). Only the final subsetted
   `.woff2` goes into `/public/fonts`.
7. **Add metadata.** New entry in `fonts.json`, new or updated entry in
   `creators.json`.
8. **Test render.** Confirm the font loads correctly across the weight/style
   variants declared.
9. **Commit / PR.**

This is intentionally a "you, doing PRs" workflow for v1 — no submission form, no
review queue. If the project outgrows solo curation later, that's a v2 decision
(e.g. a lightweight submission form that still routes through manual review before
anything gets subsetted and committed — never auto-publish uploaded files).

## 6. Repo Bloat — Reality Check

A properly subset `.woff2` runs roughly 10–40KB per weight. At a realistic v1 scale
(20–40 fonts, ~3 weights average), total asset footprint lands around 2–5MB —
smaller than a handful of unoptimized hero images. Bloat risk comes from skipping
subsetting or committing raw source files, not from self-hosting itself. The
ingestion workflow above (steps 4 and 6) is the actual mitigation.

**Documented escape hatch (not a v1 concern):** if the library grows past roughly
100+ fonts, or you want independently-versioned assets, move `/public/fonts`
contents to a dedicated object store (Cloudflare R2, Vercel Blob) or an
assets-only repo referenced via a CDN, decoupled from the app code repo. Flagging
this now so it's a known lever, not a scramble later.

## 7. V1 Feature Set

- **Dual preview panes** — heading font + body font, selected independently
  (mirrors the Tomoya Okada interaction model).
- **Per-pane controls** — font, weight, size, color, letter-spacing, line-height.
- **Editable preview text** — user can type their own sample text; Tagalog
  pangram as default, English pangram available via a settings dialog toggle.
- **Font detail view** — full specimen (weights, styles), license info, creator
  credit (name + link inline, not a separate page).
- **Browse/filter** — by category (sans/serif/display/script), maybe by creator.

## 8. Non-Goals (v1)

- No download button, no font file distribution of any kind.
- No font-hosting API for third parties to embed.
- No Baybayin, no forced Tagalog UI, no overwrought "cultural" visual gimmicks.
- No CMS, no backend, no user accounts, no submission form.

## 9. Open Questions / Risks

- **Font sourcing shortlist.** Two curated resource websites listing Filipino-made
  fonts serve as the starting shortlist for v1 content. These will be scraped for
  metadata by an agent later, but the actual curation, licensing verification, and
  local installation (for Figma design work and testing) is done by hand. URLs to
  be added here once confirmed.
- **License verification at scale.** Each addition needs a real license check, not
  an assumption. Some "free" fonts online aren't actually openly licensed for
  embedding.
- **Link rot** if any metadata references external creator sites/socials over time
  — low-severity since core assets are self-hosted.
- **Naming.** "tipong-pinoy" is the working name from earlier ecosystem planning —
  confirm before this becomes load-bearing in the repo, domain, and branding.

## 10. Phased Roadmap

The full execution plan lives in `.agents/docs/PHASES.md`. Summary:

- **V1 (Phases 0–6):** Static site with ~10–20 launch fonts, dual preview
  panes with live controls, font detail pages, browse/filter, Tagalog pangram
  default, Geist Sans/Mono UI, deployed to Cloudflare Pages. Manual PR-based
  ingestion. Creator attribution inline on font detail pages (no separate
  creator profile pages in v1).
- **V2 (future):** Creator profile pages, full-text search, better specimen
  views (full charset, pairing suggestions).
- **V3 (future, undecided):** Lightweight submission intake for creators —
  still manually reviewed, never auto-published.

## 11. Security & Access Notes

Documented here so this doesn't get reopened later and turn into unnecessary
devtools-blocking JS.

**Premise.** Every font on this site is under an open license (OFL, Apache 2.0,
or equivalent). That license already grants the legal right to obtain and use the
file — from the creator's own source. A visitor viewing a font file in the Network
tab isn't bypassing a permission this project controls; that permission was
granted by the license before this site existed. "No download feature" is a
product/UX stance (we're not the convenient one-click aggregator), not an access
control problem. It's already solved by not shipping a download button.

**Technical reality.** Any font rendered as real, selectable, accessible
`@font-face` text is, by definition, transmitted to the browser and visible in
devtools. No static-hosting technique changes this. Real access control (e.g.
signed, short-lived URLs the way Adobe Fonts/MyFonts do it) requires a backend
issuing per-session tokens — out of scope for a static, backend-less site, and not
worth adopting given the premise above.

**Adopted (low-cost, worth doing):**
- **Subsetted `.woff2`, no full glyph set.** Primary purpose is repo/bloat
  hygiene (see Section 6); it also happens to mean any inspected file contains
  only the glyphs actually in use, nothing extra.
- **Non-descriptive asset filenames.** Files in `/public/fonts` are stored under
  hashed/generic names (e.g. `f3a9c1.woff2`), not human-readable names like
  `salubong-sans-bold.woff2`. The `fileMap` field in the font data schema (Section
  4) already provides this indirection — the human-readable name lives only in
  the metadata/UI, never in the asset path. This is mild obscurity, not
  protection: a font-identifier browser extension will still resolve the actual
  font family from the rendered `@font-face` name or the glyphs themselves. It's
  adopted because it's free, harmless, and removes the laziest path (a
  self-explanatory filename) without costing UX or dev time — not because it
  meaningfully deters anyone motivated.

**Explicitly rejected (evaluated and out of scope):**
- Disabling right-click / devtools warnings — purely cosmetic, trivially
  bypassed, and actively hostile to legitimate visitors (including fellow devs,
  who are a chunk of this project's actual audience).
- Canvas/SVG-rendered text instead of live `@font-face` — would kill text
  selection, accessibility, and SEO. Bad trade for what's meant to be a
  typography showcase.
- Server-rendered preview images (rasterizing text per request) — the only
  approach that would actually prevent raw file access, but requires a real
  backend/edge function, which contradicts the static-only architecture this
  project is deliberately built around.
