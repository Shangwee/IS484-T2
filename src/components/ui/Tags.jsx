import React from 'react';

const Tags = ({ tags = [] }) => {
  console.log("Tags received:", tags);  // Debug logging
  const styles = {
    tagContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px',
    },
    tag: {
      backgroundColor: '#f0f0f0',
      borderRadius: '5px',
      padding: '5px 10px',
      fontSize: '0.9rem',
      color: '#333',
      border: '1px solid #007bff',
      color: '#007bff',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.tagContainer}>
      {tags.map((tag, index) => (
        <div key={index} style={styles.tag}>
          {tag}
        </div>
      ))}
    </div>
  );
};

export default Tags;