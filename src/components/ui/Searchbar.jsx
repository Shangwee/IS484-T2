import React, { useState } from 'react';
import { BsJustify } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';

const newsData = [
  {
    id: 1,
    title: 'Google-related news 1',
    publisher : "Yahoo Finance",
    description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  },
  {
    id: 2,
    title: 'Google-related news 2',
    publisher : "Google Finance",
    description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 3,
    title: 'Google-related news 3',
    description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    publisher : "Test Finance",
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
  },
  {
    id: 4,
    title: 'Google-related news 4',
    description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    publisher : "Go Finance",
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
  }
, 
{
  id: 5,
  title: 'Google-related news 122',
  description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
  publisher : "Go Finance",
  date: '2023-10-15',
  link: 'https://example.com/news1',
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
}
,
{
  id: 6,
  title: 'Google-related news 123',
  description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
  publisher : "Go Finance",
  date: '2023-10-15',
  link: 'https://example.com/news1',
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
}

]; 

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
    padding: '2px 10px', // Reduced padding to fit better
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '300px', // Increased width to accommodate all elements
    height: '45px', // Adjusted for better proportion
    position: 'absolute', // Absolute positioning
    top: '20px', // Position from top
    right: '20px', // Adjusted position from right
  },
  iconUp: {
    fontSize: '1.2rem', // Reduced size for better fit
    color: '#ccc',
    marginRight: '8px', // Added margin to separate from input
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#333',
    flex: 1, // Allow input to grow and take available space
    padding: '0 8px', // Added padding for better spacing
  },
  iconSearch: {
    fontSize: '1.5rem', // Reduced size for better fit
    color: '#4267B2',
    cursor: 'pointer',
    marginLeft: '8px', // Added margin to separate from input
    marginBottom: '5px', // Adjusted margin for vertical alignment
  },
};

export default SearchBar;
