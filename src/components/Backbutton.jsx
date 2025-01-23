import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa'; // Importing a left arrow icon from react-icons

const BackButton = ({ onClick }) => {
    return (
      <button onClick={onClick} style={styles.button}>
        <FaArrowLeft style={styles.icon} />
      </button>
    );
  };
  
const styles = {
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