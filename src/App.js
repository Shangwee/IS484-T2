import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Entity from './components/Entity';
import Sentimentscore from './components/Sentimentscore';
import News from './components/News';
import Entityvisuals from './components/entityvisuals';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header/>
        <Entity/>
        <Sentimentscore/>
        <Sidebar/>
        <Entityvisuals/>
        <News/>
      </header>
    </div>
  );
}

export default App;


