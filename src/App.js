import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation correctly
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Entity from './components/Entity';
import Sentimentscore from './components/Sentimentscore';
import News from './components/News';
import Newspage from './pages/Newspage';
import Homepage from './pages/Homepage'; 
import Entityvisuals from './components/entityvisuals';
import './App.css';

function App() {
  const location = useLocation();
  return (
    
      
    <div className="App">
      <header className="App-header">
        <Header/>
   
        <Sidebar/>
        {location.pathname === '/' && 
        (
          <>
            <Entity />
            <Sentimentscore />
            <Entityvisuals/>
            <News/>
          </>
        )}


        <Routes> 
          {/* Define the routes for different pages */}
          <Route path="/Homepage" element={<Homepage />} /> {/* Home Page (root) */}
          <Route path="/Newspage" element={<Newspage />} /> {/* News Page */}
        </Routes>
        

      </header>
    </div>

  );
}


export default App;


