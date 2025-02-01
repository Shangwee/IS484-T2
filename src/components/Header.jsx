import React from 'react';
import Searchbar from './ui/Searchbar';
import Backbutton from './ui/Backbutton';

const Header = () => {
  return (
    <header style={styles.header}>
      <Backbutton/>
      <Searchbar />
    </header>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    zIndex: 1000,       
    padding: "20px 30px",  // Adjusted padding for better responsiveness
    display: "flex",
    justifyContent: "flex-end",  // Aligning the content to the right
    width: "100%",   
  },
};

export default Header