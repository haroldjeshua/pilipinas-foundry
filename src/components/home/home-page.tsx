import { getFonts } from "@/lib/content";
import FontGridItem from "./font-grid-item";

const allFonts = getFonts();

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          pilipinas-foundry
        </h1>
        <p className="text-sm text-muted-foreground">
          Filipino free font library — preview fonts made by Filipino type
          designers
        </p>
      </div>

      {/* Font grid */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {allFonts.map((font) => (
          <FontGridItem key={font.id} font={font} />
        ))}
      </div>

      {allFonts.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No fonts available yet. Check back soon.
        </p>
      )}
    </div>
  );
}
