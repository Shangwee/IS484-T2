import React from 'react';
import { formatSentimentClassification } from '../../utils/sentimentAnalysis';

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
          <div className="sentiment-label text-sm">Entity Sentiment</div>
          <div 
            className="score-badge px-3 py-1 rounded-full text-white font-bold"
            style={{ backgroundColor: bgColor }}
          >
            {unified_score.toFixed(1)} ({formattedSentiment})
          </div>
        </div>
        
        <div className="score-details mt-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Confidence:</span>
            <span>{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Based on:</span>
            <span>{article_count} article{article_count !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntitySentiment;