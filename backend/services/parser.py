import pdfplumber
import re

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_email(text):
    match = re.search(r'[\w.-]+@[\w.-]+\.\w+', text)
    if match:
        return match.group(0)
    else:
        return ""

def extract_experience_years(text):
    match = re.search(r'(\d+)\+?\s*years?', text, re.IGNORECASE)
    return int(match.group(1)) if match else 0

def extract_skills(text):
    skills = [
        # Programming languages
        "python", "java", "javascript", "typescript", "c++", "c#", "r", "scala",
        "go", "rust", "kotlin", "swift", "php", "ruby", "matlab",

        # ML & AI
        "machine learning", "deep learning", "neural network", "natural language processing",
        "nlp", "computer vision", "reinforcement learning", "transfer learning",
        "supervised learning", "unsupervised learning", "generative ai", "llm",
        "large language model", "transformers", "bert", "gpt", "rag",

        # ML Libraries & Frameworks
        "tensorflow", "pytorch", "keras", "scikit-learn", "xgboost", "lightgbm",
        "hugging face", "spacy", "nltk", "opencv", "fastai",

        # MLOps & Experiment Tracking
        "mlflow", "wandb", "dvc", "kubeflow", "airflow", "prefect",

        # Data Science & Analysis
        "data science", "data analysis", "data engineering", "feature engineering",
        "statistics", "probability", "regression", "classification", "clustering",
        "dimensionality reduction", "pca", "time series", "forecasting",
        "hypothesis testing", "a/b testing", "pandas", "numpy", "scipy",
        "matplotlib", "seaborn", "plotly",

        # Databases
        "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
        "cassandra", "dynamodb", "sqlite", "oracle", "nosql",

        # Cloud Platforms
        "aws", "azure", "gcp", "google cloud", "amazon web services",
        "sagemaker", "ec2", "s3", "lambda", "bigquery", "databricks",

        # DevOps & Tools
        "docker", "kubernetes", "git", "github", "gitlab", "ci/cd",
        "jenkins", "terraform", "ansible", "linux", "bash",

        # Web & API
        "fastapi", "flask", "django", "rest api", "graphql", "microservices",
        "node.js", "react", "html", "css",

        # Data Engineering
        "spark", "hadoop", "kafka", "airflow", "etl", "data pipeline",
        "data warehouse", "snowflake", "dbt",

        # Soft/General
        "research", "communication", "problem solving", "teamwork",
        "agile", "scrum", "leadership"
    ]

    matched = []
    for skill in skills:
        if skill in text.lower():
            matched.append(skill)
    return matched