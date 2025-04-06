import React from 'react';
import { formatSentimentClassification } from '../../utils/sentimentAnalysis';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const SentimentScore = ({ 
  score, 
  sentiment, 
  confidence, 
  finbertScore,
  secondModelScore, 
  showDetails = false 
}) => {
  if (!score && score !== 0) {
    return (
      <div
        style={{
          backgroundColor: '#808080',
          borderRadius: '15px',
          padding: '5px 15px',
          color: 'white',
          fontSize: 'calc(1px + 1vw)',
          fontWeight: 'bold',
        }}
      >
        No score found
      </div>
    );
  }

  // Format the sentiment for display (capitalize first letter)
  const formattedSentiment = formatSentimentClassification(sentiment || 'neutral');
  console.log(formattedSentiment)
  // Get background color based on sentiment
  const getBackgroundColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
      case 'bullish':
        return '#28a745'; // Green
      case 'negative':
      case 'bearish':
        return '#dc3545'; // Red
      case 'neutral':
        return '#ffc107'; // Yellow
      default:
        return '#6c757d'; // Default to grey for unknown sentiment
    }
  }; 
  const bgColor = getBackgroundColor(sentiment);
 
  // Normalize score to be between -100 and 100
  const displayScore = typeof score === 'number' ? 
    (score > -100 && score < 100) ? score : (score > 0 ? 100 : -100) : 0;

  // Tooltip content
  const getTooltipContent = () => {
    if (sentiment?.toLowerCase() === 'positive' || sentiment?.toLowerCase() === 'bullish') {
      return "Positive sentiment indicates favorable news or outlook for this entity";
    } else if (sentiment?.toLowerCase() === 'negative' || sentiment?.toLowerCase() === 'bearish') {
      return "Negative sentiment indicates unfavorable news or outlook for this entity";
    } else {
      return "Neutral sentiment indicates balanced or mixed news for this entity";
    }
  };

  return (
    <div className="sentiment-score-container">
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`sentiment-tooltip-${displayScore}`}>{getTooltipContent()}</Tooltip>}
      >
        <div
          style={{
            backgroundColor: bgColor,
            borderRadius: '15px',
            padding: '5px 15px',
            color: 'white',
            fontSize: 'calc(1px + 1vw)',
            fontWeight: 'bold',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          {displayScore.toFixed(1)} ({formattedSentiment})
        </div>
      </OverlayTrigger>
      
      {showDetails && (
        <div className="sentiment-details mt-2 text-sm">
          {confidence && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="confidence-tooltip">Higher confidence indicates more reliable sentiment analysis</Tooltip>}
            >
              <div className="sentiment-confidence">
                <small className="text-muted" style={{ cursor: 'pointer' }}>
                  Confidence: {(confidence * 100).toFixed(0)}%
                </small>
              </div>
            </OverlayTrigger>
          )}
          
          {finbertScore && secondModelScore && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="models-tooltip">Scores from different NLP models used in sentiment analysis</Tooltip>}
            >
              <div className="model-scores mt-1">
                <small className="text-muted" style={{ cursor: 'pointer' }}>
                  FinBERT: {finbertScore.toFixed(1)} | 
                  Second Model: {secondModelScore.toFixed(1)}
                </small>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )}
    </div>
  );
};

export default SentimentScore;