import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import { Link } from 'react-router-dom'; 
// Dummy news data
const entityData = [
  {
        "id" : 1,
		"name" : "TSMC",
	    "summary" : "TSMC is a Taiwanese multinational semiconductor contract manufacturing and design company. It is the world's most valuable semiconductor company, the world's largest dedicated independent (pure-play) semiconductor foundry, and one of the largest semiconductor companies in the world.",
		"sentiment" : 0.5,
	},
	
];

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
      
    return (
        <Container fluid className="news-container">
          <Row>
            {entityData.map((entityItem) => (
              <Col key={entityItem.id} md={5} className="mb-4 ml-4">
                 <Link to="/" key={entityItem.id} style={{ textDecoration: 'none' }}> 
                <div style={styles.entityBox} className="news-box">
                    <div style={styles.entityHeader} className='entity-header'>
                        <h4 style={styles.entityName}>{entityItem.name}</h4> 
                        <span style={styles.sentiment}>
                            <SentimentScore  entityId={entityItem.id} />
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
    