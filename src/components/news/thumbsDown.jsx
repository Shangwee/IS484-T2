import React, { useState } from "react";

function ThumbsDown({ setNegativeRating, negativeRatings }) {
  const [isHovered, setIsHovered] = useState(false);

  function dislikeHandler() {
    setNegativeRating((prevRatings) => prevRatings + 1);
  }

  return (
    <div style={styles.thumbContainer}>
      <span
        style={{ ...styles.thumbs, color: isHovered ? "black" : "transparent" }}
        onClick={dislikeHandler}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        &#x1F44E;
      </span>
      <span style={styles.counter}>{negativeRatings}</span>
    </div>
  );
}

const styles = {
  thumbs: {
    textShadow: "0 0 0 #4789C0",
    fontSize: "28px",
    cursor: "pointer",
    transition: "color 0.5s",
    padding: "0 8px 0 0",
  },
  counter: {
    fontSize: '20px',  // Adjust the font size as needed
    fontWeight: 'bold',  // Optional: Make the counter bold
  },
  thumbContainer: {
    userSelect: "none",
  },
};

export default ThumbsDown;
