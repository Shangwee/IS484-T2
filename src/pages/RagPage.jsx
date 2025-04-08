import React from 'react';
import Navbar from '../components/Navbar';
import RagInterface from '../components/ui/RagInterface';

/**
 * RAG/Copilot Page
 * 
 * This page provides the RAG (Retrieval-Augmented Generation) interface
 * allowing users to query the system about financial news and entities.
 */
const RagPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '15px' }}>
        <div style={{ 
          backgroundColor: '#f7f7f7', 
          padding: '10px 15px', 
          borderRadius: '5px',
          marginBottom: '15px',
          borderLeft: '4px solid #1976d2'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>AI Copilot (Internal Tool)</h3>
          <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
            Quick client-facing insights based on our financial sentiment analysis
          </p>
        </div>
        <RagInterface />
      </div>
    </div>
  );
};

export default RagPage;