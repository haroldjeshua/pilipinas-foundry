import { Link } from "react-router";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-sans text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors duration-fast"
        >
          pilipinas-foundry
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-6 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="hover:text-foreground transition-colors duration-fast"
              >
                Browse
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-foreground transition-colors duration-fast"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
