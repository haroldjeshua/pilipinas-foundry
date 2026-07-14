import type { ReactNode } from "react";
import { Agentation } from "agentation";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {children}
      </main>
      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
}
