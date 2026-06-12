import { useState } from "react";
import { analyzeResume } from "../api";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

function AnalyzeTab() {
    const [resumeFile, setResumeFile] = useState(null);
    const [jdFile, setJdFile] = useState(null);
    const [resumeText, setResumeText] = useState("");
    const [jdText, setJdText] = useState("");
    const [resumeMode, setResumeMode] = useState("file");
    const [jdMode, setJdMode] = useState("file");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleAnalyze() {
        if (resumeMode === "file" && !resumeFile) {
            setError("Please upload a resume PDF.");
            return;
        }
        if (resumeMode === "text" && !resumeText.trim()) {
            setError("Please paste resume text.");
            return;
        }
        if (jdMode === "file" && !jdFile) {
            setError("Please upload a job description PDF.");
            return;
        }
        if (jdMode === "text" && !jdText.trim()) {
            setError("Please paste job description text.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            let resumeInput = resumeFile;
            let jdInput = jdFile;

            if (resumeMode === "text") {
                resumeInput = new Blob([resumeText], { type: "text/plain" });
                resumeInput = new File([resumeInput], "resume.txt");
            }
            if (jdMode === "text") {
                jdInput = new Blob([jdText], { type: "text/plain" });
                jdInput = new File([jdInput], "jd.txt");
            }

            const data = await analyzeResume(resumeInput, jdInput);
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
                        <h2>Candidate Resume</h2>
                    </div>
                    <div className="input-toggle">
                        <button className={`toggle-btn ${resumeMode === "file" ? "active" : ""}`}
                            onClick={() => setResumeMode("file")}>Upload PDF</button>
                        <button className={`toggle-btn ${resumeMode === "text" ? "active" : ""}`}
                            onClick={() => setResumeMode("text")}>Paste text</button>
                    </div>
                    {resumeMode === "file" ? (
                        <div className="file-upload-wrapper">
                            <label className="file-upload-label">
                                <Upload size={18} />
                                <span>{resumeFile ? resumeFile.name : "Select Resume PDF"}</span>
                                <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
                            </label>
                            {resumeFile && <div className="file-status-success">✓ File selected successfully</div>}
                        </div>
                    ) : (
                        <textarea placeholder="Paste resume content here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
                    )}
                </div>

                <div className="pane-section">
                    <div className="pane-header">
                        <span className="pane-step">2</span>
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

                <button className="primary-btn" onClick={handleAnalyze} disabled={loading}>
                    {loading ? "Analyzing Candidate..." : "Analyze Resume"}
                </button>
                {error && <div className="error">{error}</div>}
            </div>

            {/* Right Column: Results or Placeholder */}
            <div className="dashboard-pane results-pane">
                {result ? (
                    <div className="results-wrapper">
                        <div className="pane-header">
                            <h2>Screening Metrics</h2>
                        </div>
                        <div className="score-grid">
                            <div className="score-card">
                                <div className="val">{result.ats_score}%</div>
                                <div className="lbl">ATS Score</div>
                            </div>
                            <div className="score-card">
                                <div className="val">{result.semantic_score}%</div>
                                <div className="lbl">Semantic</div>
                            </div>
                            <div className="score-card">
                                <div className="val">{result.tfidf_score}%</div>
                                <div className="lbl">TF-IDF</div>
                            </div>
                            <div className="score-card">
                                <div className="val">{result.experience_years}</div>
                                <div className="lbl">Exp. Years</div>
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Matched Skills</h3>
                            <div className="skills-container">
                                {result.matched_skills && result.matched_skills.length > 0 ? (
                                    result.matched_skills.map((s, i) => (
                                        <span key={i} className="skill-tag matched">{s}</span>
                                    ))
                                ) : (
                                    <span className="no-skills-msg">No matched skills found.</span>
                                )}
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Missing Skills</h3>
                            <div className="skills-container">
                                {result.missing_skills && result.missing_skills.length > 0 ? (
                                    result.missing_skills.map((s, i) => (
                                        <span key={i} className="skill-tag missing">{s}</span>
                                    ))
                                ) : (
                                    <span className="no-skills-msg green-text">No missing skills! Candidate matches all JD skills.</span>
                                )}
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Recommendations</h3>
                            <div className="recs-container">
                                {result.recommendations && result.recommendations.length > 0 ? (
                                    result.recommendations.map((rec, i) => (
                                        <div key={i} className="rec-item">
                                            <span className="rec-skill">{rec.skill}</span>
                                            <a href={rec.resource} target="_blank" rel="noreferrer" className="rec-link">Learn →</a>
                                        </div>
                                    ))
                                ) : (
                                    <span className="no-recs-msg">No recommendations needed.</span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="placeholder-wrapper">
                        <div className="placeholder-icon">
                            <FileText size={42} className="icon-pulse" />
                        </div>
                        <h3>Awaiting Analysis</h3>
                        <p>
                            Upload a resume and a job description on the left side, then click <strong>Analyze Resume</strong> to see compatibility ratings, skill mappings, and study links.
                        </p>
                        <div className="features-list">
                            <div className="feature-item">
                                <CheckCircle2 size={14} />
                                <span>ATS & Semantic Relevance Scores</span>
                            </div>
                            <div className="feature-item">
                                <CheckCircle2 size={14} />
                                <span>Skill Gap Matrix (Matched vs Missing)</span>
                            </div>
                            <div className="feature-item">
                                <CheckCircle2 size={14} />
                                <span>Targeted Upskilling Resources</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnalyzeTab;