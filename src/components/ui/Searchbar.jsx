import React, { useState } from 'react';

const SearchBar = ({ onSearchChange }) => {
  const [searchItem, setSearchItem] = useState('');

  // Handle input change and pass the search term to the parent component
  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
    onSearchChange(searchTerm); // Pass the search term to the parent component
  };

  return (
    <div style={styles.searchBar}>
      <div style={styles.iconUp}>↗</div>
      <input
        type="text"
        value={searchItem}
        onChange={handleInputChange}
        placeholder="Search News..."
        style={styles.input}
      />
      <div style={styles.iconSearch}>🔍</div>
    </div>
  );
};

const styles = {
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '30px',
    padding: '5px 10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '200px', // Set a smaller fixed width
    height: '45px', // Adjusted for better proportion
    position: 'absolute', // Absolute positioning
    top: '10px', // Position from top
    right: '10px', // Position from right
    marginRight: '0', // Ensure no extra margin
  },
  iconUp: {
    fontSize: '2rem',
    color: '#ccc',
    marginRight: '5px',
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#333',
    flex: 1,
  },
  iconSearch: {
    fontSize: '1.8rem',
    color: '#4267B2',
    cursor: 'pointer',
  },
};

export default SearchBar;
