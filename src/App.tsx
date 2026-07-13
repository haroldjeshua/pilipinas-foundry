import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col gap-8">
              <section>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  tipong-pinoy
                </h1>
                <p className="mt-2 text-sm text-muted">
                  A Filipino free font library
                </p>
              </section>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}
