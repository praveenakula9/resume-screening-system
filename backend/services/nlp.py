from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.services.parser import extract_skills
import re

def preprocess(text):

    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = text.strip()
    return text

def tfidf_score(text1, text2):

    preprocessed_text1 = preprocess(text1)
    preprocessed_text2 = preprocess(text2)
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([preprocessed_text1, preprocessed_text2])
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return round(cosine_sim[0][0] * 100, 2)



def skill_overlap_score(resume_text, jd_text):
    resume_skills = set(extract_skills(resume_text))
    jd_skills     = set(extract_skills(jd_text))
    if not jd_skills:
        return 0
    intersection = resume_skills.intersection(jd_skills)
    return round((len(intersection) / len(jd_skills)) * 100, 2)