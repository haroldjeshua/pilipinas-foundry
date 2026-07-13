# Build Phases

This document is written for an AI coding agent (Claude Code or equivalent)
executing this project. It is the execution plan; **PROJECT.md** is the spec of
record and **PHILOSOPHY.md** is the design/ethos source of truth. Read both
before Phase 0.

> **Note on numbering:** This document's phase numbers (0–9) are independent
> execution slices. PROJECT.md §10 ("Phased Roadmap") uses its own v1/v2/v3
> grouping — do not confuse the two. When PROJECT.md references "Phases 0–6"
> it means this document's phases 0 through 6 collectively.

## How to work through this document

This is not a one-shot build. It is a sequence of small, independently
verifiable phases, each scoped to fit comfortably in a single working context
so it can be reasoned about, debugged, and reviewed properly before the next
phase begins — the way a senior engineer would actually ship this: thin
vertical increments, checked in and validated, not a single sprawling PR.

**Rules for the agent, every phase:**

1. **Re-read PROJECT.md and PHILOSOPHY.md before starting a phase** if either
   has changed since you last read them. Design and data-model decisions live
   there, not in this file — this file only sequences the work.
2. **Do not start the next phase until the current one is confirmed.** Each
   phase ends with an explicit "Stop and report" step. Summarize what was
   built, what was verified, and any deviations or open questions. Wait for
   the human to say go before continuing — do not assume silence means
   proceed.
3. **Stay inside the phase's stated scope.** If you notice something from a
   later phase is needed early, or something in this phase is expanding
   beyond what's listed, stop and flag it rather than quietly absorbing the
   extra scope. Scope creep inside a phase defeats the entire point of
   phasing this.
4. **Every phase ends in a working, buildable state.** Run typecheck, lint,
   and build before reporting a phase done. A phase that leaves the project
   broken isn't finished, regardless of how much code got written.
5. **Commit at phase boundaries**, not mid-phase. One phase = one logical
   commit (or a small tight series if the phase naturally splits). Commit
   messages should name the phase: `phase-2: font asset pipeline`.
6. **Prefer the boring, explicit solution** over a clever abstraction,
   especially early. This is a small, hand-curated project, not a platform —
   don't build for scale that will never arrive (see PROJECT.md §6 on the
   escape-hatch-not-a-v1-concern principle; the same instinct applies to
   code, not just asset hosting).
7. **When a decision isn't specified in PROJECT.md or PHILOSOPHY.md**, make
   the most restrained, plain choice available and note the assumption in
   the phase report — don't block on it unless it's genuinely load-bearing.

---

## Phase 0 — Project Scaffolding & Tooling

**Goal.** A clean, correctly configured project skeleton. No features yet.
This phase exists so every later phase builds on solid, boring foundations
instead of retrofitting config mid-feature-work.

**In scope:**
- Vite + React + TypeScript (strict mode on — `strict: true`, plus
  `noUncheckedIndexedAccess` and `noImplicitOverride` for extra rigor) project
  init.
