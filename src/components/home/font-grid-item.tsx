import { Link } from "react-router";
import { useFontFace } from "@/hooks/use-font-face";
import { getCreator } from "@/lib/content";
import type { Font } from "@/lib/schema";

interface FontGridItemProps {
  font: Font;
}

export default function FontGridItem({ font }: FontGridItemProps) {
  const defaultWeight = font.weights[0] ?? 400;
  useFontFace(font, defaultWeight);

  const creator = getCreator(font.creatorId);

  return (
    <Link
      to={`/fonts/${font.id}`}
      className="group flex flex-col gap-3 rounded-lg p-4 transition-colors duration-fast hover:bg-muted/50"
    >
      {/* Font preview — the font name rendered in the font itself */}
      <div className="flex min-h-[120px] items-end">
        <span
          className="text-4xl leading-tight tracking-tight text-foreground transition-colors duration-fast group-hover:text-primary sm:text-5xl"
          style={{
            fontFamily: `"${font.name}", sans-serif`,
            fontWeight: defaultWeight,
          }}
        >
          {font.name}
        </span>
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">
          {font.name}
        </span>
        {creator && (
          <span className="text-xs text-muted-foreground">
            by {creator.name}
          </span>
        )}
      </div>
    </Link>
  );
}
