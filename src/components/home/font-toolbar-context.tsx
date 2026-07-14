import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CardState {
  weight: number;
  size: number;
  tracking: number;
  leading: number;
  pangramLang: "en" | "tl";
  availableWeights: number[];
}

interface FontToolbarContextValue {
  activeFontId: string | null;
  cards: Map<string, CardState>;
  activate: (fontId: string, weights: number[]) => void;
  dismiss: () => void;
  update: <K extends keyof CardState>(key: K, value: CardState[K]) => void;
  reset: () => void;
  setText: (text: string) => void;
}

const FontToolbarContext = createContext<FontToolbarContextValue | null>(null);

export const setTextRef = { current: (_text: string) => {} };

export function useFontToolbar() {
  const ctx = useContext(FontToolbarContext);
  if (!ctx) throw new Error("useFontToolbar must be used within FontToolbarProvider");
  return ctx;
}

const cardDefaults: CardState = {
  weight: 400,
  size: 48,
  tracking: 0,
  leading: 1.2,
  pangramLang: "en",
  availableWeights: [400],
};

export function FontToolbarProvider({ children }: { children: ReactNode }) {
  const [activeFontId, setActiveFontId] = useState<string | null>(null);
  const [cards, setCards] = useState<Map<string, CardState>>(new Map());

  const activate = useCallback((fontId: string, weights: number[]) => {
    setActiveFontId(fontId);
    setCards((prev) => {
      if (prev.has(fontId)) return prev;
      const next = new Map(prev);
      next.set(fontId, { ...cardDefaults, availableWeights: weights });
      return next;
    });
  }, []);

  const dismiss = useCallback(() => {
    setActiveFontId(null);
  }, []);

  const update = useCallback(
    <K extends keyof CardState>(key: K, value: CardState[K]) => {
      setActiveFontId((currentId) => {
        if (!currentId) return currentId;
        setCards((prev) => {
          const next = new Map(prev);
          const card = next.get(currentId) ?? { ...cardDefaults };
          next.set(currentId, { ...card, [key]: value });
          return next;
        });
        return currentId;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setActiveFontId((currentId) => {
      if (!currentId) return currentId;
      setCards((prev) => {
        const next = new Map(prev);
        const card = next.get(currentId);
        next.set(currentId, {
          ...cardDefaults,
          availableWeights: card?.availableWeights ?? cardDefaults.availableWeights,
        });
        return next;
      });
      return currentId;
    });
  }, []);

  const setText = useCallback((text: string) => {
    setTextRef.current(text);
  }, []);

  return (
    <FontToolbarContext.Provider
      value={{
        activeFontId,
        cards,
        activate,
        dismiss,
        update,
        reset,
        setText,
      }}
    >
      {children}
    </FontToolbarContext.Provider>
  );
}

export { cardDefaults };
