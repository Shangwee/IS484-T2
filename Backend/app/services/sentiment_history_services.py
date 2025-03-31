from app.models import SentimentHistory
from sqlalchemy import func, desc, asc
from app import db

from datetime import datetime, timedelta
import numpy as np

def get_sentiment_history_by_entity_id(entity_id, page=1, per_page=10, sort_order="desc"):
    """Get sentiment history by entity ID"""
    query = SentimentHistory.query.filter(SentimentHistory.entity_id == entity_id)

    # Apply sorting based on sentiment score
    if sort_order == 'asc':
        query = query.order_by(SentimentHistory.date.asc())
    else:
        query = query.order_by(SentimentHistory.date.desc())

    # apply pagination
    sentiment_history_pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    if not sentiment_history_pagination.items:
        return []
    
    sentiment_history_list = [{
        "id": sh.id,
        "entity_id": sh.entity_id,
        "date": sh.date,
        "sentiment_score": sh.sentiment_score
    } for sh in sentiment_history_pagination.items]
    
    return {
        "sentiment_history": sentiment_history_list,
        "total": sentiment_history_pagination.total,
        "pages": sentiment_history_pagination.pages,
        "current_page": sentiment_history_pagination.page,
        "next_page": sentiment_history_pagination.next_num,
        "prev_page": sentiment_history_pagination.prev_num
    }


def create_sentiment_history(entity_id, sentiment_score):
    """Create a new sentiment history entry"""
    date = datetime.now()

    # Check if an entry already exists for this entity on the same calendar day
    existing_entry = SentimentHistory.query.filter(
        SentimentHistory.entity_id == entity_id,
        func.date(SentimentHistory.date) == date.date()
    ).first()

    if existing_entry:
        # Convert np.float64 to standard Python float
        if isinstance(sentiment_score, np.float64):
            sentiment_score = float(sentiment_score)
        existing_entry.sentiment_score = sentiment_score
        db.session.commit()
        return existing_entry.to_dict()  # Or handle as needed (e.g., update, skip, raise error)

    # Convert np.float64 to standard Python float
    if isinstance(sentiment_score, np.float64):
        sentiment_score = float(sentiment_score)

    # Create a new entry if not found
    new_entry = SentimentHistory(
        entity_id=entity_id,
        date=date,
        sentiment_score=sentiment_score
    )
    db.session.add(new_entry)
    db.session.commit()
    return new_entry.to_dict()


def insert_sentiment_history(entity_id, date, sentiment_score):
    try:
        # Convert np.float64 to standard Python float
        if isinstance(sentiment_score, np.float64):
            sentiment_score = float(sentiment_score)

        new_entry = SentimentHistory(
            entity_id=entity_id,
            date=date,
            sentiment_score=sentiment_score
        )
        db.session.add(new_entry)
        db.session.commit()
        return {"status": "success", "message": "Sentiment history inserted successfully"}
    except Exception as e:
        print(f"An error occurred while inserting sentiment history: {e}")
        return {"status": "error", "message": str(e)}