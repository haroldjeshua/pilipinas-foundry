import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useFontToolbar, cardDefaults } from "./font-toolbar-context";
import { TAGALOG_PANGRAMS, ENGLISH_PANGRAMS } from "./font-pangrams";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

function randomFrom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export default function FontToolbar() {
  const { activeFontId, cards, update, reset, dismiss, setText } =
    useFontToolbar();

  if (!activeFontId) return null;

  const state = cards.get(activeFontId) ?? cardDefaults;

  const weightOptions = state.availableWeights.map((w) => ({
    value: String(w),
    label: String(w),
  }));

  return (
    <div
      role="toolbar"
      aria-label="Font controls"
      onMouseDown={(e) => {
        // Allow native <select> to handle its own mousedown
        const target = e.target as HTMLElement;
        if (target.tagName === "SELECT") return;
        e.preventDefault();
      }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-border bg-background/95 p-2 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center gap-4 justify-center">
        {/* Weight — native select for reliability */}
        <div className="flex w-18 flex-col">
          <Select
            options={weightOptions}
            value={String(state.weight)}
            onChange={(e) => update("weight", Number(e.target.value))}
            className="h-8 text-xs"
          />
        </div>

        {/* Size */}
        <div className="flex min-w-30 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Size
            </Label>
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              {state.size}px
            </span>
          </div>
          <Slider
            min={8}
            max={160}
            step={1}
            value={[state.size]}
            onValueChange={(v) => update("size", Array.isArray(v) ? v[0]! : v)}
          />
        </div>

        {/* Tracking */}
        <div className="flex min-w-30 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Tracking
            </Label>
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              {state.tracking > 0 ? "+" : ""}
              {state.tracking.toFixed(2)}em
            </span>
          </div>
          <Slider
            min={-0.05}
            max={0.2}
            step={0.005}
            value={[state.tracking]}
            onValueChange={(v) =>
              update("tracking", Array.isArray(v) ? v[0]! : v)
            }
          />
        </div>

        {/* Leading */}
        <div className="flex min-w-30 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Leading
            </Label>
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              {state.leading.toFixed(1)}
            </span>
          </div>
          <Slider
            min={0.5}
            max={3}
            step={0.1}
            value={[state.leading]}
            onValueChange={(v) =>
              update("leading", Array.isArray(v) ? v[0]! : v)
            }
          />
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-border" />

        {/* Pangram toggle */}
        <div className="flex gap-1">
          <Button
            variant={state.pangramLang === "en" ? "default" : "outline"}
            size="xs"
            onClick={() => {
              update("pangramLang", "en");
              setText(randomFrom(ENGLISH_PANGRAMS));
            }}
          >
            EN
          </Button>
          <Button
            variant={state.pangramLang === "tl" ? "default" : "outline"}
            size="xs"
            onClick={() => {
              update("pangramLang", "tl");
              setText(randomFrom(TAGALOG_PANGRAMS));
            }}
          >
            TL
          </Button>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-border" />

        {/* Reset + Dismiss */}
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={reset}>
            Reset
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={dismiss}
            aria-label="Dismiss toolbar"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
}
