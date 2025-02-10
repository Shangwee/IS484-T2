import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation correctly
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router
import Sidebar from './components/Sidebar';
// import Header from './components/Header';
import Entity from './components/entity/Entity';
import SentimentScore from './components/ui/Sentimentscore';
import EntityNews from './components/entity/Entitynews';
import NewsPage from './pages/News/NewsPage';
import IndividualNewsPage from './pages/News/IndividualNewsPage';
import EntitiesPage from './pages/Entities/EntitiesPage'; 
import Price from './components/ui/Price';
import SearchBar from './components/ui/Searchbar';
import './styles/App.css';
import EntityVisuals from './components/entity/Entityvisuals';
import useFetch from './hooks/useFetch';

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
    top: '30px',
    left: '18vw', // Adjust this value to position it next to Price
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };


  const url = `/entities/2`; // hardcode for now
  
  const { data, loading, error } = useFetch(url); // Fetch the data

  const EntityName = data ? data.data.name : "N/A"; // Extract the entity name from the data

  const stockID = data ? data.data.id : "N/A"; // Extract the stock ID from the data

  return (
    
    <div className="App">
      <header className="App-header">
        {/* <Header/> */}
        {/* <SearchBar/> */}
        <Sidebar/>

        {location.pathname === '/' && 
        (
          <>
            <div style={containerStyle}>
              <Entity id={stockID}/>
              <Price id={stockID}/>
              <span style={sentimentStyle}>
              <SentimentScore /> 
              </span>
            </div>
            <EntityVisuals/>
            <EntityNews EntityName={EntityName}/>
          </>

        )}
        <Routes> 
          <Route path="/EntitiesPage" element={<EntitiesPage />} /> {/* Entities Page  */}
          <Route path="/NewsPage" element={<NewsPage />} /> {/* News Page */}
          <Route path="/IndividualNewsPage" element={<IndividualNewsPage />} />
        </Routes>
        

      </header>
    </div>

  );
}


export default App;


