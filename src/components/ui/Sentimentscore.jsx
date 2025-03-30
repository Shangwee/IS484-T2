import React from 'react';

const SentimentScore = ({score, sentiment}) => {
  if (!score | !sentiment) {
    return <div style={{
      backgroundColor: '#808080',
      borderRadius: '15px',
      padding: '5px 15px',
      color: 'white',
      fontSize: 'calc(1px + 1vw)',
      fontWeight: 'bold'
      }}>No score found</div>;
  }

  const getBackgroundColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return '#00CB14';
      case 'bearish': return '#FF4D4D';
      case 'neutral': return '#FFA500';
      default: return '#808080';
    }
  };

  return (
    <div style={{
      backgroundColor: getBackgroundColor(sentiment),
      borderRadius: '15px',
      padding: '5px 15px',
      color: 'white',
      fontSize: 'calc(1px + 1vw)',
      fontWeight: 'bold'
    }}>
      {score?.toFixed(2)} ({sentiment})
    </div>
  );
};

export default SentimentScore;
