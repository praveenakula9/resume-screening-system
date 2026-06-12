# matcher.py
from sentence_transformers import SentenceTransformer, util
from backend.services.nlp import tfidf_score

model = None  # don't load yet

def get_model():
    global model
    if model is None:
        model = SentenceTransformer('all-MiniLM-L6-v2')
    return model

def semantic_score(text1, text2):
    m = get_model()
    embeddings1 = m.encode(text1, convert_to_tensor=True)
    embeddings2 = m.encode(text2, convert_to_tensor=True)
    cosine_sim = util.pytorch_cos_sim(embeddings1, embeddings2)
    return round(cosine_sim.item() * 100, 2)

def hybrid_score(text1, text2):
    tfidf = tfidf_score(text1, text2)
    semantic = semantic_score(text1, text2)
    return round(0.4 * tfidf + 0.6 * semantic, 2)

def rank_candidates(resumes, jd_text):
    for resume in resumes:
        resume["score"] = hybrid_score(resume["text"], jd_text)
    return sorted(resumes, key=lambda x: x["score"], reverse=True)