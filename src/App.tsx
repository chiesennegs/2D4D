import { Link, Route, Routes } from "react-router-dom";
import { Logo } from "./components/Logo";
import { ScrollToTop } from "./components/ScrollToTop";
import { Calibration } from "./pages/Calibration";
import { Capture } from "./pages/Capture";
import { Demographics } from "./pages/Demographics";
import { Methodology } from "./pages/Methodology";
import { Results } from "./pages/Results";
import { Welcome } from "./pages/Welcome";

export function App() {
  return (
    <>
      <ScrollToTop />
      <header className="top-bar">
        <Link to="/" className="brand">
          <Logo size={28} />
          <span>
            2D4D
            <small>digit ratio estimator</small>
          </span>
        </Link>
        <Link to="/methodology" className="nav-link">
          Methodology
        </Link>
      </header>
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/demographics" element={<Demographics />} />
          <Route path="/calibration" element={<Calibration />} />
          <Route path="/capture/:side" element={<Capture />} />
          <Route path="/results" element={<Results />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </main>
      <footer className="app-footer">
        Everything runs on your device. Nothing is uploaded or stored anywhere else.
      </footer>
    </>
  );
}
