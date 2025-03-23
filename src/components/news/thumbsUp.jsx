import React, { useState } from 'react';

function ThumbsUp(props) {
  const [isHovered, setIsHovered] = useState(false);

  function likeHandler() {
    props.setPositiveRating(prevRatings => prevRatings + 1);
  }

  return (
    <div style={styles.thumbContainer}>
      <span
        style={{ ...styles.thumbs, color: isHovered ? 'green' : 'transparent' }}
        onClick={likeHandler}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        &#128077;
      </span>
      <span style={styles.counter}>{props.positiveRatings}</span>
    </div>
  );
}

const styles = {
  thumbs: {
    textShadow: '0 0 0 #4789C0',
    fontSize: '28px',
    cursor: 'pointer',
    transition: 'color 0.5s',
    padding: '0 8px 0 0',
  },
  counter: {
    fontSize: '20px',  // Adjust the font size as needed
    fontWeight: 'bold',  // Optional: Make the counter bold
  },
  thumbContainer: {
    userSelect: 'none',
  },
};

export default ThumbsUp;
