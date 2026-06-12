import { useState } from "react";
import { rankCandidates } from "../api";
import { Upload, Users, Award, CheckCircle2 } from "lucide-react";

function RankTab() {
    const [jdFile, setJdFile] = useState(null);
    const [jdText, setJdText] = useState("");
    const [jdMode, setJdMode] = useState("file");
    const [resumeFiles, setResumeFiles] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleRank() {
        if (jdMode === "file" && !jdFile) {
            setError("Please upload a job description PDF.");
            return;
        }
        if (jdMode === "text" && !jdText.trim()) {
            setError("Please paste job description text.");
            return;
        }
        if (resumeFiles.length === 0) {
            setError("Please upload at least one candidate resume PDF.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            let jdInput = jdFile;
            if (jdMode === "text") {
                jdInput = new File(
                    [new Blob([jdText], { type: "text/plain" })],
                    "jd.txt"
                );
            }
            const data = await rankCandidates(jdInput, resumeFiles);
            setResult(data);
        } catch (e) {
            setError("Something went wrong. Make sure the backend is running.");
        }
        setLoading(false);
    }

    return (
        <div className="dashboard-grid">
            {/* Left Column: Inputs */}
            <div className="dashboard-pane input-pane">
                <div className="pane-section">
                    <div className="pane-header">
                        <span className="pane-step">1</span>
                        <h2>Job Description</h2>
                    </div>
                    <div className="input-toggle">
                        <button className={`toggle-btn ${jdMode === "file" ? "active" : ""}`}
                            onClick={() => setJdMode("file")}>Upload PDF</button>
                        <button className={`toggle-btn ${jdMode === "text" ? "active" : ""}`}
                            onClick={() => setJdMode("text")}>Paste text</button>
                    </div>
                    {jdMode === "file" ? (
                        <div className="file-upload-wrapper">
                            <label className="file-upload-label">
                                <Upload size={18} />
                                <span>{jdFile ? jdFile.name : "Select Job Description PDF"}</span>
                                <input type="file" accept=".pdf" onChange={(e) => setJdFile(e.target.files[0])} />
                            </label>
                            {jdFile && <div className="file-status-success">✓ File selected successfully</div>}
                        </div>
                    ) : (
                        <textarea placeholder="Paste job description here..." value={jdText} onChange={(e) => setJdText(e.target.value)} />
                    )}
                </div>

                <div className="pane-section">
                    <div className="pane-header">
                        <span className="pane-step">2</span>
                        <h2>Candidate Resumes</h2>
                    </div>
                    <div className="file-upload-wrapper">
                        <label className="file-upload-label">
                            <Upload size={18} />
                            <span>Select Multiple Resume PDFs</span>
                            <input type="file" accept=".pdf" multiple onChange={(e) => setResumeFiles(Array.from(e.target.files))} />
                        </label>
                        {resumeFiles.length > 0 && (
                            <div className="file-status-success">
                                ✓ {resumeFiles.length} resume(s) uploaded
                            </div>
                        )}
                    </div>
                </div>

                <button className="primary-btn" onClick={handleRank} disabled={loading}>
                    {loading ? "Ranking Candidates..." : "Rank Candidates"}
                </button>
                {error && <div className="error">{error}</div>}
            </div>

            {/* Right Column: Rankings or Placeholder */}
            <div className="dashboard-pane results-pane">
                {result ? (
                    <div className="results-wrapper">
                        <div className="pane-header">
                            <h2>Candidate Rankings</h2>
                        </div>
                        <div className="rankings-list">
                            {result.rankings && result.rankings.length > 0 ? (
                                result.rankings.map((c, i) => (
                                    <div key={i} className={`rank-card ${i === 0 ? "rank-card-first" : ""}`}>
                                        <div className="rank-num-badge">
                                            {i === 0 ? <Award size={18} className="gold-icon" /> : `#${i + 1}`}
                                        </div>
                                        <div className="rank-info">
                                            <h3>{c.name}</h3>
                                            <p>Skills: {c.matched_skills && c.matched_skills.join(", ") || "No matches"}</p>
                                        </div>
                                        <div className="rank-score-badge">{c.score}%</div>
                                    </div>
                                ))
                            ) : (
                                <span className="no-skills-msg">No candidates ranked yet.</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="placeholder-wrapper">
                        <div className="placeholder-icon">
                            <Users size={42} className="icon-pulse" />
                        </div>
                        <h3>Awaiting Candidates</h3>
                        <p>
                            Upload a Job Description and multiple Candidate Resumes on the left side, then click <strong>Rank Candidates</strong> to score and rank them.
                        </p>
                        <div className="features-list">
                            <div className="feature-item">
                                <CheckCircle2 size={14} />
                                <span>Multi-candidate screening leaderboard</span>
                            </div>
                            <div className="feature-item">
                                <CheckCircle2 size={14} />
                                <span>Highlighted top match details</span>
                            </div>
                            <div className="feature-item">
                                <CheckCircle2 size={14} />
                                <span>Dynamic skill gap analysis comparison</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RankTab;