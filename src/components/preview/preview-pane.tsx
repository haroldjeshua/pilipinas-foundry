import { useState, type ChangeEvent } from "react";
import { useFontFace } from "@/hooks/use-font-face";
import { getFonts } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PaneState {
  fontId: string;
  weight: number;
  size: number;
  color: string;
  letterSpacing: number;
  lineHeight: number;
}

interface PreviewPaneProps {
  label: string;
  previewText: string;
  initialState?: Partial<PaneState>;
}

const allFonts = getFonts();

const defaultState: PaneState = {
  fontId: allFonts[0]?.id ?? "",
  weight: 400,
  size: 32,
  color: "#0a0a0a",
  letterSpacing: 0,
  lineHeight: 1.4,
};

export default function PreviewPane({
  label,
  previewText,
  initialState,
}: PreviewPaneProps) {
  const [state, setState] = useState<PaneState>({
    ...defaultState,
    ...initialState,
  });

  const font = allFonts.find((f) => f.id === state.fontId) ?? allFonts[0];
  useFontFace(font, state.weight);

  const availableWeights = font?.weights ?? [400];

  function update<K extends keyof PaneState>(key: K, value: PaneState[K]) {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      // Reset weight if it's not available in the new font
      if (key === "fontId") {
        const newFont = allFonts.find((f) => f.id === value);
        if (newFont && !newFont.weights.includes(prev.weight)) {
          next.weight = newFont.weights[0] ?? 400;
        }
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Pane label */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>

      {/* Font selector */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Font</Label>
        <select
          value={state.fontId}
          onChange={(e) => update("fontId", e.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {allFonts.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Weight selector */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Weight</Label>
        <div className="flex gap-1">
          {availableWeights.map((w) => (
            <Button
              key={w}
              variant={state.weight === w ? "default" : "outline"}
              size="sm"
              onClick={() => update("weight", w)}
              className="font-mono text-xs tabular-nums"
            >
              {w}
            </Button>
          ))}
        </div>
      </div>

      {/* Size slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {state.size}px
          </span>
        </div>
        <Slider
          min={12}
          max={120}
          step={1}
          value={state.size}
          label="Font size"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            update("size", Number(e.target.value))
          }
        />
      </div>

      {/* Color */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={state.color}
            onChange={(e) => update("color", e.target.value)}
            aria-label="Text color"
            className="size-8 cursor-pointer appearance-none rounded-md border border-border p-0 [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
          />
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {state.color}
          </span>
        </div>
      </div>

      {/* Letter spacing */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Tracking</Label>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {state.letterSpacing > 0 ? "+" : ""}
            {state.letterSpacing.toFixed(1)}em
          </span>
        </div>
        <Slider
          min={-0.05}
          max={0.2}
          step={0.01}
          value={state.letterSpacing}
          label="Letter spacing"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            update("letterSpacing", Number(e.target.value))
          }
        />
      </div>

      {/* Line height */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Leading</Label>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {state.lineHeight.toFixed(1)}
          </span>
        </div>
        <Slider
          min={0.8}
          max={3}
          step={0.1}
          value={state.lineHeight}
          label="Line height"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            update("lineHeight", Number(e.target.value))
          }
        />
      </div>

      {/* Preview area */}
      <div
        className="mt-2 min-h-[200px] rounded-lg border border-border bg-background p-6"
        style={{
          fontFamily: `"${font?.name ?? "sans-serif"}"`,
          fontWeight: state.weight,
          fontSize: `${state.size}px`,
          color: state.color,
          letterSpacing: `${state.letterSpacing}em`,
          lineHeight: state.lineHeight,
        }}
      >
        <textarea
          value={previewText}
          readOnly
          aria-label={`${label} preview text`}
          className="h-full min-h-[180px] w-full resize-none bg-transparent text-inherit focus:outline-none"
          style={{
            fontFamily: "inherit",
            fontWeight: "inherit",
            fontSize: "inherit",
            color: "inherit",
            letterSpacing: "inherit",
            lineHeight: "inherit",
          }}
        />
      </div>
    </div>
  );
}
