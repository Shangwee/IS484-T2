import React from 'react';
import { formatSentimentClassification } from '../../utils/sentimentAnalysis';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const EntitySentiment = ({ entityScore, className = '' }) => {
  if (!entityScore) {
    return (
      <div className={`entity-sentiment no-data ${className}`}>
        No entity sentiment data available
      </div>
    );
  }

  const { 
    unified_score, 
    classification, 
    confidence, 
    article_count,
    entity
  } = entityScore;

  // Format the sentiment for display (capitalize first letter)
  const formattedSentiment = formatSentimentClassification(classification);

  // Get background color based on sentiment
  const getBackgroundColor = (sentiment) => {
    const sentimentLower = sentiment?.toLowerCase() || 'neutral';
    
    switch (sentimentLower) {
      case 'bullish': return '#00CB14';
      case 'bearish': return '#FF4D4D';
      case 'neutral': return '#FFA500';
      // Support for legacy terminology
      case 'positive': return '#00CB14';
      case 'negative': return '#FF4D4D';
      default: return '#808080';
    }
  };

  // Score color
  const bgColor = getBackgroundColor(formattedSentiment);

  return (
    <div className={`entity-sentiment-container ${className}`}>
      <div className="entity-name mb-1 font-bold text-lg">
        {entity}
      </div>
      
      <div className="entity-score-display p-3 rounded-lg" style={{ backgroundColor: bgColor + '20' }}>
        <div className="flex justify-between items-center">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="entity-sentiment-tooltip">Overall sentiment based on news articles about this entity</Tooltip>}
          >
            <div className="sentiment-label text-sm" style={{ cursor: 'pointer' }}>Entity Sentiment</div>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="entity-score-tooltip">
                {formattedSentiment === 'Bullish' || formattedSentiment === 'Positive' 
                  ? "Positive outlook based on recent news coverage" 
                  : formattedSentiment === 'Bearish' || formattedSentiment === 'Negative'
                    ? "Negative outlook based on recent news coverage"
                    : "Mixed or neutral outlook based on recent news coverage"}
              </Tooltip>
            }
          >
            <div 
              className="score-badge px-3 py-1 rounded-full text-white font-bold"
              style={{ backgroundColor: bgColor, cursor: 'pointer' }}
            >
              {unified_score.toFixed(1)} ({formattedSentiment})
            </div>
          </OverlayTrigger>
        </div>
        
        <div className="score-details mt-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="confidence-tooltip">Higher confidence means more reliable sentiment analysis results</Tooltip>}
            >
              <span style={{ cursor: 'pointer' }}>Confidence:</span>
            </OverlayTrigger>
            <span>{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="article-count-tooltip">Number of news articles analyzed to determine sentiment</Tooltip>}
            >
              <span style={{ cursor: 'pointer' }}>Based on:</span>
            </OverlayTrigger>
            <span>{article_count} article{article_count !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntitySentiment;