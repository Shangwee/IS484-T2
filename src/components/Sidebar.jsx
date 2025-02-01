import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Install react-icons if not done yet
import { Link } from 'react-router-dom'; // Import Link for routing
import '../styles/App.css';

function Sidebar() {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };  

  const styles = {

    list1: {
      listStyleImage: 'url("https://img.icons8.com/ios-filled/50/combo-chart--v1.png")'
      ,marginBottom: "80px",
      marginLeft:'40px',
      fontWeight:'bold'
    },
  
    list2: {
      listStyleImage: 'url("https://img.icons8.com/ios/50/event-accepted-tentatively.png")'    
      ,marginLeft:'40px'

      ,fontWeight:'bold'
    },
    
  };
  

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
      <div className="sidebar-content">

      <h1> Senti Finance</h1> 
        <ul>
        <li style={styles.list1}>
            {/* Entities */}
            <Link to="/Entitiespage" className="sidebar-link">Entities</Link>
        </li>
        <li style={styles.list2}>
          <Link to="/Newspage" className="sidebar-link">News</Link>
        </li>
      </ul>
      </div>
    </div>
  );
}


export default Sidebar;

