import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa'; // Importing a left arrow icon from react-icons
import { Link } from 'react-router-dom'; // Import Link for routing

const BackButton = ({ onClick }) => {
    return (
      <Link to="/" style={styles.link}>
      <button onClick={onClick} style={styles.button}>
        <FaArrowLeft style={styles.icon} />
      </button>
      </Link>

    );
  };
  
const styles = {
  link: {
    textDecoration: 'none', // Remove underline from the link
},
    button: {
        position:'fixed',
        left: '20vw',  // Positioning based on viewport width for responsiveness
        top: '10px',  // Adjusted for spacing from top
        color: 'grey',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
      },
      icon: {
        fontSize: '2.5rem'
      },
};

export default BackButton;