- Tailwind installed and configured, with an empty-but-structured token setup
  in the Tailwind config ready to receive PHILOSOPHY.md's palette/type
  decisions in Phase 3 (don't populate real tokens yet — just the shape).
- ESLint + Prettier, configured for React + TS, no warnings on a fresh
  project.
- Folder structure scaffolded (empty or near-empty, with `.gitkeep` where
  needed):
  ```
  src/
    components/
    content/          # font + creator data (Phase 1)
    lib/               # utilities, schema, loaders
    routes/            # or pages/, depending on router choice
    styles/
  public/
    fonts/
  scripts/             # font subsetting / build tooling (Phase 2)
  ```
- Router decision made and installed (React Router is the default choice
  unless PROJECT.md is updated to say otherwise) — but no routes built yet
  beyond a placeholder `/`.
- `README.md` stub: project name, one-line description, how to run dev
  server. Full README content isn't needed yet.
- `.gitignore` covering `_source/` (raw font staging, per PROJECT.md §5) and
  standard Vite/Node ignores.
- Git repo initialized if not already, first commit made.

**Out of scope:** any actual font data, any real UI, any design tokens beyond
placeholder structure.

**Verification:**
- `npm run dev` boots a blank page with no console errors.
- `npm run build` succeeds.
- `npm run lint` and `tsc --noEmit` are both clean.
- Folder structure matches the above.

**Stop and report.** Confirm tooling choices (router, any additional
libraries) before Phase 1, since those are harder to change later.

---

## Phase 1 — Data Layer & Content Schema

**Goal.** The `Font` and `Creator` types and a validated content-loading
mechanism, built and tested against a small set of **placeholder** entries —
not real fonts yet. This phase proves the data model works before any UI or
real content depends on it.

**In scope:**
- Implement the `Font` and `Creator` TypeScript types from PROJECT.md §4
  exactly (or note and justify any deviation in the phase report).
- Runtime validation for content files — use `zod` (or similar) to validate
  `fonts.json`/`creators.json` (or per-entry files, per the decision made
  here) at build/dev time, so a malformed content entry fails loudly and
  early rather than breaking silently in the UI later.
- Decide and implement: single `fonts.json` + `creators.json`, vs. one file
  per font/creator under `src/content/`. Recommendation: per-entry files
  (`src/content/fonts/*.ts` or `.json`) — easier to review in a PR, easier
  for the ingestion workflow in PROJECT.md §5 to stay one-font-per-commit.
  State the choice made.
- 3–4 **placeholder** font entries and 2–3 placeholder creator entries, with
  fake/lorem data and no real font files yet — enough to exercise the loader
  and the relational integrity (every `font.creatorId` resolves to a real
  creator, every `creator.fontIds` resolves to real fonts).
- A small `lib/content.ts` (or similar) exposing typed accessors: `getFonts()`,
  `getFont(id)`, `getCreators()`, `getCreator(id)`, `getFontsByCreator(id)`.
- A basic integrity check (can be a small script or a test) that fails if any
  font references a nonexistent creator or vice versa.

**Out of scope:** real font files, real creator research, any rendering/UI.

**Verification:**
- Loader functions return correctly typed data for the placeholder set.
- Deliberately breaking a reference (bad `creatorId`) causes a clear,
  early failure — not a silent `undefined` deep in a component later.
- `tsc --noEmit`, lint, build all clean.

**Stop and report.** Confirm the file-per-entry vs. single-JSON decision and
the exact type shapes before Phase 2 builds asset tooling against them.

---

## Phase 2 — Font Asset Pipeline

**Goal.** The tooling from PROJECT.md §5 (ingestion workflow) and §11
(hashed filenames), built and proven against the placeholder fonts using
**real, freely-licensed test font files** (e.g. a couple of actual OFL fonts,
not necessarily Filipino-made yet — this phase is about the pipeline
mechanics, not sourcing).

**In scope:**
- A `scripts/subset-font.ts` (or shell script wrapping `pyftsubset`/
  `fonttools`) that takes a raw font file and produces a subsetted `.woff2`
  restricted to Latin + Latin Extended-A.
- A hashing/naming step that outputs the subsetted file under a
  non-descriptive name (e.g. content-hash-based) into `/public/fonts`, and
  writes the resulting path into the relevant font's `fileMap`.
- Wire the raw-source staging convention: script reads from a gitignored
  `_source/` folder, never from anywhere that'd get committed.
- Generate the actual `@font-face` CSS (or a TS module producing equivalent
  styles) from `fonts.json`/content files — one clean place where font
  metadata becomes loadable CSS, not hand-written `@font-face` blocks
  scattered through the app.
- Run this full pipeline against 1–2 real test font files end-to-end:
  raw file in `_source/` → script run → subsetted hashed `.woff2` in
  `/public/fonts` → `@font-face` generated → font actually renders in a
  bare test page.

**Out of scope:** any real preview UI, real Filipino font sourcing (that's
Phase 8), styling of any kind.

**Verification:**
- Running the script on a sample font produces a `.woff2` under a hashed
  filename with a visibly smaller footprint than the source.
- The generated `@font-face` correctly loads and renders the test font in
  a minimal test page.
- Committing the result does **not** include any raw source font file
  (confirm `_source/` is properly ignored).

**Stop and report.** This phase is infrastructure-heavy; flag anything about
the subsetting tool's platform requirements (e.g. Python/fonttools
dependency) that affects how contributors will run this later.

---

## Phase 3 — Design Tokens & Base Layout Shell

**Goal.** Translate PHILOSOPHY.md's visual direction into an actual Tailwind
token set and a small set of foundational UI primitives. No feature screens
yet — this is the design system atoms layer.

**In scope:**
- Populate Tailwind config with the real palette (neutral background/text,
  one restrained accent — per PHILOSOPHY.md §3), spacing scale, and the
  chosen UI typeface: **Geist Sans** for all interface chrome, **Geist Mono**
  for numeric values (weight selectors, size controls, spacing values) — per
  PROJECT.md §3 and PHILOSOPHY.md §3.
- Base layout shell: header/nav (minimal), content container, footer —
  styled per the "editorial, generous whitespace, hairline rules" direction.
  No real pages behind it yet, just the shell rendered at `/`.
- A handful of base primitives likely to be reused everywhere: `Button`,
  `Select`, `Slider` (for the size/tracking/leading controls coming in
  Phase 4), `ColorInput`. Build these plain and functional — this is
  scaffolding for Phase 4, not a component showcase.
