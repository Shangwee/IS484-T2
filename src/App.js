import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Entity from './components/entity/Entity';
import SentimentScore from './components/ui/Sentimentscore';
import EntityNews from './components/entity/Entitynews';
import NewsPage from './pages/News/NewsPage';
import IndividualNewsPage from './pages/News/IndividualNewsPage';
import EntitiesPage from './pages/Entities/EntitiesPage';
import Price from './components/ui/Price';
import EntityVisuals from './components/entity/Entityvisuals';
import useFetch from './hooks/useFetch';
import './styles/App.css';

function App() {
  const location = useLocation();
  const url = `/entities/2`; // Hardcoded for now
  const { data, loading, error } = useFetch(url);
  const EntityName = data ? data.data.name : "N/A"; // Extract entity name
  const stockID = data ? data.data.id : "N/A"; // Extract stock ID

  return (
    <div className="App">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="App-content">
        {location.pathname === '/' && (
          <>
            {/* Row for Entity, Price, and SentimentScore */}
            <div style={styles.topRow}>
              <div style={styles.entityWrapper}>
                <Entity id={stockID} />
              </div>
              <div style={styles.priceWrapper}>
                <Price id={stockID} />
              </div>
              <div style={styles.sentimentWrapper}>
                <SentimentScore />
              </div>
            </div>

            {/* Entity Visuals */}
            <div style={styles.visualsWrapper}>
              <EntityVisuals id={stockID}/>
            </div>

            {/* Entity News */}
            <div style={styles.newsWrapper}>
              <EntityNews EntityName={EntityName} />
            </div>
          </>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/EntitiesPage" element={<EntitiesPage />} />
          <Route path="/NewsPage" element={<NewsPage />} />
          <Route path="/IndividualNewsPage" element={<IndividualNewsPage />} />
        </Routes>
      </main>
    </div>
  );
}

// Styles
const styles = {
/* The `topRow` style object in the code snippet you provided is defining the styling properties for a
row that contains multiple components. Here's a breakdown of what each property is doing: */
  topRow: {
    marginTop: '70px', // Add margin to separate from the top
    display: 'flex', // Align components horizontally
    alignItems: 'center', // Vertically center the components
    boxSizing: 'border-box',
    maxWidth: '600px', // Limit maximum width for larger screens
    marginLeft: 'auto', // Centers horizontally
    marginRight: 'auto', // Centers horizontally
      flexWrap: 'wrap', // Allow wrapping on smaller screens
  },
  entityWrapper: {
    flex: 1, // Allow Entity to take up available space
    textAlign: 'left', // Align text to the left
    minWidth: '200px', // Prevent excessive shrinking
  },
  priceWrapper: {
    flex: 1, // Allow Price to take up available space
    textAlign: 'center', // Center-align the price
    minWidth: '200px', // Prevent excessive shrinking
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)', // Dynamic font size

  },

  
  sentimentWrapper: {
    textAlign: 'right', // Align text to the right
    maxWidth: '400px',
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)', // Dynamic font size

  },
  
  newsWrapper: {
    marginTop: '20px', // Add spacing below the visuals
    maxWidth: '1200px', // Limit maximum width for larger screens
    margin: '0 auto', // Center the container horizontally
  },
};

export default App;