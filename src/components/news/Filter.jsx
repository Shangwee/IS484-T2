import React from "react";

const Filter = ({ onFilterChange }) => {
  return (
    <div style={styles.filterContainer}>
      {/* <label htmlFor="filter" style={styles.filterLabel}>Filter by Date:</label> */}
      <select id="filter" onChange={(e) => onFilterChange(e.target.value)} style={styles.filterDropdown}>
        <option value="all">All Time</option>
        <option value="24">Last 24 Hours</option>
        <option value="48">Last 48 Hours</option>
        <option value="7d">Last 7 Days</option>
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
    width: '100%', // Take up full width of the parent column
    maxWidth: 'none', // Remove max-width restriction
    boxSizing: 'border-box', // Ensures padding and border are included in width

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

export default Filter;
