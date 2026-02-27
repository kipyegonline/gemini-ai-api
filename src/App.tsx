import { useState } from "react";
import { FaImage } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { HiMoon, HiSun } from "react-icons/hi2";
import "./App.css";
import SingleComparison from "./Components/SingleComparison";
import MultipleComparisons from "./Components/MultipleComparisons";
import ReportProblemModal from "./Components/ReportProblemModal";

function App() {
  const [single, setSingle] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <header className="border-b border-[var(--border)] mb-8">
        <div className="max-w-[860px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1877F2]/10 flex items-center justify-center">
              <BsStars className="text-[#1877F2] text-lg" />
            </div>
            <div className="text-left">
              <h1 className="text-base font-semibold text-[var(--text)] leading-none">
                Image reader AI
              </h1>
              <p className=" invisible text-xs text-[var(--text-muted)] mt-0.5">
                Powered by Gemini
              </p>
            </div>
          </div>

          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#1877F2] transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <HiSun className="text-base" />
            ) : (
              <HiMoon className="text-base" />
            )}
          </button>
        </div>
      </header>

      <div className="max-w-[860px] mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
            What do you see in this image?
          </h2>
          <p className="text-[var(--text-muted)] text-sm">
            Upload an image and ask anything — get instant AI insights.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 mb-8">
          <button
            className={`tab-pill ${single ? "active" : "inactive"}`}
            onClick={() => setSingle(true)}
          >
            <FaImage size="0.9rem" />
            Single Image
          </button>
          <button
            className={`tab-pill ${!single ? "active" : "inactive"}`}
            onClick={() => setSingle(false)}
          >
            <FaRegImages size="0.9rem" />
            Compare Images
          </button>
        </div>

        {/* Content */}
        {single ? <SingleComparison /> : <MultipleComparisons />}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-[var(--text-muted)] text-xs border-t border-[var(--border)] pt-6 flex flex-col items-center gap-2">
        <p>
          Image AI may make mistakes. Verify important info. &copy;{" "}
          {new Date().getFullYear()}
        </p>
        <button
          onClick={() => setReportOpen(true)}
          className="text-[#1877F2] hover:underline hover:text-[#1464D8] transition-colors"
        >
          Report a problem
        </button>
      </footer>

      <ReportProblemModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </main>
  );
}

export default App;
