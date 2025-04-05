import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const handleSearchChange = (event) => {
    const term = event.target.value;
    onSearchChange(term); // Notify the parent component about the change
  };

  return (
    <div style={styles.searchBar}>
      <div style={styles.iconSearch}><FaSearch /></div>
      <input
        type="text"
        value={searchTerm} // Use the searchTerm passed from parent
        onChange={handleSearchChange} // Call the parent callback when the input changes
        placeholder="Search News..."
        style={styles.input}
      />
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
  },
  iconSearch: {
    fontSize: 'calc(1rem + 1vw)', // Dynamic font size for responsiveness
    color: '#ccc',
    marginLeft: '8px', // Added margin to separate from input
    marginBottom: '5px', // Adjusted margin for better alignment
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
};

export default SearchBar;