- Verify base accessibility: visible keyboard focus states on every
  primitive built here (per PHILOSOPHY.md's quality floor — don't defer
  this to a "polish phase," bake it in from the first component).

**Out of scope:** the actual font preview feature, routing to real pages
beyond the shell.

**Verification:**
- Visual check against PHILOSOPHY.md §3 — does it read calm/plain/editorial,
  or does it default toward one of the generic AI-design tells it explicitly
  rejects (warm cream + terracotta, near-black + acid accent, broadsheet
  columns used decoratively)? Is Geist Sans used for all interface text and
  Geist Mono for numeric values? Self-critique against this before reporting.
- Keyboard-only navigation reaches and operates every primitive built.
- Responsive check at mobile width — shell doesn't break.

**Stop and report.** Show the token choices explicitly (palette hex values,
typeface names) — this is the phase most worth a human eyeballing before
more UI gets built on top of it.

---

## Phase 4 — Core Preview Feature

**Goal.** The primary interaction: dual heading/body font preview with live
controls. This is the heart of the product — get this right in isolation
before adding routing, browsing, or secondary pages around it.

**In scope:**
- Two independent preview panes (heading font, body font), each with its own
  font selector drawing from Phase 1's content layer.
- Per-pane controls: weight (from the font's declared `weights`), size,
  color, letter-spacing, line-height — using the primitives from Phase 3.
- Editable preview text input, with Tagalog pangram as the default. A
  settings dialog toggle switches to English pangram — per PROJECT.md §7 and
  PHILOSOPHY.md §3.
- Lazy-load font files: only load the `.woff2` for a font once it's actually
  selected in a pane, not all fonts upfront (performance principle from
  PROJECT.md, worth implementing now rather than retrofitting later).
- This lives at the root route (`/`) for now — it's the whole app at this
  point.

**Out of scope:** font detail pages, creator pages, browse/filter — this
phase is the single-screen core experience only.

**Verification:**
- Selecting a font in either pane correctly loads and renders it, and
  correctly does *not* eagerly load fonts that haven't been selected
  (check the network tab).
- Tagalog pangram is the default preview text in both panes; switching to
  English via the settings dialog works and persists during the session.
- All controls behave correctly across the placeholder font set from Phase 1
  (or the real test fonts from Phase 2, whichever are wired in by now).
- Reduced-motion and keyboard operability hold up under real use, not just
  the primitive-level check from Phase 3.
- Self-critique against PHILOSOPHY.md §2 — does this feel like a
  well-made instrument, or does any control feel like decoration bolted on?

**Stop and report.** This is the phase most worth actually using by hand
before proceeding — flag anything that felt clunky to operate.

---

## Phase 5 — Font Detail Pages

**Goal.** Give every font a real, linkable page with full specimen, license
info, and creator credit. This is where the "spotlight on who made it"
differentiator (PROJECT.md §1, §4) becomes visible.

**In scope:**
- Routing: `/fonts/:id`.
- Font detail page: full specimen across declared weights/styles, license +
  license link, source link, and creator credit (name + link inline — not a
  separate profile page, per PROJECT.md §7 v1 scope).
- Link from the Phase 4 preview panes to a font's detail page (e.g. font
  name in the selector links out, or a small "view specimen" affordance).

**Out of scope:** creator profile pages (deferred to v2 per PROJECT.md §10),
browse/filter grid (Phase 6).

**Verification:**
- Every placeholder/test font resolves to a working page with no broken
  links — font detail page links to creator credit, creator credit is
  factual and plain per PHILOSOPHY.md §6.
- Content voice check against PHILOSOPHY.md §6: descriptions read factual
  and plain, not narrativized or marketing-toned (this matters even with
  placeholder copy — set the pattern now).

**Stop and report.** Flag if any content field from Phase 1's schema turned
out to be missing once real pages needed it (e.g. wanting a font's release
year) — better to amend the schema now than after real content ingestion.
Also flag if creator profile pages feel necessary to add to v1 after building
the inline credit system.

---

## Phase 6 — Browse & Filter

**Goal.** A way to see the whole library at a glance, not just arrive at a
specific font directly.

**In scope:**
- A grid/list view at e.g. `/fonts`, showing all fonts with enough per-item
  info to be useful (name, creator, category) without being a dense wall.
- Filter by category (sans/serif/display/script/monospace per the schema).
- Optional: filter or link by creator.
- Keep density and pacing per PHILOSOPHY.md §3 — "denser but still calm,"
  not a cramped card grid.

**Out of scope:** full-text search (only add if PROJECT.md is updated to
call for it — not currently in v1 scope per PROJECT.md §7/§10).

**Verification:**
- Filtering behaves correctly against the test content set.
- Visual density self-check against PHILOSOPHY.md before reporting.

**Stop and report.** Straightforward phase — flag only if filter UX
decisions weren't obvious from spec and needed a judgment call.

---

## Phase 7 — Polish Pass: Accessibility, Responsiveness, Performance

**Goal.** A dedicated pass across the whole app so far, treating quality-floor
items as first-class work, not an afterthought — per PHILOSOPHY.md and the
frontend quality floor (keyboard focus, reduced motion, responsive down to
mobile).

**In scope:**
- Full keyboard-navigation audit across every screen built so far (Phases
  3–6), not just the primitives in isolation.
- `prefers-reduced-motion` respected everywhere motion was used — and confirm
  that only CSS transitions/utilities were used (no JS animation runtime
  unless justified, per PHILOSOPHY.md §2).
- Responsive audit at mobile width across every screen — the dual-pane
  preview in particular needs a real mobile layout decision (stacked panes,
  most likely), not just a squeeze.
- Color contrast check against the Phase 3 palette (WCAG AA at minimum for
  body text).
- Confirm no descriptive font filenames leaked into the build output — all
  font files in the production build should be hashed/generic names per
  PROJECT.md §11. Check `/public/fonts` output and any `@font-face` URLs
  in the built CSS.
- Empty/error states written per PHILOSOPHY.md §6 voice (plain, factual, no
  apology) wherever they were skipped or stubbed earlier — e.g. "no fonts
  match this filter."
- Performance check: confirm lazy font loading (Phase 4) is still correctly
  scoped as pages/routes were added, and that route-level code splitting is
  in place if the router supports it easily.

**Out of scope:** new features. This phase should not introduce new user-
facing capability, only harden what exists.

**Verification:**
- Lighthouse (or equivalent) pass on the core preview page and the browse
  page — accessibility and performance scores noted in the phase report.
- Manual keyboard-only walkthrough of the entire app.

**Stop and report.** Note any accessibility or performance issue that
couldn't be fully resolved without a design change, and flag it back against
PHILOSOPHY.md/PROJECT.md rather than quietly patching around it.

---

## Phase 8 — Real Content Ingestion

**Goal.** Replace placeholder/test content with real, vetted Filipino type
designers and their fonts, following the ingestion workflow in PROJECT.md
§5 exactly.

**Note on this phase's nature:** unlike Phases 0–7, this phase is
research-and-curation-heavy, not build-heavy. The agent's role here is to
execute the *mechanical* steps of the pipeline (subsetting, hashing, schema
entry, integrity checks) once a font and its licensing/creator consent are
confirmed by the human — sourcing and creator outreach is human judgment
work per PROJECT.md §5 step 1–2, not something to automate or assume.

**In scope (per font, repeating the Phase 2 pipeline for real content):**
- Confirm license and source per PROJECT.md §5 steps 1–3 (human-provided
  input; agent should ask for this if not given).
- Run the Phase 2 pipeline: subset, hash, place in `/public/fonts`.
- Add/update the font and creator content entries (Phase 1 schema).
- Verify integrity checks (Phase 1) still pass with real content.
- Verify render (font detail page, preview panes) with the real font.

**Out of scope:** any new features or schema changes not already established.
If real content surfaces a genuine schema gap, flag it rather than silently
extending the schema mid-ingestion.

**Verification:**
- Each added font renders correctly across all existing screens (preview,
  detail, browse).
- No raw source files committed (recheck `_source/` hygiene per real files,
  not just test files).

**Stop and report** after each meaningful batch (not necessarily every
single font) — this phase will likely span multiple sessions as sourcing
happens outside the agent's scope.

---

## Phase 9 — Pre-Launch QA & Deploy

**Goal.** Ship it.

**In scope:**
- Full build verification (`build`, `lint`, `tsc --noEmit`) clean on the
  real-content state of the app.
- Full manual pass through every screen with real content — this is
  different from Phase 7's audit because real font names, real bios, and
  real license text can surface issues placeholder content couldn't.
- License/attribution audit: every live font has correct, visible license
  info and correct creator credit — this is a hard requirement, not a nice-
  to-have (PROJECT.md §2).
- Deploy configuration for Cloudflare Pages — confirm build settings, output
  directory, and any header/redirect rules needed.
- Final `README.md`: real project description, setup instructions, and a
  short note on the ingestion workflow for future contributions (linking to
  PROJECT.md §5 rather than duplicating it).
- Confirm the project name/domain decision (still open per PROJECT.md §9)
  is resolved before this ships publicly.

**Verification:**
- Production build deployed to a preview URL, walked through end-to-end.
- Lighthouse pass on the deployed (not just local) build.

**Stop and report.** This is the last gate before anything goes live —
explicit human sign-off expected here regardless of how clean the checks
come back.
