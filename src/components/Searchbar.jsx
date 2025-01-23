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
    width: "530px",
    height:"100px",
    marginRight:"50px"
  },
  iconUp: {
    fontSize: "2.7rem",
    color: "#ccc",
    marginRight: "5px",
  },
  input: {
    border: "none",
    outline: "none",
    fontSize: "1.5rem",
    color: "#333",
    flex: 1,
  },
  iconSearch: {
    fontSize: "2.2rem",
    color: "#4267B2",
    cursor: "pointer",
  },
};

export default SearchBar;