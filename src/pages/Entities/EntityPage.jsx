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
        <div style={styles.topRow}>
          <div style={styles.entityWrapper}>
            <Entity EntityTicker={EntityTicker} />
          </div>
          <div style={styles.sentimentWrapper}>
            <div style={{ display: 'flex', gap: '10px' }}>
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
        {/* </div> */}

        {/* <div style={styles.bottomRow}> */}
          <div style={styles.priceWrapper}>
            <Price id={stockID} />
          </div>
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
    marginLeft:'10px',
    justifyContent: 'center', // Centers everything in the row

  },
  entityWrapper: {
    flex: 1,
    textAlign: 'center',
    maxWidth: '300px', // Limit the size if needed
    
  },
  sentimentWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    minWidth: '300px',
  },

  priceWrapper: {
    flex: 1,
    textAlign: 'center',
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)',
    maxWidth: '300px', // Limit the size if needed
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end', // Aligns everything to the right
    marginTop: '20px',
    maxWidth: '1200px',
    width: '100%', // Ensures it takes full width
  },
  priceWrapper: {
    textAlign: 'right', // Aligns text inside priceWrapper to the right
    fontSize: 'clamp(0.8rem, 1vw, 1.2rem)',
    maxWidth: '300px',
    flexShrink: 0, // Prevents shrinking
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    minWidth: '300px',
    flexShrink: 0, // Prevents shrinking
  },
  badge: {
    padding: '8px 12px',
    fontSize: '1rem',
  },
};

export default EntityPage;
