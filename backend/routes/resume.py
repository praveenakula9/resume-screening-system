from fastapi import APIRouter, UploadFile, File
from backend.services.parser import extract_text_from_pdf, extract_skills, extract_experience_years
from backend.services.ats import ats_score, missing_skills, recommend_skills
from backend.services.matcher import semantic_score, rank_candidates
from backend.services.nlp import tfidf_score
from backend.models.schemas import AnalyzeResponse, RankResponse, CandidateScore
import shutil, os

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(resume_file: UploadFile = File(...),
                  jd_file: UploadFile = File(...)):
    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    resume_path = f"uploads/{resume_file.filename}"
    jd_path = f"uploads/{jd_file.filename}"

    with open(resume_path, "wb") as f:
        shutil.copyfileobj(resume_file.file, f)

    with open(jd_path, "wb") as f:
        shutil.copyfileobj(jd_file.file, f)
    
    resume_text = extract_text_from_pdf(resume_path)
    jd_text = extract_text_from_pdf(jd_path)
    
    score     = ats_score(resume_text, jd_text)
    sem_score = semantic_score(resume_text, jd_text)
    tf_score  = tfidf_score(resume_text, jd_text)
    gaps      = missing_skills(resume_text, jd_text)
    recs      = recommend_skills(gaps["missing"])
    exp_years = extract_experience_years(resume_text)

    return AnalyzeResponse(
        ats_score        = score,
        semantic_score   = sem_score,
        tfidf_score      = tf_score,
        matched_skills   = gaps["matched"],
        missing_skills   = gaps["missing"],
        recommendations  = recs,
        experience_years = exp_years
    )

@router.post("/rank")
async def rank(jd_file: UploadFile = File(...),
               resume_files: list[UploadFile] = File(...)):
    # save and parse jd
    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    jd_path = f"uploads/{jd_file.filename}"
    with open(jd_path, "wb") as f:
        shutil.copyfileobj(jd_file.file, f)
    
    jd_text = extract_text_from_pdf(jd_path)

    candidates = []
    for resume_file in resume_files:
        resume_path = f"uploads/{resume_file.filename}"
        with open(resume_path, "wb") as f:
            shutil.copyfileobj(resume_file.file, f)
        
        resume_text = extract_text_from_pdf(resume_path)
        candidates.append({
            "name": resume_file.filename,
            "text": resume_text
        })
    
    
    ranked = rank_candidates(candidates, jd_text)
    formatted = []
    for r in ranked:
        gaps = missing_skills(r["text"], jd_text)
        formatted.append(CandidateScore(
            name          = r["name"],
            score         = r["score"],
            matched_skills= gaps["matched"],
            missing_skills= gaps["missing"]
        ))
    return RankResponse(rankings=formatted)