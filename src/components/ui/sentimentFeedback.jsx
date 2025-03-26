import React, { useState } from 'react';
import '../../styles/sentimentFeedback.css'; // External CSS file
// import Swal from "sweetalert2"; // SweetAlert2 for notifications

const SentimentFeedbackForm = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [sentimentScore, setSentimentScore] = useState(50); // Default sentiment score (range: 0-100)

  // Handle sentiment score changes
  const handleSliderChange = (event) => {
    setSentimentScore(parseInt(event.target.value, 10));
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Selected Option:', selectedOption);
  };

  return (
    <div className="feedback-form">
      <h2>Sentiment Feedback Form</h2>
      <p>Article: "Tesla Q3 Earnings Report"</p>
      <p>Model disagreement detected:</p>
      <div>
        <span style={{ color: 'green' }}>FinBERT: Bullish (+65)</span>
        &nbsp;&nbsp;
        <span style={{ color: 'red' }}>Gemini: Bearish (-45)</span>
      </div>

      <p>Your assessment:</p>
      <div>
        <label>
          <input
            type="radio"
            name="sentiment"
            value="bullish"
            onChange={handleOptionChange}
          />
          Bullish
        </label>
        &nbsp;&nbsp;
        <label>
          <input
            type="radio"
            name="sentiment"
            value="neutral"
            onChange={handleOptionChange}
          />
          Neutral
        </label>
        &nbsp;&nbsp;
        <label>
          <input
            type="radio"
            name="sentiment"
            value="bearish"
            onChange={handleOptionChange}
          />
          Bearish
        </label>
      </div>
     {/* Sentiment Score Slider */}
     <div style={{ marginTop: "20px" }}>
        <p>Sentiment Score: {sentimentScore}</p>
        <input
          type="range"
          min="0"
          max="100"
          value={sentimentScore}
          onChange={handleSliderChange}
          className="slider"
        />
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SentimentFeedbackForm;