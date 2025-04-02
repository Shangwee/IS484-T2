import React, { useState } from 'react';

const TagFilter = ({ title, options, selectedTags, onSelect }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle collapse/expand state
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div style={styles.filterContainer}>
      {/* Filter Title */}
      <h3
        style={styles.filterTitle}
        onClick={toggleCollapse}
        role="button"
        tabIndex={0}
      >
        {title} {isCollapsed ? '▶' : '▼'}
      </h3>

      {/* Filter Content */}
      {!isCollapsed && (
        <div style={styles.tagList}>
          {options.map((option) => (
           <button
           key={option}
           onClick={() => onSelect(option)}
           style={{
             ...styles.tagButton,
             ...(selectedTags.includes(option) ? styles.selectedTag : {}),
           }}
         >
           {option}
         </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  filterContainer: {
    marginBottom: '20px',
  },
  filterTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    cursor: 'pointer', // Indicates it's clickable
    display: 'flex',
    alignItems: 'center',
    gap: '8px', // Space between arrow and text
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tagButton: {
    padding: '6px 12px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    backgroundColor: '#ccc',
    color: '#333',
  },
  selectedTag: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
};

export default TagFilter;