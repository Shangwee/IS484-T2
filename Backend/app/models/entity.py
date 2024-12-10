from app import db

class Entity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    sector = db.Column(db.String(100), nullable=True)
    region = db.Column(db.String(100), nullable=True)

    def __repr__(self):
        return f"<Entity {self.name}>"
