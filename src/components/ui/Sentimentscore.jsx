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
  const onAnalyze = async () => {
    const sentiment = await SentimentAnalysis(text);
    console.log(sentiment);
    setSentiment(sentiment);
  };

  const getBackgroundColor = (classification) => {
    switch (classification?.toLowerCase()) {
      case 'positive': return '#00CB14';
      case 'negative': return '#FF4D4D';
      case 'neutral': return '#FFA500';
      default: return '#808080';
    }
  };

  if (!sentiment) {
    return (
      <button 
        onClick={onAnalyze}
        style={{
          padding: '5px 10px',
          borderRadius: '15px',
          border: 'none',
          backgroundColor: '#808080',
          color: 'white',
          fontSize: 'calc(1px + 1vw)',
          cursor: 'pointer'
        }}
      >
        Analyze
      </button>
    );
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