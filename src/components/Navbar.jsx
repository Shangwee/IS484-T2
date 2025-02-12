import React from 'react';
import { FaChartBar, FaNewspaper } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/App.css'; // Ensure this file has the correct styles for the navbar

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Senti Finance</h1>
      <ul className="nav-links">
        <li>
          <Link to="/EntitiesPage">
            <FaChartBar />
            <span className="nav-text">Entities</span>
          </Link>
        </li>
        <li>
          <Link to="/NewsPage">
            <FaNewspaper />
            <span className="nav-text">News</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
