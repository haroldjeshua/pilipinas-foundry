import { useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router";
import { getFont, getCreator } from "@/lib/content";
import { useFontFaceAll } from "@/hooks/use-font-face";
import { TAGALOG_PANGRAMS } from "@/components/home/font-pangrams";
import SpecimenToolbar from "./specimen-toolbar";
import type { SpecimenState } from "./specimen-toolbar";

function randomFrom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

const INITIAL_TEXT = randomFrom(TAGALOG_PANGRAMS);

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const font = getFont(id ?? "");
  const creator = font ? getCreator(font.creatorId) : undefined;

  useFontFaceAll(font);

  const [previewText, setPreviewText] = useState(INITIAL_TEXT);

  const [specimen, setSpecimen] = useState<SpecimenState>({
    weight: 400,
    italic: false,
    size: 64,
    tracking: 0,
    leading: 1.3,
    bgColor: "#ffffff",
    fgColor: "#0a0a0a",
  });

  const handleStateChange = useCallback((next: SpecimenState) => {
    setSpecimen(next);
  }, []);

  const weightOptions = useMemo(() => {
    if (!font) return [];
    return font.weights;
  }, [font]);

  if (!font) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <h1 className="text-2xl font-semibold text-foreground">
          Font not found
        </h1>
        <p className="text-sm text-muted-foreground">
          No font matches &ldquo;{id}&rdquo;. It may have been removed or the
          link may be incorrect.
        </p>
        <Link
          to="/"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Back to all fonts
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16">
      {/* Header — two columns: text left, trigger right */}
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {font.name}
          </h1>
          {creator && (
            <p className="text-sm text-muted-foreground">
              by {creator.name}
              {creator.location ? ` — ${creator.location}` : ""}
            </p>
          )}
        </div>
        <SpecimenToolbar
          weights={weightOptions}
          onStateChange={handleStateChange}
          onPreviewTextChange={setPreviewText}
        />
      </div>

      {/* Specimen — editable textarea */}
      <section className="flex flex-col gap-6">
        <div
          className="rounded-xl p-6 transition-colors"
          style={{ backgroundColor: specimen.bgColor }}
        >
          <textarea
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-lg border-0 bg-transparent p-0 text-inherit outline-none placeholder:opacity-30 focus:ring-0"
            style={{
              fontFamily: `"${font.name}", sans-serif`,
              fontWeight: specimen.weight,
              fontStyle: specimen.italic ? "italic" : "normal",
              fontSize: `${specimen.size}px`,
              color: specimen.fgColor,
              letterSpacing: `${specimen.tracking}em`,
              lineHeight: specimen.leading,
            }}
            placeholder="Type something..."
          />
        </div>
      </section>

      {/* About */}
      {font.description && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            About
          </h2>
          <p className="text-sm leading-relaxed text-foreground max-w-prose">
            {font.description}
          </p>
        </section>
      )}

      {/* Details */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Details
        </h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground">Category</dt>
            <dd className="text-foreground capitalize">{font.category}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground">Weights</dt>
            <dd className="font-mono text-xs tabular-nums text-foreground">
              {font.weights.join(", ")}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground">Italic</dt>
            <dd className="text-foreground">
              {font.hasItalic ? "Yes" : "No"}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground">License</dt>
            <dd>
              <a
                href={font.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                {font.license}
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground">Source</dt>
            <dd>
              <a
                href={font.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                View source
              </a>
            </dd>
          </div>
          {creator && (
            <div className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground">Designer</dt>
              <dd className="text-foreground">{creator.name}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Designer */}
      {creator && (
        <section className="flex flex-col gap-3 border-t border-border pt-8">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Designer
          </h2>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              {creator.name}
            </span>
            {creator.bio && (
              <p className="text-sm text-muted-foreground max-w-prose">
                {creator.bio}
              </p>
            )}
            {creator.links.length > 0 && (
              <div className="flex gap-3 mt-1">
                {creator.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
