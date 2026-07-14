import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ListViewIcon } from "@hugeicons/core-free-icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFonts } from "@/lib/content";
import FontGridItem from "./font-grid-item";
import { Logo } from "../logo";

const allFonts = getFonts();

const categories = [
  "all",
  "sans",
  "serif",
  "display",
  "script",
  "monospace",
] as const;

type Category = (typeof categories)[number];

const categoryLabels: Record<Category, string> = {
  all: "All",
  sans: "Sans",
  serif: "Serif",
  display: "Display",
  script: "Script",
  monospace: "Mono",
};

type ViewMode = "grid" | "stack";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filtered =
    activeCategory === "all"
      ? allFonts
      : allFonts.filter((f) => f.category === activeCategory);

  return (
    <>
      {/* ─── Hero ─── */}
			<section className="flex min-h-[60svh] flex-col items-center justify-center text-center">
				<Logo className="mb-4" />
        <h1 className="text-balance text-5xl font-bold tracking-tighter text-foreground sm:text-7xl">
          pilipinas-foundry
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          A specimen library of free, open-license typefaces by Filipino type
          designers
        </p>
      </section>

      {/* ─── Browse ─── */}
      <section aria-label="Browse fonts" className="flex flex-col gap-6">
        {/* Toolbar: filter chips + view tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category filter chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {categoryLabels[cat]}
                {cat !== "all" && (
                  <span className="ml-1 font-mono text-[10px] tabular-nums opacity-60">
                    {allFonts.filter((f) => f.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* View toggle tabs */}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <TabsList variant="default">
              <TabsTrigger value="grid">
                <HugeiconsIcon
                  icon={GridViewIcon}
                  size={14}
                  strokeWidth={1.5}
                />
              </TabsTrigger>
              <TabsTrigger value="stack">
                <HugeiconsIcon
                  icon={ListViewIcon}
                  size={14}
                  strokeWidth={1.5}
                />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Font grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid gap-2 sm:grid-cols-2"
              : "grid gap-2 grid-cols-1"
          }
        >
          {filtered.map((font) => (
            <FontGridItem key={font.id} font={font} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No fonts match this filter.
          </p>
        )}
      </section>
    </>
  );
}
