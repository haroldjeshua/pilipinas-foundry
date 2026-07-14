import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { ThemeProvider } from "next-themes";
import Layout from "./components/layout/Layout";
import { FontToolbarProvider } from "./components/home/font-toolbar-context";
import FontToolbar from "./components/home/font-toolbar";

const HomePage = lazy(() => import("./components/home/home-page"));
const PreviewPage = lazy(() => import("./components/preview/preview-page"));
const AboutPage = lazy(() => import("./components/about/about-page"));

function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <FontToolbarProvider>
        <Layout>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/fonts/:id" element={<PreviewPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </Layout>
        <FontToolbar />
      </FontToolbarProvider>
    </ThemeProvider>
  );
}
