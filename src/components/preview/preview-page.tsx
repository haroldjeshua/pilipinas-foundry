import { useState } from "react";
import PreviewPane from "./preview-pane";
import SettingsDialog from "./settings-dialog";
import { TAGALOG_PANGRAM, ENGLISH_PANGRAM } from "@/lib/pangrams";

export default function PreviewPage() {
  const [pangramLang, setPangramLang] = useState<"tagalog" | "english">(
    "tagalog",
  );

  const previewText =
    pangramLang === "tagalog" ? TAGALOG_PANGRAM : ENGLISH_PANGRAM;

  return (
    <div className="flex flex-col gap-12">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            pilipinas-foundry
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filipino free font library
          </p>
        </div>
        <SettingsDialog
          pangramLang={pangramLang}
          onPangramChange={setPangramLang}
        />
      </div>

      {/* Dual preview panes */}
      <div className="grid gap-8 lg:grid-cols-2">
        <PreviewPane label="Heading" previewText={previewText} />
        <PreviewPane
          label="Body"
          previewText={previewText}
          initialState={{ size: 18, weight: 400 }}
        />
      </div>
    </div>
  );
}
