import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useFontFace } from "@/hooks/use-font-face";
import { getCreator } from "@/lib/content";
import { Button } from "@/components/ui/button";
import {
  useFontToolbar,
  setTextRef,
  cardDefaults,
} from "./font-toolbar-context";
import type { Font } from "@/lib/schema";

type CardTheme = "light" | "dark" | "blue" | "red" | "yellow";

const cardStyles: Record<CardTheme, string> = {
  light: "bg-white text-zinc-900 border-zinc-200",
  dark: "bg-zinc-900 text-zinc-50 border-zinc-800",
  blue: "bg-[oklch(0.50_0.14_260)] text-white border-transparent",
  red: "bg-[oklch(0.52_0.19_25)] text-white border-transparent",
  yellow: "bg-[oklch(0.82_0.16_100)] text-zinc-900 border-transparent",
};

const swatchStyles: Record<CardTheme, string> = {
  light: "bg-white ring-zinc-300",
  dark: "bg-zinc-900 ring-zinc-700",
  blue: "bg-[oklch(0.50_0.14_260)] ring-[oklch(0.50_0.14_260)]",
  red: "bg-[oklch(0.52_0.19_25)] ring-[oklch(0.52_0.19_25)]",
  yellow: "bg-[oklch(0.82_0.16_100)] ring-[oklch(0.82_0.16_100)]",
};

interface FontGridItemProps {
  font: Font;
}

export default function FontGridItem({ font }: FontGridItemProps) {
  const defaultWeight = font.weights[0] ?? 400;
  useFontFace(font, defaultWeight);

  const creator = getCreator(font.creatorId);
  const [cardTheme, setCardTheme] = useState<CardTheme>("light");
  const [previewText, setPreviewText] = useState(font.name);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { activeFontId, cards, activate, dismiss } = useFontToolbar();

  const isActive = activeFontId === font.id;
  const cardState = cards.get(font.id) ?? cardDefaults;

  // Register setText callback for pangram updates
  useEffect(() => {
    if (isActive) {
      setTextRef.current = setPreviewText;
    }
  }, [isActive, setPreviewText]);

  const handleFocus = useCallback(() => {
    activate(font.id, font.weights);
  }, [font.id, font.weights, activate]);

  // Auto-dismiss: close toolbar when clicking outside both textarea and toolbar
  const handleBlur = useCallback(() => {
    // Delay to allow toolbar clicks and textarea-to-textarea transitions to register
    setTimeout(() => {
      const focused = document.activeElement;
      const isTextarea = focused instanceof HTMLTextAreaElement;
      const lostFromCard = !cardRef.current?.contains(focused);
      const lostFromToolbar = !document
        .querySelector("[role=toolbar]")
        ?.contains(focused);
      // Don't dismiss if focus moved to another textarea or into the toolbar
      if (!isTextarea && lostFromCard && lostFromToolbar) {
        dismiss();
      }
    }, 150);
  }, [dismiss]);

  return (
    <div
      ref={cardRef}
      className={`group relative flex max-h-80 flex-col overflow-hidden rounded-2xl border transition-colors ${cardStyles[cardTheme]}`}
    >
      {/* Card theme toggle — top right */}
      <div className="absolute top-2.5 right-2.5 z-10 flex gap-1 rounded-full bg-black/5 p-0.5 backdrop-blur-sm dark:bg-white/10">
        {(["light", "dark", "blue", "red", "yellow"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setCardTheme(t)}
            aria-label={`${t} background`}
            className={`size-3.5 rounded-full ring-offset-1 transition-all ${
              swatchStyles[t]
            } ${
              cardTheme === t
                ? "ring-2 opacity-100"
                : "opacity-50 hover:opacity-90"
            }`}
          />
        ))}
      </div>

      {/* Font preview — editable textarea */}
      <div className="min-h-25 flex-1 overflow-hidden p-4">
        <textarea
          ref={textareaRef}
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={font.name}
          rows={3}
          className="h-full w-full resize-none rounded-lg border-0 bg-transparent p-0 text-3xl leading-tight tracking-tight outline-none transition-colors placeholder:opacity-50 focus:ring-0 sm:text-4xl"
          style={{
            fontFamily: `"${font.name}", sans-serif`,
            fontWeight: cardState.weight,
            fontSize: `${cardState.size}px`,
            letterSpacing: `${cardState.tracking}em`,
            lineHeight: cardState.leading,
            color: "inherit",
					}}
					autoCapitalize="off"
					autoComplete="off"
					autoCorrect="off"
					spellCheck="false"
        />
      </div>

      {/* Metadata row */}
      <div className="flex items-center justify-between border-t border-inherit px-4 py-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="truncate text-sm font-medium">{font.name}</span>
          {creator && (
            <span className="shrink-0 text-xs opacity-60">
              by {creator.name}
            </span>
          )}
          <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider opacity-70 dark:bg-white/10">
            {font.category}
          </span>
        </div>
        <Button
          render={<Link to={`/fonts/${font.id}`} />}
          nativeButton={false}
          variant="ghost"
          size="sm"
          className={`shrink-0 ${
            cardTheme === "blue" || cardTheme === "red"
              ? "hover:bg-white/20 text-white hover:text-white/80"
              : cardTheme === "dark"
                ? "hover:bg-zinc-800 text-zinc-50 hover:text-zinc-50/80"
                : cardTheme === "yellow"
                  ? "hover:bg-zinc-900/10 text-zinc-900 hover:text-zinc-900/80"
                  : ""
          }`}
        >
          View font
        </Button>
      </div>
    </div>
  );
}
