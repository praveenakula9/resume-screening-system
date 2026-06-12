const API_URL = "http://127.0.0.1:8000";

export async function analyzeResume(resumeFile, jdFile) {
    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("jd_file", jdFile);

    const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
    });
    return response.json();
}

export async function rankCandidates(jdFile, resumeFiles) {
    const formData = new FormData();

    formData.append("jd_file", jdFile);
    resumeFiles.forEach(file => formData.append("resume_files", file));

    const response = await fetch(`${API_URL}/rank`, {
        method: "POST",
        body: formData,
    });
    return response.json();
}