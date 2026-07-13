# Philosophy

Part of the Pilipinas Interface ecosystem. This document is the ethos behind
pilipinas-foundry — why it's built the way it's built, and the visual
and editorial line it should never cross.

## 1. Manifesto

Type design is quiet, disciplined work, and it deserves a viewer that treats it
the same way.

This project exists because Filipino type designers are making genuinely good,
freely licensed work, and there's no place that puts it in front of people the
way a well-made specimen tool does. Not a marketplace. Not a download hub. A
place to look closely at letterforms, try them against real text, and know who
made them.

The site itself should never compete with the fonts it's showing. Its job is to
get out of the way. If someone remembers the interface more than the typefaces,
the interface has failed.

## 2. Design Principles

**Typography is the product — everything else is scaffolding.** The UI's own
type choices, spacing, and layout exist to present other people's typefaces
clearly. This isn't a place to also showcase a bold display face or a clever
type pairing of our own — the specimen fonts already do that job. The site's UI
face should be quiet enough to disappear: a well-set, workmanlike sans or a
neutral system stack. Restraint here isn't a limitation, it's the actual design
decision.

**Calm over clever.** No hero animation sequence, no scroll-triggered reveals,
no "wow" moment on load. The most characteristic thing in this subject's world
is legible, well-proportioned type sitting still on a page — so that's the
opening move, not a device to get past on the way to it.

**Plain, not sparse.** Minimal doesn't mean empty. Precision in spacing,
alignment, and a real type scale matters more here than in a maximalist design,
because there's nowhere to hide an imprecise margin. Every control (size, color,
tracking, leading) should feel like a well-made instrument, not a decorative
slider.

**Structure encodes real information, or it doesn't exist.** No numbered
markers, no manufactured "01 / 02 / 03" unless something is genuinely sequential.
A category label, a weight indicator, a license badge — these earn their place
because they tell the visitor something true and needed, not because a section
felt bare.

**Motion, if any, is functional.** A weight slider updating live, a smooth
crossfade when swapping fonts, a subtle focus state — yes. An orchestrated
page-load animation or ambient particle effects — no. If it doesn't help someone
evaluate a typeface faster or more clearly, cut it. Prefer CSS transitions and
Tailwind animation utilities over heavier JS animation libraries — the
interaction surface here is small (font selectors, sliders, dropdowns) and
doesn't warrant a runtime dependency. motion.dev (formerly framer-motion) is not
off the table if a specific need justifies it, but the default is CSS.

**One quiet signature, not a spectacle.** Even a calm design can have a single
considered, memorable detail — how a font's name and creator sit in the homepage
grid, how the specimen page frames the preview area, the transition from grid
to specimen. Spend the one allowed flourish there, and nowhere else.

## 3. Visual Direction

**Palette.** Neutral and print-inspired: near-white or off-white background,
near-black or dark charcoal text, one restrained accent used sparingly (for
active states, links, selected controls) — not a brand-forward color story.
The palette's job is to never distract from whatever typeface is currently
loaded into the preview panes, which will themselves introduce color through
user-selected text color.

**Layout.** Editorial, generous whitespace, a clear grid. Two distinct layouts
serve two distinct jobs:
- *Homepage grid*: fonts presented at large sizes with clear name/creator credit,
  each linking to its specimen. Dense enough to browse, calm enough to scan —
  think Open Foundry's homepage. Consistent spacing, no visual noise between
  specimens.
- *Specimen page*: full-width, unhurried, the font doing all the work. Weight
  listing, license info, creator credit, interactive preview controls. Think
  type-foundry specimen sheet or a well-set print catalog, not a SaaS landing
  page.

Hairline rules over heavy borders. Zero unnecessary card shadows or gradients —
those read as decoration competing with the type itself.

**The UI typeface(s).** Geist Sans for all interface chrome — navigation,
buttons, captions, creator credits. Geist Mono for numeric values (weight
selectors, size controls, spacing values). These are quiet, well-made, and
neutral enough to disappear behind the specimen fonts being previewed. Never a
second "personality" display face for the UI itself; the personality on this
site comes exclusively from the fonts being previewed.

**Density and pacing.** Uncrowded. The homepage grid is denser than the specimen
page but still calm — consistent spacing units, no visual noise between specimens.
The specimen page is one font in focus at a time, with generous whitespace
around the preview area and specimen details. Both layouts should feel unhurried.

**Preview text.** Tagalog pangram as the default preview text in both panes.
An English pangram is available via a settings dialog toggle — the Tagalog
default is a quiet signal of who this project is for, not a statement that
English isn't welcome.

## 4. Inspiration

- **[Open Foundry](https://open-foundry.com/)** — primary visual and structural
  reference. The homepage grid (fonts at large sizes, name + creator, "Explore"
  links), the specimen page layout (weight listing, license/creator metadata,
  editorial pacing), the restrained palette, the confidence to let typography
  fill the frame. What to take: the layout structure, the editorial tone, the
  whitespace, the way fonts are presented as the hero content.
- **[Google Fonts Preview by Tomoya Okada](https://fonts.tomoyaokada.com/)** —
  primary interaction reference for the font specimen page: dual heading/body
  pickers, live style controls, plain background, typography doing all the work.
  What to take: the restraint, the directness, the confidence to leave the UI
  nearly invisible. This interaction lives on `/fonts/{font-name}`, not the
  homepage.
- Type-foundry specimen pages generally (the way independent foundries present
  their own release specimens) — calm, print-inspired, unhurried.
- What **not** to take: anything that reads as "trying." No AI-generated-design
  tells — no warm cream background with a terracotta accent, no near-black page
  with a single acid accent color, no broadsheet-newspaper columns adopted just
  because they look considered. If a direction reads generic-impressive rather
  than specific to this project, it's the wrong direction, however polished.

## 5. What We Avoid

- Baybayin, decorative Tagalog phrasing, or any "cultural" visual flourish
  layered onto the UI. The Filipino identity of this project lives entirely in
  *who is featured*, never in surface decoration. (Restated from PROJECT.md
  because it's a design principle as much as a curation one.)
- English as the default preview language — Tagalog pangram is the default;
  English is the toggle, not the other way around. (Per PROJECT.md §7.)
- Gradients, glassmorphism, drop shadows, or glow effects used as default
  polish rather than a deliberate choice.
- Scroll-jacking, parallax, or elaborate load sequences.
- A UI display face with strong personality — that role belongs to the fonts
  being previewed, not to the chrome around them.
- Marketing voice in copy. No "discover," "unlock," "elevate." Plain, factual,
  active-voice copy: describe what a control does, credit who made a font,
  move on.

## 6. Content Voice

Creator bios and font descriptions are factual and respectful, not narrativized
on their behalf — describe what's known (their name, their font, their license,
their links), not an invented story about their craft or motivations unless
they've shared it themselves. Empty states and errors speak plainly: what
happened, what to do next, no apology, no forced personality. The interface
should sound like a well-made tool, not a brand voice.

## 7. Closing

If this site gets one thing right, it should be this: a Filipino type
designer's work gets to be seen clearly, credited properly, and left alone to
speak for itself. Everything in this document exists to protect that.
