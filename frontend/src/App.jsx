import { useState, useEffect } from "react";
import AnalyzeTab from "./components/AnalyzeTab";
import RankTab from "./components/RankTab";
import { BeamsBackground } from "./components/ui/beams-background";
import { Sun, Moon } from "lucide-react";

function App() {
  const [tab, setTab] = useState("analyze");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }

  return (
    <BeamsBackground theme={theme}>
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="brand">
              <span className="logo-sparkle">✦</span>
              <h1>AI Resume Screening & Job Matching System</h1>
              <span className="badge">AI-powered</span>
            </div>

            <div className="header-controls">
              <div className="dashboard-tabs">
                <button
                  className={`tab-btn ${tab === "analyze" ? "active" : ""}`}
                  onClick={() => setTab("analyze")}
                >
                  Analyze
                </button>
                <button
                  className={`tab-btn ${tab === "rank" ? "active" : ""}`}
                  onClick={() => setTab("rank")}
                >
                  Rank
                </button>
              </div>
              <button className="glow-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === "dark" ? (
                  <>
                    <Sun size={14} /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={14} /> Dark Mode
                  </>
                )}
              </button>
            </div>
          </header>

          <main className="dashboard-content">
            {tab === "analyze" ? <AnalyzeTab /> : <RankTab />}
          </main>
        </div>
      </div>
    </BeamsBackground>
  );
}

export default App;