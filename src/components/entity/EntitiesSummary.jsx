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
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
        width: '100%', // Ensure full width of the column
        height: '250px', // Constant height for all boxes
        display: 'flex', // Use flexbox for layout
        flexDirection: 'column', // Stack children vertically
        justifyContent: 'space-between', // Distribute space evenly
      },
      entityHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px',
      },
      entityName: {
        fontSize: 'calc(10px + 1vw)', // Dynamic font size
        fontWeight: 'bold',
        color: 'black',
        marginRight: 'calc(5% + 1vw)', // Responsive right margin
        whiteSpace: 'nowrap', // Prevent text wrapping
      },
      entitySummary: {
        fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
        color: '#555555',
        flexGrow: 1, // Allow summary to grow and fill available space
        overflow: 'hidden', // Prevent content overflow
        textOverflow: 'ellipsis', // Add ellipsis for long text
        display: '-webkit-box', // Enable multi-line ellipsis
        WebkitLineClamp: 5, // Limit to 3 lines
        WebkitBoxOrient: 'vertical', // Vertical orientation for text
        margin: 0, // Remove default margin for p
        marginTop: '15px', // Constant margin between entityName and entitySummary
      },
      sentimentScore: {
        fontSize: '14px',
        color: '#4CAF50', // Example color for sentiment score
        fontWeight: 'bold',
        marginLeft: 'auto', // Pushes the sentiment score to the far right
      },
      scrollableContainer: {
        maxHeight: '600px', // Set a maximum height for the container
        overflowY: 'auto', // Enable vertical scrolling
        paddingTop: '50px', // Add top padding to the container
        paddingBottom: '20px', // Optional: Add bottom padding for symmetry
        paddingRight: '20px', // Optional: Add right padding
        paddingLeft: '20px', // Optional: Add left padding
        borderRadius: '8px', // Optional: Add rounded corners
      },
      };

    // defind url for fetching data
    const url = `/entities`;

    // useFetch hook to fetch data
    const { data, loading, error } = useFetch(url);

    const entityData = data ? data.data : [];

    console.log("here is the data" , entityData);
      
    return ( 
      <Container fluid className="news-container" style={styles.scrollableContainer}>
        <Row>
          {entityData.map((entityItem) => (
            <Col key={entityItem.id} md={5} className="mb-4 ml-4">
              <Link
                to="/"
                state={{ entity: entityItem.name }}
                key={entityItem.id}
                style={{ textDecoration: 'none' }}
              >
                <div style={styles.entityBox} className="news-box">
                  <div style={styles.entityHeader} className="entity-header">
                    <h4 style={styles.entityName}>{entityItem.name}</h4>
                    <span style={styles.sentimentScore}>
                      <SentimentScore sentiment={entityItem.sentiment_score} />
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
    
    export default Entity;
    