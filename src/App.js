import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation correctly
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Entity from './components/Entity';
import Sentimentscore from './components/Sentimentscore';
import Entitynews from './components/Entitynews';
import Newspage from './pages/Newspage';
import Entitiespage from './pages/Entitiespage'; 
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
            <Entitynews/>

          </>

        )}

        <Routes> 
          {/* Define the routes for different pages */}
          <Route path="/Entitiespage" element={<Entitiespage />} /> {/* Entities Page  */}
          <Route path="/Newspage" element={<Newspage />} /> {/* News Page */}
        </Routes>
        

      </header>
    </div>

  );
}


export default App;


