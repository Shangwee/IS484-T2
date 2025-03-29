from app import db


class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    assessment = db.Column(db.String(50), nullable=False) # e.g Bullish, Bearish, Neutral
    newsID = db.Column(db.Integer, db.ForeignKey('news.id'), nullable=False)

    def __repr__(self):
        return f"<Feedback {self.assessment}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "userID": self.userID,
            "assessment": self.assessment,
            "newsID": self.newsID
        }
    


