from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

# Initialize model once
model_name = "yiyanghkust/finbert-tone"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
sentiment_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

def get_sentiment(text):
    results = sentiment_pipeline(text)
    scores_dict = {item['label'].lower(): item['score'] for item in results}
    numerical_score = scores_dict.get('positive', 0) - scores_dict.get('negative', 0)
    
    return {
        'numerical_score': numerical_score,
        'classification': 'Positive' if numerical_score > 0.1 else 'Negative' if numerical_score < -0.1 else 'Neutral',
        'detailed_scores': scores_dict
    }