import React, { useState } from 'react';
import { BsJustify } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';


const SearchBar = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchChange = (event) => {
    const term = event.target.value;
    console.log('Search Term:', term);  
    setSearchTerm(term); // Update local state
    onSearchChange(term); // Notify parent component
  };

  return (
    <div style={styles.searchBar}>
      <div style={styles.iconUp}>↗</div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search News..."
        style={styles.input}
      />
      <div style={styles.iconSearch}><FaSearch /></div>
    </div>
  );
};
const styles = {
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '2px', // Adjusted padding for better responsiveness
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%', // Take up full width of the parent column
    maxWidth: 'none', // Remove max-width restriction
    height: 'auto', // Allow height to adjust dynamically
    boxSizing: 'border-box', // Ensures padding and border are included in width
    // marginLeft: '-20px', // Pushes the search bar to the right
  },
  iconUp: {
    fontSize: 'calc(1rem + 0.5vw)', // Dynamic font size for responsiveness
    color: '#ccc',
    marginRight: '8px', // Added margin to separate from input
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: 'calc(0.9rem + 0.5vw)', // Dynamic font size for responsiveness
    color: '#333',
    flex: 1, // Allow input to grow and take available space
    padding: '0 8px', // Added padding for better spacing
    minWidth: '100px', // Minimum width for smaller screens
  },
  iconSearch: {
    fontSize: 'calc(1.2rem + 0.5vw)', // Dynamic font size for responsiveness
    color: '#4267B2',
    cursor: 'pointer',
    marginLeft: '8px', // Added margin to separate from input
  },
};

export default SearchBar;
