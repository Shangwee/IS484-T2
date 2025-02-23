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
          <div >
            <ReportButton companyId="tsmc" />
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
  },
  priceWrapper: {
    flex: 1,
    textAlign: 'center',
    minWidth: '200px',
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)',
  },
  visualsWrapper: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  sentimentWrapper: {
    textAlign: 'right',
    maxWidth: '400px',
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)',
  },
  
  newsWrapper: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

export default EntityPage;
