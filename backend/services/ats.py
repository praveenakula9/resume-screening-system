from backend.services.nlp import tfidf_score, skill_overlap_score
from backend.services.matcher import semantic_score
from backend.services.parser import extract_skills, extract_experience_years
import re

def experience_score(resume_text, jd_text):
    resume_years = extract_experience_years(resume_text)
    jd_years = extract_experience_years(jd_text)
    if jd_years == 0:
        return 80
    if resume_years >= jd_years:
        return 100
    elif resume_years >= jd_years - 1:
        return 70 
    else:
        return 40  

def ats_score(resume_text, jd_text):
    tfidf = tfidf_score(resume_text, jd_text)
    skill_overlap = skill_overlap_score(resume_text, jd_text)
    semantic = semantic_score(resume_text, jd_text)
    experience = experience_score(resume_text, jd_text)
    return round(0.2 * tfidf + 0.3 * skill_overlap + 0.3 * semantic + 0.2 * experience, 2)

def missing_skills(resume_text, jd_text):
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)
    matched = list(set(resume_skills) & set(jd_skills))
    missing = list(set(jd_skills) - set(resume_skills))
    return {"matched": matched, "missing": missing}

def recommend_skills(missing_skills_list):
    resources = {
        "python": "https://docs.python.org/3/tutorial/",
        "machine learning": "https://www.coursera.org/learn/machine-learning",
        "deep learning": "https://www.deeplearning.ai/courses/",
        "pytorch": "https://pytorch.org/tutorials/",
        "tensorflow": "https://www.tensorflow.org/tutorials",
        "docker": "https://docs.docker.com/get-started/",
        "kubernetes": "https://kubernetes.io/docs/tutorials/",
        "sql": "https://www.w3schools.com/sql/",
        "aws": "https://aws.amazon.com/training/",
        "mlflow": "https://mlflow.org/docs/latest/tutorials-and-examples/",
        "spark": "https://spark.apache.org/docs/latest/",
        "nlp": "https://huggingface.co/learn/nlp-course/",
        
    }
    result = []
    for skill in missing_skills_list:
        if skill in resources:
            result.append({"skill": skill, "resource": resources[skill]})
        else:
            result.append({"skill": skill, "resource": f"https://www.google.com/search?q=learn+{skill.replace(' ', '+')}"})
    return result