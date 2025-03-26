  import React, { useState } from 'react';
  import '../../styles/sentimentFeedback.css'; // External CSS file
  import { Modal, Button } from 'react-bootstrap';


  const SentimentFeedbackForm = ({newsTitle}) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [sentimentScore, setSentimentScore] = useState(50); // Default sentiment score (range: 0-100)
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    // Handle sentiment score changes
    const handleSliderChange = (event) => {
      setSentimentScore(parseInt(event.target.value, 10));
    };

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };

    const handleSubmit = () => {
      if (!selectedOption) {
        alert('Please select a sentiment option before submitting.');
        return;
      }
      // alert(`Feedback Submitted!\n\nSentiment: ${selectedOption}\nSentiment Score: ${sentimentScore}`);
      setShowModal(true); // Show modal on successful submission
      // setSelectedOption(null);
      // setSentimentScore(50);      
    };

    return (
      <div className="feedback-form">
        <h2>Sentiment Feedback Form</h2>
        <h3>Article: {newsTitle}</h3>
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
       {/* Submission Success Modal */}
       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Feedback Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p><strong>Sentiment:</strong> {selectedOption ? selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1) : 'N/A'}</p>
          <p><strong>Sentiment Score:</strong> {sentimentScore}</p>
          <p>Thank you for your feedback!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    );
  };

  export default SentimentFeedbackForm;