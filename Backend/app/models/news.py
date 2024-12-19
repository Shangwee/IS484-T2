from app import db

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    publisher = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    published_date = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    url = db.Column(db.Text, nullable=False, unique=True)
    entity = db.Column(db.String(100), nullable=False)
    sentiment = db.Column(db.String(50), nullable=True)  # e.g., Positive, Neutral, Negative

    
    def __repr__(self):
        return f"<News {self.title[:30]}...>"
