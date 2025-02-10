// Sort.jsx
import React from 'react';

const Sort = ({ onSortChange }) => {
  const handleSortChange = (event) => {
    onSortChange(event.target.value); // Pass the selected sort order back to parent component
  };

  return (
    <div style={styles.filterContainer}>
      {/* <label htmlFor="sort-select" style={styles.filterLabel}>Sort by Sentiment Score: </label> */}
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
    gap: "10px", // Space between label and dropdown
    marginBottom: "20px",
    flexWrap: "wrap", // Ensures the label and dropdown wrap on smaller screens
    justifyContent: "center", // Centers the content on smaller screens


  },
  filterLabel: {
    fontSize: "calc(0.8rem + 0.5vw)", // Dynamic font size for responsiveness
    fontWeight: "bold",
    color: "black",
    margin: 0, // Prevents unnecessary margin
    textAlign: "center", // Ensures text alignment is consistent
  },
  filterDropdown: {
    padding: "8px", // Increased padding for better touch targets
    fontSize: "calc(0.8rem + 0.5vw)", // Dynamic font size for responsiveness
    borderRadius: "5px",
    border: "1px solid #ccc", // Adds a subtle border for better visibility
    minWidth: "150px", // Ensures the dropdown has a minimum width
    maxWidth: "100%", // Ensures it doesn't overflow on smaller screens
    boxSizing: "border-box", // Ensures padding and border are included in width
  },
};

export default Sort;
