from app import db
from sqlalchemy.dialects.postgresql import ARRAY

possible_company_region_tags = ["tesla", "apple", "hsbc", "exxon", "americas", "europe", "asia-pacific"]

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    publisher = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    published_date = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    url = db.Column(db.Text, nullable=False, unique=True)
    entities = db.Column(ARRAY(db.String), nullable=True)  # e.g., ["Tesla", "Apple"]
    score = db.Column(db.Float, nullable=True)
    sentiment = db.Column(db.String(50), nullable=True)  # e.g., Positive, Neutral, Negative
    summary = db.Column(db.Text, nullable=True)
    tags = db.Column(ARRAY(db.String), nullable=True)  # e.g., ["Technology", "Business"]

    @property
    def relevant_tags(self):
        if self.tags:
            relevant = [tag for tag in self.tags if tag.lower() in possible_company_region_tags][:2]
            print(f"Relevant tags for {self.title}: {relevant}")  # Debug logging
            return relevant
        return []
    
    def __repr__(self):
        return f"<News {self.title[:30]}...>"