import React from 'react';
import SentimentAnalysis from '../../utils/sentimentAnalysis';

const SentimentScore = (text) => {
  const [sentiment, setSentiment] = React.useState(null);

  if (!text) {
    return <div style={{
      backgroundColor: '#808080',
      borderRadius: '15px',
      padding: '5px 15px',
      color: 'white',
      fontSize: 'calc(1px + 1vw)',
      fontWeight: 'bold'
      }}>No text provided</div>;
  }

  const getBackgroundColor = (classification) => {
    switch (classification?.toLowerCase()) {
      case 'positive': return '#00CB14';
      case 'negative': return '#FF4D4D';
      case 'neutral': return '#FFA500';
      default: return '#808080';
    }
  };

  if (!sentiment) {
    SentimentAnalysis(text).then(result => {
      console.log(result);
      setSentiment(result);
    });

    return <div style={{
      backgroundColor: '#808080',
      borderRadius: '15px',
      padding: '5px 15px',
      color: 'white',
      fontSize: 'calc(1px + 1vw)',
      fontWeight: 'bold'
    }}>Analyzing...</div>;
  }

  return (
    <div style={{
      backgroundColor: getBackgroundColor(sentiment.classification),
      borderRadius: '15px',
      padding: '5px 15px',
      color: 'white',
      fontSize: 'calc(1px + 1vw)',
      fontWeight: 'bold'
    }}>
      {sentiment.numerical_score?.toFixed(2)} ({sentiment.classification})
    </div>
  );
};

export default SentimentScore;
