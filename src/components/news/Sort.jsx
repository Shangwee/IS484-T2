// Sort.jsx
import React from 'react';

const Sort = ({ onSortChange }) => {
  const handleSortChange = (event) => {
    onSortChange(event.target.value); // Pass the selected sort order back to parent component
  };

  return (
    <div style={styles.filterContainer}>
      <label htmlFor="sort-select" style={styles.filterLabel}>Sort by Sentiment Score: </label>
      <select id="sort-select" onChange={handleSortChange} style={styles.filterDropdown}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

const styles = {
    filterContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px",
    },
    filterLabel: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "black",
    },
    filterDropdown: {
        padding: "5px",
        fontSize: "14px",
        borderRadius: "5px",
    },
    };

export default Sort;
