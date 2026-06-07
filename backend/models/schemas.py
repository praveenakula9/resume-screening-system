from pydantic import BaseModel
from typing import List

class SkillRecommendation(BaseModel):
    skill: str
    resource: str

class AnalyzeResponse(BaseModel):
    ats_score: float
    semantic_score: float
    tfidf_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[SkillRecommendation]
    experience_years: int

class CandidateScore(BaseModel):
    name: str
    score: float
    matched_skills: List[str]
    missing_skills: List[str]

class RankResponse(BaseModel):
    rankings: List[CandidateScore]