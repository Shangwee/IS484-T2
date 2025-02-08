import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import { Link } from 'react-router-dom'; 
import useFetch from '../../hooks/useFetch';

// Main News Component
const Entity = () => {
    const styles = {
        entityBox: {
          position: 'relative',
          height: '300px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '16px', // Add padding for inner spacing
        },
        entityHeader: {
          display: 'flex',
          justifyContent: 'space-between', // Ensures content is spaced left and right
          alignItems: 'center', // Vertically aligns the name and score
          marginBottom: '12px', // Space between header and summary
        },
        entityName: {
          fontSize: 'calc(10px + 1vw)', // Dynamic font size
          fontWeight: 'bold',
          color: '#555555',
        },
        entitySummary: {
          fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
          color: '#555555',
        },
        sentimentScore: {
          fontSize: '14px',
          color: '#4CAF50', // Example color for sentiment score
          fontWeight: 'bold',
          marginLeft: 'auto', // Pushes the sentiment score to the far right
        },
      };

    // defind url for fetching data
    const url = `/entities`;

    // useFetch hook to fetch data
    const { data, loading, error } = useFetch(url);

    const entityData = data ? data.data : [];

    console.log("here is the data" , entityData);
      
    return ( 
        <Container fluid className="news-container">
          <Row>
            {entityData.map((entityItem) => (
              <Col key={entityItem.id} md={5} className="mb-4 ml-4">
                 <Link 
                    to="/" 
                    state= {{ entity: entityItem.name }}
                    key={entityItem.id} 
                    style={{ textDecoration: 'none' }}> 
                <div style={styles.entityBox} className="news-box">
                    <div style={styles.entityHeader} className='entity-header'>
                        <h4 style={styles.entityName}>{entityItem.name}</h4> 
                        <span style={styles.sentiment}>
                            <SentimentScore  sentiment={entityItem.sentiment_score} />
                        </span>
                    </div>
                  <p style={styles.entitySummary}>{entityItem.summary}</p> 
                  <div style={styles.sentiment}>
                  </div>
                  
    
                </div>
                </Link>
    
              </Col>
            ))}
          </Row>
        </Container>
      );
    };
    
    export default Entity;
    