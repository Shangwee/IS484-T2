import React from 'react';
import { useParams } from 'react-router-dom';
import Entity from '../../components/entity/Entity';
import Price from '../../components/ui/Price';
import EntityVisuals from '../../components/entity/Entityvisuals';
import EntityNews from '../../components/entity/Entitynews';
import useFetch from '../../hooks/useFetch';
import '../../styles/App.css';
import ReportButton from '../../components/ui/export';
import SendPDF from '../../components/ui/SendReport';
import { Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';

const EntityPage = () => {
  const { ticker } = useParams();
  console.log(ticker);
  const url = `/entities/${ticker}`;
  const { data, loading, error } = useFetch(url);
  const EntityName = data ? data.data.name : "N/A";
  const stockID = data ? data.data.id : "N/A";
  const EntityTicker = data ? data.data.ticker : "N/A";

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error fetching entity data.</div>;

  const scores = {
    finbert: 0.85,
    gemini: -0.45,
    combined: 0.0,
  };

  const getColor = (score) => {
    if (score > 0) return 'success';
    if (score < 0) return 'danger';
    return 'secondary';
  };

  return (
    <div className="App">
      <main className="App-content">
        {/* Top Row */}
        <div style={styles.topRow}>
          {/* Entity Ticker */}
          <div style={styles.entityWrapper}>
            <Entity EntityTicker={EntityTicker} />
          </div>

          {/* Sentiment Scores */}
          <div style={styles.sentimentWrapper}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <OverlayTrigger placement="top" overlay={<Tooltip id="finbert-tooltip">FinBERT Score: {scores.finbert} is calculated with ...</Tooltip>}>
                <Badge bg={getColor(scores.finbert)} style={styles.badge}>FinBERT: {scores.finbert}</Badge>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="gemini-tooltip">Gemini Score: {scores.gemini} is calculated with ...</Tooltip>}>
                <Badge bg={getColor(scores.gemini)} style={styles.badge}>Gemini: {scores.gemini}</Badge>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="combined-tooltip">Combined Score: {scores.combined} is calculated with ...</Tooltip>}>
                <Badge bg={getColor(scores.combined)} style={styles.badge}>Combined: {scores.combined}</Badge>
              </OverlayTrigger>
            </div>
          </div>
          {/* Price and Buttons */} 
          <div style={styles.priceAndButtonsContainer}>
            <div style={styles.priceWrapper}>
              <Price id={stockID} />
            </div>
            <div style={styles.buttonWrapper}>
              <ReportButton EntityName={EntityName} />
              <SendPDF EntityName={EntityName} />
            </div>
          </div>
        </div>

        {/* Visuals Section */}
        <div style={styles.visualsWrapper}>
          <EntityVisuals id={stockID} />
        </div>

        {/* News Section */}
        <div style={styles.newsWrapper}>
          <EntityNews EntityName={EntityName} />
        </div>
      </main>
    </div>
  );
};

const styles = {
  // Single Row Layout
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Distributes space evenly
    flexWrap: 'wrap', // Allows wrapping for smaller screens
    marginTop: '20px',
    padding: '0 10px',
    gap: '10px', // Minimal gap between components
  },
  entityWrapper: {
    flex: '3 3 auto',
    textAlign: 'center',
    margin: '5px', // Reduced margin
  },
  sentimentWrapper: {
    flex: '1 1 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px', // Minimal gap
    margin: '5px', // Reduced margin
  },
  priceAndButtonsContainer: {
    display: 'flex',
    flex: '1 1 auto'
    // justifyContent: 'space-between',
  },
  priceWrapper: {
    flex: '1 1 auto',
    textAlign: 'center',
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)',
    margin: '5px', // Reduced margin
  },
  buttonWrapper: {
    flex: '15  15 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '20px', // Minimal gap
    // margin: '5px', // Reduced margin
  },
  badge: {
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)', // Responsive font size
  },
  visualsWrapper: {
    flex: '1 1 auto',
    margin: '5px', // Reduced margin
  },
  newsWrapper: {
    flex: '1 1 auto',
    margin: '5px', // Reduced margin
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem',
    color: 'red',
  },
};

export default EntityPage;