import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Setting06Icon, Sun01Icon, Moon02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "pilipinas-foundry:primary";

const routes = [
  { to: "/", label: "Browse" },
  { to: "/about", label: "About" },
] as const;

const primaries = [
  { id: "blue", label: "Blue", color: "oklch(0.3762 0.1833 262.6)" },
  { id: "red", label: "Red", color: "oklch(0.5148 0.2006 16.0)" },
  { id: "yellow", label: "Yellow", color: "oklch(0.8761 0.1599 90.7)" },
] as const;

function applyPrimary(color: string) {
  document.documentElement.style.setProperty("--primary", color);
  document.documentElement.style.setProperty("--ring", color);
  localStorage.setItem(STORAGE_KEY, color);
}

function getSavedPrimary(): { color: string; id: string } | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  const match = primaries.find((p) => p.color === saved);
  return match ? { color: saved, id: match.id } : null;
}

export default function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [activePrimary, setActivePrimary] = useState(() => {
    const saved = getSavedPrimary();
    if (saved) applyPrimary(saved.color);
    return saved?.id ?? "blue";
  });

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="font-sans text-base font-semibold tracking-tight text-foreground hover:text-primary transition-colors duration-fast"
        >
          pilipinas-foundry
        </Link>

        {/* Centered nav — tab-styled route links */}
        <nav aria-label="Main" className="flex-1 flex justify-center">
          <div className="flex items-center rounded-full bg-muted p-1">
            {routes.map((route) => {
              const isActive =
                route.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(route.to);
              return (
                <Link
                  key={route.to}
                  to={route.to}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {route.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" nativeButton={false} />}>
              <HugeiconsIcon icon={Setting06Icon} size={16} strokeWidth={1.5} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              {/* Theme */}
              <DropdownMenuGroup>
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(v) => setTheme(v)}
                >
                  <DropdownMenuRadioItem value="light">
                    <HugeiconsIcon icon={Sun01Icon} size={16} strokeWidth={1.5} />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <HugeiconsIcon icon={Moon02Icon} size={16} strokeWidth={1.5} />
                    Dark
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Primary color */}
              <DropdownMenuGroup>
                <DropdownMenuLabel>Primary</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={activePrimary}
                  onValueChange={(v) => {
                    const match = primaries.find((p) => p.id === v);
                    if (match) {
                      applyPrimary(match.color);
                      setActivePrimary(match.id);
                    }
                  }}
                >
                  {primaries.map((p) => (
                    <DropdownMenuRadioItem key={p.id} value={p.id}>
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon-sm" disabled aria-label="More">
            <span className="text-sm">⋯</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
