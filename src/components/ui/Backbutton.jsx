import React from 'react';
import { FaArrowLeft } from 'react-icons/fa'; // Importing a left arrow icon from react-icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate for dynamic navigation

const BackButton = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page in history
  };

  return (
    <button onClick={handleBack} style={styles.button}>
      <FaArrowLeft style={styles.icon} />
    </button>
  );
};

const styles = {
  button: {
    position: 'fixed',
    left: '10vw', // Positioning based on viewport width for responsiveness
    top: '15px', // Adjusted for spacing from top
    color: 'grey',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
  },
  icon: {
    fontSize: '2rem',
  },
};

export default BackButton;
