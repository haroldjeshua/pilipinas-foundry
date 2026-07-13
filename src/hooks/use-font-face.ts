import { useEffect, useRef } from "react";
import type { Font } from "@/lib/schema";

const loadedFonts = new Set<string>();

/**
 * Lazily injects @font-face CSS for a font when it's selected.
 * Only loads the specific weight needed, not all weights upfront.
 */
export function useFontFace(font: Font | undefined, weight: number) {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!font) return;

    const key = `${font.id}-${weight}`;
    if (loadedFonts.has(key)) return;

    const woff2Path = font.fileMap[String(weight)];
    if (!woff2Path) return;

    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      styleRef.current.setAttribute("data-font-loader", font.id);
      document.head.appendChild(styleRef.current);
    }

    const fontFace = `
@font-face {
  font-family: "${font.name}";
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
  src: url("/fonts/${woff2Path}") format("woff2");
}`;

    styleRef.current.textContent += fontFace;
    loadedFonts.add(key);

    return () => {
      // Don't remove — other panes might be using the same font/weight
    };
  }, [font, weight]);
}
