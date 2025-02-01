import React, { useState } from 'react';

const SearchBar = () => {
  return (
    <div style={styles.searchBar}>
      <div style={styles.iconUp}>↗</div>
      <input
        type="text"
        placeholder="GOOG"
        style={styles.input}
      />
      <div style={styles.iconSearch}>🔍</div>
    </div>
  );
};

const styles = {
  searchBar: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "30px",
    padding: "5px 10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "auto",  // Allowing width to be dynamic
    maxWidth: "80vw",  // Max width based on viewport
    height: "45px",   // Adjusted for better proportion
    marginRight: "20px",  // Reduced margin
  },
  iconUp: {
    fontSize: "2rem",
    color: "#ccc",
    marginRight: "5px",
  },
  input: {
    border: "none",
    outline: "none",
    fontSize: "1rem",
    color: "#333",
    flex: 1,
  },
  iconSearch: {
    fontSize: "1.8rem",
    color: "#4267B2",
    cursor: "pointer",
  },
};

export default SearchBar;