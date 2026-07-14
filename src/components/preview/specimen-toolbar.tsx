import { useState, useCallback, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings05Icon,
  Cancel01Icon,
  AlignHorizontalSpaceBetweenIcon,
  AlignVerticalSpaceBetweenIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  TAGALOG_PANGRAMS,
  ENGLISH_PANGRAMS,
} from "@/components/home/font-pangrams";

function randomFrom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

interface SpecimenToolbarProps {
  weights: number[];
  onStateChange: (state: SpecimenState) => void;
  onPreviewTextChange?: (text: string) => void;
}

export interface SpecimenState {
  weight: number;
  italic: boolean;
  size: number;
  tracking: number;
  leading: number;
  bgColor: string;
  fgColor: string;
}

const defaults: SpecimenState = {
  weight: 400,
  italic: false,
  size: 64,
  tracking: 0,
  leading: 1.3,
  bgColor: "#ffffff",
  fgColor: "#0a0a0a",
};

export default function SpecimenToolbar({
  weights,
  onStateChange,
  onPreviewTextChange,
}: SpecimenToolbarProps) {
  const [open, setOpen] = useState(true);
  const [layout, setLayout] = useState<"horizontal" | "vertical">("vertical");
  const [state, setState] = useState<SpecimenState>({
    ...defaults,
    weight: weights[0] ?? 400,
  });
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const [fgPickerOpen, setFgPickerOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bgPickerRef = useRef<HTMLDivElement>(null);
  const fgPickerRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    <K extends keyof SpecimenState>(key: K, value: SpecimenState[K]) => {
      setState((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "weight" && !weights.includes(value as number)) {
          next.weight = weights[0] ?? 400;
        }
        return next;
      });
    },
    [weights],
  );

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  const dismiss = useCallback(() => setOpen(false), []);

  const reset = useCallback(() => {
    setState({
      ...defaults,
      weight: weights[0] ?? 400,
    });
    onPreviewTextChange?.(randomFrom(TAGALOG_PANGRAMS));
  }, [weights, onPreviewTextChange]);

  const shufflePangram = useCallback(
    (lang: "en" | "tl") => {
      const pool = lang === "en" ? ENGLISH_PANGRAMS : TAGALOG_PANGRAMS;
      onPreviewTextChange?.(randomFrom(pool));
    },
    [onPreviewTextChange],
  );

  const weightOptions = weights.map((w) => ({
    value: String(w),
    label: String(w),
  }));

  const isVertical = layout === "vertical";

  // Close color pickers on outside click
  useEffect(() => {
    if (!bgPickerOpen && !fgPickerOpen) return;
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (bgPickerRef.current?.contains(target)) return;
      if (fgPickerRef.current?.contains(target)) return;
      setBgPickerOpen(false);
      setFgPickerOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [bgPickerOpen, fgPickerOpen]);

  return (
    <>
      {/* Trigger */}
      <Button
        ref={triggerRef}
        variant={open ? "default" : "ghost"}
        size="icon-lg"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle font controls"
      >
        <HugeiconsIcon icon={Settings05Icon} size={24} strokeWidth={1.5} />
      </Button>

      {/* Toolbar panel */}
      {open && (
        <div
          ref={panelRef}
          role="toolbar"
          aria-label="Font controls"
          onMouseDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "SELECT") return;
            e.preventDefault();
          }}
          className={`absolute top-full right-0 z-50 mt-2 rounded-2xl border border-border bg-background/95 p-3 shadow-xl backdrop-blur-md ${
            isVertical ? "w-70" : "w-160"
          }`}
        >
          {/* Panel header — layout toggle + dismiss */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Font controls
            </span>
            <div className="flex gap-1">
              <Button
                variant={!isVertical ? "default" : "ghost"}
                size="icon-xs"
                onClick={() => setLayout("horizontal")}
                aria-label="Horizontal layout"
              >
                <HugeiconsIcon
                  icon={AlignHorizontalSpaceBetweenIcon}
                  size={12}
                  strokeWidth={2}
                />
              </Button>
              <Button
                variant={isVertical ? "default" : "ghost"}
                size="icon-xs"
                onClick={() => setLayout("vertical")}
                aria-label="Vertical layout"
              >
                <HugeiconsIcon
                  icon={AlignVerticalSpaceBetweenIcon}
                  size={12}
                  strokeWidth={2}
                />
              </Button>
              <div className="h-6 w-px bg-border" />
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={dismiss}
                aria-label="Dismiss toolbar"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={12}
                  strokeWidth={2}
                />
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div
            className={
              isVertical
                ? "flex flex-col gap-3"
                : "flex flex-wrap items-center gap-3"
            }
          >
            {/* Weight + Italic — equal columns in vertical */}
            {isVertical ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Weight
                  </Label>
                  <Select
                    options={weightOptions}
                    value={String(state.weight)}
                    onChange={(e) =>
                      update("weight", Number(e.target.value))
                    }
                    className="h-7 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Italic
                  </Label>
                  <Button
                    variant={state.italic ? "default" : "outline"}
                    size="xs"
                    className="h-7 w-full"
                    onClick={() => update("italic", !state.italic)}
                    disabled={!weights.length}
                  >
                    {state.italic ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex w-20">
                  <Select
                    options={weightOptions}
                    value={String(state.weight)}
                    onChange={(e) =>
                      update("weight", Number(e.target.value))
                    }
                    className="h-7 text-xs"
                  />
                </div>
                <Button
                  variant={state.italic ? "default" : "outline"}
                  size="xs"
                  onClick={() => update("italic", !state.italic)}
                  disabled={!weights.length}
                >
                  Italic
                </Button>
              </div>
            )}

            {/* Size */}
            <div
              className={`flex flex-col gap-1 ${
                isVertical ? "w-full" : "min-w-32 flex-1"
              }`}
            >
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
                max={200}
                step={1}
                value={[state.size]}
                onValueChange={(v) =>
                  update("size", Array.isArray(v) ? v[0]! : v)
                }
              />
            </div>

            {/* Tracking */}
            <div
              className={`flex flex-col gap-1 ${
                isVertical ? "w-full" : "min-w-32 flex-1"
              }`}
            >
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
            <div
              className={`flex flex-col gap-1 ${
                isVertical ? "w-full" : "min-w-32 flex-1"
              }`}
            >
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
            <div
              className={
                isVertical ? "h-px w-full bg-border" : "h-8 w-px bg-border"
              }
            />

            {/* BG Color — light | dark | custom */}
            <div className="flex flex-col gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              	Background
              </Label>
              <div className="flex items-center gap-1">
                <Button
                  variant={state.bgColor === "#ffffff" ? "default" : "outline"}
                  size="xs"
                  onClick={() => {
                    update("bgColor", "#ffffff");
                    setBgPickerOpen(false);
                  }}
                >
                  Light
                </Button>
                <Button
                  variant={state.bgColor === "#18181b" ? "default" : "outline"}
                  size="xs"
                  onClick={() => {
                    update("bgColor", "#18181b");
                    setBgPickerOpen(false);
                  }}
                >
                  Dark
                </Button>
                <div className="relative size-6" ref={bgPickerRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setFgPickerOpen(false);
                      setBgPickerOpen((o) => !o);
                    }}
                    className="size-6 cursor-pointer rounded-md border border-border p-0"
                    aria-label="Custom background color"
                  >
                    <span
                      className="block size-full rounded-sm"
                      style={{ backgroundColor: state.bgColor }}
                    />
                  </button>
                  <input
                    type="color"
                    value={state.bgColor}
                    onChange={(e) => update("bgColor", e.target.value)}
                    className="pointer-events-none absolute inset-0 opacity-0"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  {bgPickerOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1">
                      <HexColorPicker
                        color={state.bgColor}
                        onChange={(c) => update("bgColor", c)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FG Color — light | dark | custom */}
            <div className="flex flex-col gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Foreground
              </Label>
              <div className="flex items-center gap-1">
                <Button
                  variant={state.fgColor === "#fafafa" ? "default" : "outline"}
                  size="xs"
                  onClick={() => {
                    update("fgColor", "#fafafa");
                    setFgPickerOpen(false);
                  }}
                >
                  Light
                </Button>
                <Button
                  variant={state.fgColor === "#0a0a0a" ? "default" : "outline"}
                  size="xs"
                  onClick={() => {
                    update("fgColor", "#0a0a0a");
                    setFgPickerOpen(false);
                  }}
                >
                  Dark
                </Button>
                <div className="relative size-6" ref={fgPickerRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setBgPickerOpen(false);
                      setFgPickerOpen((o) => !o);
                    }}
                    className="size-6 cursor-pointer rounded-md border border-border p-0"
                    aria-label="Custom text color"
                  >
                    <span
                      className="block size-full rounded-sm"
                      style={{ backgroundColor: state.fgColor }}
                    />
                  </button>
                  <input
                    type="color"
                    value={state.fgColor}
                    onChange={(e) => update("fgColor", e.target.value)}
                    className="pointer-events-none absolute inset-0 opacity-0"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  {fgPickerOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1">
                      <HexColorPicker
                        color={state.fgColor}
                        onChange={(c) => update("fgColor", c)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div
              className={
                isVertical ? "h-px w-full bg-border" : "h-8 w-px bg-border"
              }
            />

            {/* Pangram toggle */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="xs"
                onClick={() => shufflePangram("en")}
              >
                EN
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => shufflePangram("tl")}
              >
                TL
              </Button>
            </div>

            {/* Separator */}
            <div
              className={
                isVertical ? "h-px w-full bg-border" : "h-8 w-px bg-border"
              }
            />

            {/* Reset */}
            <Button variant="ghost" size="xs" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
