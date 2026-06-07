'''import sys
sys.path.append(".")

from backend.services.parser import extract_email, extract_skills, extract_experience_years

sample = """
Jane Doe | jane@example.com
Skills: Python, TensorFlow, Docker, SQL, AWS
Experience: 3 years as ML Engineer
"""

print("Email:", extract_email(sample))
print("Skills:", extract_skills(sample))
print("Years:", extract_experience_years(sample))

from backend.services.nlp import tfidf_score

resume = "python machine learning tensorflow sql docker aws data science"
jd = "python deep learning pytorch sql kubernetes aws nlp"

print("TF-IDF Score:", tfidf_score(resume, jd))

from backend.services.nlp import skill_overlap_score

resume = "python tensorflow sql docker aws machine learning"
jd     = "python pytorch sql kubernetes aws deep learning nlp"

print("Skill Overlap:", skill_overlap_score(resume, jd))

from backend.services.matcher import semantic_score, hybrid_score, rank_candidates

resume = "python tensorflow sql docker aws machine learning deep learning"
jd     = "python pytorch sql kubernetes aws deep learning nlp neural network"

print("Semantic Score:", semantic_score(resume, jd))
print("Hybrid Score:",   hybrid_score(resume, jd))

candidates = [
    {"name": "Alice", "text": "python tensorflow deep learning nlp aws"},
    {"name": "Bob",   "text": "java spring boot sql docker kubernetes"},
    {"name": "Carol", "text": "python pytorch machine learning scikit-learn"}
]

ranked = rank_candidates(candidates, jd)
for r in ranked:
    print(r["name"], "→", r["score"])'''

from backend.services.ats import ats_score, missing_skills, recommend_skills

resume = """
John Doe | john@example.com
Skills: Python, TensorFlow, SQL, Docker, AWS, Machine Learning
Experience: 3 years as ML Engineer
"""

jd = """
Required: Python, PyTorch, SQL, Kubernetes, AWS, Deep Learning, NLP, MLflow
Experience: 2+ years in ML
"""

print("ATS Score:", ats_score(resume, jd))

gaps = missing_skills(resume, jd)
print("Matched:", gaps["matched"])
print("Missing:", gaps["missing"])

recs = recommend_skills(gaps["missing"])
for r in recs:
    print(r["skill"], "→", r["resource"])