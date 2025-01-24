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
        display: 'flex',
        left: "579px",
        color: 'grey',
        padding: '40px 20px',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
      },
      icon: {
        fontSize: '50px'
      },
};

export default BackButton;