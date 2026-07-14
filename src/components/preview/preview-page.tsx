import { useState } from "react";
import { useParams, Link } from "react-router";
import { getFont, getCreator } from "@/lib/content";
import { useFontFaceAll } from "@/hooks/use-font-face";
import { TAGALOG_PANGRAM, ENGLISH_PANGRAM } from "@/lib/pangrams";
import PreviewPane from "./preview-pane";
import SettingsDialog from "./settings-dialog";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const font = getFont(id ?? "");
  const creator = font ? getCreator(font.creatorId) : undefined;

  const [pangramLang, setPangramLang] = useState<"tagalog" | "english">(
    "tagalog",
  );

  const previewText =
    pangramLang === "tagalog" ? TAGALOG_PANGRAM : ENGLISH_PANGRAM;

  // Load all declared weights for the specimen
  useFontFaceAll(font);

  if (!font) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <h1 className="text-2xl font-semibold text-foreground">
          Font not found
        </h1>
        <p className="text-sm text-muted-foreground">
          No font matches "{id}". It may have been removed or the link may be
          incorrect.
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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            pilipinas-foundry
          </Link>
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
        <SettingsDialog
          pangramLang={pangramLang}
          onPangramChange={setPangramLang}
        />
      </div>

      {/* Specimen — font rendered at each declared weight */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Specimen
        </h2>
        <div className="flex flex-col gap-6">
          {font.weights.map((weight) => (
            <div key={weight} className="flex flex-col gap-1">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {weight}
              </span>
              <p
                className="text-2xl leading-relaxed text-foreground"
                style={{
                  fontFamily: `"${font.name}", sans-serif`,
                  fontWeight: weight,
                }}
              >
                {previewText}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
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

      {/* Metadata */}
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

      {/* Interactive preview */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Preview
        </h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <PreviewPane
            label="Heading"
            previewText={previewText}
            initialFontId={font.id}
          />
          <PreviewPane
            label="Body"
            previewText={previewText}
            initialFontId={font.id}
            initialState={{ size: 18, weight: 400 }}
          />
        </div>
      </section>

      {/* Creator link */}
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
