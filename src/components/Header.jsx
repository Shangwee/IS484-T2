import React from 'react';
import Searchbar from './Searchbar';
import Backbutton from './Backbutton';

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
    padding: "30px 40px 30px 40px",
    display: "flex",
    justifyContent: "right",
    width: "100%",   
  },
};

export default Header