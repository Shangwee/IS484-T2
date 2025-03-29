from app import db
from sqlalchemy.dialects.postgresql import ARRAY

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    publisher = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    published_date = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    url = db.Column(db.Text, nullable=False, unique=True)
    entities = db.Column(ARRAY(db.String), nullable=True)  # e.g., ["TSLA", "AAPL", "Technology", "Business"]
    score = db.Column(db.Float, nullable=True)
    finbert_score = db.Column(db.Float, nullable=True)
    second_model_score = db.Column(db.Float, nullable=True)
    sentiment = db.Column(db.String(50), nullable=True)  # e.g., Positive, Neutral, Negative
    summary = db.Column(db.Text, nullable=True)
    tags = db.Column(ARRAY(db.String), nullable=True)  # e.g., ["Technology", "Business"]
    confidence = db.Column(db.Float, nullable=True)
    agreement_rate = db.Column(db.Float, nullable=True)
    
    def __repr__(self):
        return f"<News {self.title[:30]}...>"
