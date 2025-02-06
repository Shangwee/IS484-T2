import React from "react";

const Filter = ({ onFilterChange }) => {
  return (
    <div style={styles.filterContainer}>
      <label htmlFor="filter" style={styles.filterLabel}>Filter by Date:</label>
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
    gap: "10px",
    marginBottom: "20px",
  },
  filterLabel: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  filterDropdown: {
    padding: "5px",
    fontSize: "14px",
    borderRadius: "5px",
  },
};

export default Filter;
