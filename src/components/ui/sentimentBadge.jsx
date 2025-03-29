import React from 'react';
import { Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';

const SentimentBadge = ({ label, score, description }) => {
  const getColor = (score) => {
    if (score > 0) return 'success';
    if (score < 0) return 'danger';
    return 'secondary';
  };

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={`${label}-tooltip`}>{description}</Tooltip>}
    >
      <Badge bg={getColor(score)} style={{ fontSize: '1rem', padding: '5px 10px' }}>
        {label}: {score.toFixed(2)}
      </Badge>
    </OverlayTrigger>
  );
};

const SentimentScores = ({ scores = { finbert: 100, gemini: -20, combined: 0 } }) => {
    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        <SentimentBadge label="FinBERT" score={scores.finbert} description={`FinBERT Score: ${scores.finbert} is calculated using ...`} />
        <SentimentBadge label="Gemini" score={scores.gemini} description={`Gemini Score: ${scores.gemini} is calculated using ...`} />
        <SentimentBadge label="Combined" score={scores.combined} description={`Combined Score: ${scores.combined} is calculated using ...`} />
      </div>
    );
  };
  
export default SentimentScores;
