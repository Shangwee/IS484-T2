import React, { useState, useEffect } from 'react';
import '../../styles/sentimentFeedback.css'; // External CSS file
import { Modal, Button } from 'react-bootstrap';
import useFetch from '../../hooks/useFetch';
import { useLocation } from 'react-router-dom';
import { postData } from '../../services/api';


  const SentimentFeedbackForm = ({newsTitle}) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const location = useLocation();
    console.log("Location object:", location);

    const { id } = location.state || {id: null}; // Retrieve the id from state
    console.log(id);  

    const { data, loading, error } = useFetch(`/news/${id}`); // Fetch news data from the API with the id parameter
    const filteredNewsData = data ? data.data : []; // Extract news data from the response
    
    console.log(filteredNewsData)
    const agreementScore = filteredNewsData.agreement_rate
    console.log(agreementScore)

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
      // Prepare data for submission
      const feedbackData = {
        userID: 1, // Replace with actual user ID for now dummy data
        newsID: id,
        assessment: selectedOption,
      };

      console.log('Feedback data:', feedbackData);
      // Send feedback to the backend
      postData('/feedback/', feedbackData)
        .then((response) => {
          console.log('Feedback submitted successfully:', response);
          // Show success modal
          setShowModal(true);
        })
        .catch((error) => {
          console.error('Error submitting feedback:', error);
        });
    };

  // Disable the form if agreementScore is 1
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching news data.</div>;
  }

  if (!filteredNewsData || agreementScore === 1) {
    return <div style={{ color: 'white', fontStyle: 'italic' }}>No feedback required</div>;
  }
  
    return (
      <div className="feedback-form">
        <h2>Sentiment Feedback Form</h2>
        <h3>Article: {newsTitle}</h3>
        <p>Model disagreement detected!</p>
        <div>
        
        <span style={{ color: 'green' }}>
        FinBERT:
        { Math.ceil(filteredNewsData.finbert_score)}
        </span>

        &nbsp;&nbsp;
        
        <span style={{ color: 'red' }}>
        Gemini: 
          { Math.ceil(filteredNewsData.second_model_score)}
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

        <button onClick={handleSubmit}>Submit</button>
       {/* Submission Success Modal */}
       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Feedback Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p><strong>Sentiment:</strong> {selectedOption ? selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1) : 'N/A'}</p>
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