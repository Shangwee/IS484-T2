import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation correctly
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Entity from './components/entity/Entity';
import Sentimentscore from './components/ui/Sentimentscore';
import Entitynews from './components/entity/Entitynews';
import Newspage from './pages/Newspage';
import Individualnewspage from './pages/Individualnewspage';
import Entitiespage from './pages/Entitiespage'; 
import Price from './components/ui/Price';
// import Entityvisuals from './components/entityvisuals';
import './styles/App.css';

function App() {
  const location = useLocation();

    const containerStyle = {
      display: 'flex', // Use flexbox to align elements horizontally in the same row
      alignItems: 'center', // Vertically align the items to the center
      width: '100%',
      position: 'fixed',
      top: '100px',
      left: '669px',
       };

  const sentimentStyle = {
    position: 'fixed',
    top: '300px',
    left: '440px', // Adjust this value to position it next to Price
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const stockID = "1"; // Hardcoded stock ID for now
  
  
  return (
    
    <div className="App">
      <header className="App-header">
        <Header/>
   
        <Sidebar/>

        {location.pathname === '/' && 
        (
          <>
            <div style={containerStyle}>
              <Entity />
              <Price id="2"/>
              <div style={sentimentStyle}>
              <Sentimentscore />
              </div>
            </div>

            <Entitynews/>
          </>

        )}
        <Routes> 
          <Route path="/Entitiespage" element={<Entitiespage />} /> {/* Entities Page  */}
          <Route path="/Newspage" element={<Newspage />} /> {/* News Page */}
          <Route path="/Individualnewspage" element={<Individualnewspage />} />
        </Routes>
        

      </header>
    </div>

  );
}


export default App;


