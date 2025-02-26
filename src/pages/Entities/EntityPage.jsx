import React from 'react';
import { useParams } from 'react-router-dom';
import Entity from '../../components/entity/Entity';
import Price from '../../components/ui/Price';
import SentimentScore from '../../components/ui/Sentimentscore';
import EntityVisuals from '../../components/entity/Entityvisuals';
import EntityNews from '../../components/entity/Entitynews';
import useFetch from '../../hooks/useFetch';
import '../../styles/App.css';
import ReportButton from '../../components/ui/export';
import SendPDF from '../../components/ui/SendReport';

const EntityPage = () => {
  const { id } = useParams();
  const url = `/entities/${id}`;
  const { data, loading, error } = useFetch(url);
  const EntityName = data ? data.data.name : "N/A";
  const stockID = data ? data.data.id : "N/A";

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching entity data.</p>;

  return (
    <div className="App">
      <main className="App-content">
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
          {/* Buttons in the same row as entity, price, and sentiment score */}
          <div style={styles.buttonWrapper}>
            <ReportButton EntityName={EntityName} />
            <SendPDF EntityName={EntityName} />
          </div>
        </div>

        <div style={styles.visualsWrapper}>
          <EntityVisuals id={stockID} />
        </div>

        <div style={styles.newsWrapper}>
          <EntityNews EntityName={EntityName} />
        </div>
      </main>
    </div>
  );
};

const styles = {
  topRow: {
    marginTop: '70px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexWrap: 'wrap',
  },
  entityWrapper: {
    flex: 1,
    textAlign: 'left',
    minWidth: '200px',
    marginRight: '0px',  
  },
  priceWrapper: {
    flex: 1,
    textAlign: 'center',
    minWidth: '200px',
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)',
    marginRight: '5px', 
  },
  sentimentWrapper: {
    textAlign: 'right',
    maxWidth: '400px',
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)',
    marginRight: '20px',  // Increased gap between sentiment score and buttons
  },
  buttonWrapper: {
    display: 'flex',
    gap: '10px', // Reduced gap between buttons
    marginLeft: 'auto', // Align buttons to the right
    marginRight: '0', // Align buttons to the right
    flexShrink: 0, // Prevent button wrapper from shrinking
  },
  visualsWrapper: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  newsWrapper: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

export default EntityPage;
