import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import PreviewPage from "./components/preview/preview-page";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PreviewPage />} />
      </Routes>
    </Layout>
  );
}
