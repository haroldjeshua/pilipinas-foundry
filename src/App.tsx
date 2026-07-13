import { Routes, Route } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-background text-foreground">
            <p className="p-8 text-muted">tipong-pinoy — placeholder</p>
          </div>
        }
      />
    </Routes>
  );
}
