import React, { useState, useEffect } from 'react';
import '../../styles/sentimentFeedback.css'; // External CSS file
import { Modal, Button } from 'react-bootstrap';
import useFetch from '../../hooks/useFetch';
import { useLocation } from 'react-router-dom';


  const SentimentFeedbackForm = ({newsTitle}) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [sentimentScore, setSentimentScore] = useState(50); // Default sentiment score (range: 0-100)
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const location = useLocation();
    console.log("Location object:", location);

    const { id } = location.state || {id: null}; // Retrieve the id from state
    console.log(id);  
    const { data, loading, error } = useFetch(`/news/${id}`); // Fetch news data from the API with the id parameter
    const filteredNewsData = data ? data.data : []; // Extract news data from the response
    
    console.log(filteredNewsData)

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

      setShowModal(true); // Show modal on successful submission
    };

    return (
      <div className="feedback-form">
        <h2>Sentiment Feedback Form</h2>
        <h3>Article: {newsTitle}</h3>
        <p>Model disagreement detected:</p>
        <div>
        
        <span style={{ color: 'green' }}>
        FinBERT:
        { Math.ceil(filteredNewsData.score)}
        </span>

        &nbsp;&nbsp;
        
        <span style={{ color: 'red' }}>
        Gemini: 
          { Math.ceil(filteredNewsData.score)}
        </span>

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