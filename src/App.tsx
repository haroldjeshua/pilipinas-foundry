import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./components/home/home-page";
import PreviewPage from "./components/preview/preview-page";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fonts/:id" element={<PreviewPage />} />
      </Routes>
    </Layout>
  );
}
