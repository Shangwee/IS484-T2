import React, { useState } from 'react';
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
 
  const getColor = (sentimentType) => {
    if (sentimentType > 0) return 'success';
    if (sentimentType < 0) return 'danger';
    return 'secondary';
  };

  const { ticker } = useParams();
  console.log(ticker);
  const url = `/entities/${ticker}`;
  const { data, loading, error } = useFetch(url);
  const EntityName = data ? data.data.name : "N/A";
  const stockID = data ? data.data.id : "N/A";
  const EntityTicker = data ? data.data.ticker : "N/A";

  const sentimentTypes = {
    AvgSentiment: data ? parseFloat(data.data.sentiment_score).toFixed(1) : 0,
    simpleAverage: data ? parseFloat(data.data.simple_average).toFixed(1) : 0,
    TimeDecay: data ? parseFloat(data.data.time_decay).toFixed(1) : 0,
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error fetching entity data.</div>;

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
           

          <div style={styles.sentimentToggle}>
          <div style={{ display: 'flex', gap: '6px' }}>
              <OverlayTrigger placement="top" overlay={<Tooltip id="finbert-tooltip">Weighted combination of multiple NLP models' sentiment predictions with confidence factored in.</Tooltip>}>
                <Badge bg={getColor(sentimentTypes.AvgSentiment)} style={styles.badge}>Average Sentiment Score: {sentimentTypes.AvgSentiment}</Badge>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="gemini-tooltip">Direct average of all article sentiment scores without weighting or adjustments.</Tooltip>}>
                <Badge bg={getColor(sentimentTypes.simpleAverage)} style={styles.badge}>Simple Average: {sentimentTypes.simpleAverage}</Badge>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="combined-tooltip">Recent articles weighted more heavily than older ones to reflect current market sentiment.</Tooltip>}>
                <Badge bg={getColor(sentimentTypes.TimeDecay)} style={styles.badge}>Time Decay: {sentimentTypes.TimeDecay}</Badge>
              </OverlayTrigger>
            </div>
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
  badge: {
    fontSize: '1rem',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '500',
    cursor: 'pointer',
},
  priceAndButtonsContainer: {
    display: 'flex',
    flex: '2 2 auto'
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