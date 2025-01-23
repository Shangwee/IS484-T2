import React from 'react';

const NewsSummary = ({ summary }) => {
  return (
    <div className="news-summary">
      <p style={styles.newssummary}>{summary}</p>
    </div>
  );
};


const styles = {
    newssummary:
    {
      fontWeight: "500",
      fontSize: "40px",
      color: "black",
    }
    };

export default NewsSummary;
