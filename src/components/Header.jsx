import React from 'react';
// import Searchbar from './ui/SearchBar';
import Backbutton from './ui/BackButton';
import { useLocation } from 'react-router-dom';

const routePaths = ['/Entitiespage', '/Newspage'];

const Header = () => {
  const location = useLocation();
  // Check if current pathname is included in the routePaths array
  const isBackButtonNotVisible = routePaths.some(path => location.pathname.startsWith(path));

  return (
    <header style={styles.header}>
      {!isBackButtonNotVisible && <Backbutton />}
    </header>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    zIndex: 1000,       
    padding: "10px 10px",  // Adjusted padding for better responsiveness
    display: "flex",
    justifyContent: "flex-end",  // Aligning the content to the right
    width: "100%",   
  },
};

export default Header