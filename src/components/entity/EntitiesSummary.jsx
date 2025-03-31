import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import { Link } from 'react-router-dom'; 
import useFetch from '../../hooks/useFetch';

const Entities = () => {
  const styles = {
    entityBox: {
      padding: '1.5rem',
      border: '1px solid #ddd',
      borderRadius: '12px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '300px'
    },

    entityHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
    },
    entityName: {
      fontSize: 'clamp(1rem, 2vw, 1.5rem)',
      fontWeight: 'bold',
      color: 'black',
      marginRight: '1rem',
    },
    entitySummary: {
      fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
      color: '#555555',
      flexGrow: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 5,
      WebkitBoxOrient: 'vertical',
      margin: 0,
      padding: 0,
    },
    sentimentScore: {
      fontSize: '0.875rem',
      color: '#4CAF50',
      fontWeight: 'bold',
      marginLeft: 'auto',
    },
    scrollableContainer: {
      maxWidth: '100%',
      width: '100%',
      margin: '0 auto',
      height: 'calc(100vh - 100px)', // Adjust based on your layout
      overflowY: 'auto',
      padding: '1rem',
      borderRadius: '8px',
      boxSizing: 'border-box',
    }
  };

  const url = `/entities/`;
  const { data, loading, error } = useFetch(url);
  const entityData = data ? data.data : [];

  return ( 
    <Container fluid style={styles.scrollableContainer}>
      <Row className="g-4">
        {entityData.map((entityItem) => (
          <Col key={entityItem.id} xs={12} sm={6} lg={4} xl={3}>
            <Link to={`/entity/${entityItem.ticker}`} style={{ textDecoration: 'none' }}>
              <div style={styles.entityBox}>
                <div style={styles.entityHeader}>
                  <h4 style={styles.entityName}>{entityItem.name}</h4>
                  <span style={styles.sentimentScore}>
                    <SentimentScore score={entityItem.sentiment_score} sentiment = {entityItem.classification}  />
                  </span>
                </div>
                <p style={styles.entitySummary}>{entityItem.summary}</p>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Entities;
