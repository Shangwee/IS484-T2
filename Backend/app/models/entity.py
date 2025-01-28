from app import db

class Entity(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    summary = db.Column(db.Text, nullable=True)
    sentiment_score = db.Column(db.Float, nullable=True)

    def __repr__(self):
        return f"<Entity {self.name}>"
