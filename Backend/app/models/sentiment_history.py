from app import db

class SentimentHistory(db.Model):    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    entity_id = db.Column(db.Integer, db.ForeignKey('entity.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    sentiment_score = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"<SentimentHistory {self.entity_id} - {self.date} - {self.sentiment_score}>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'entity_id': self.entity_id,
            'date': self.date.strftime('%Y-%m-%d'),
            'sentiment_score': self.sentiment_score
        }