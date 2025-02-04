import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaChartBar, FaNewspaper } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/App.css'; // Import your CSS file here

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to handle navigation programmatically
  const navigateTo = (path) => {
    console.log(`Navigating to ${path}`);
    // Replace this with your actual navigation logic (e.g., using window.location or history.push)
    window.location.href = path; // Example: Redirects to the specified path
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle Button */}
      <button 
        className="toggle-btn" 
        onClick={toggleSidebar} 
        aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Sidebar Content */}
      <div className="sidebar-content">
        <h1 aria-hidden={true}>Senti Finance</h1>
        <ul>
          <li onClick={() => navigateTo('/Entitiespage')}>
            <FaChartBar />
            <span className="sidebar-text">Entities</span>
          </li>
          <li onClick={() => navigateTo('/Newspage')}>
            <FaNewspaper />
            <span className="sidebar-text">News</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;