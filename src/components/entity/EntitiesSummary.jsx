import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import { Link } from 'react-router-dom'; 
import useFetch from '../../hooks/useFetch';

// Main News Component
const Entities = () => {
  const [lineClamp, setLineClamp] = useState(5); // Default line clamp value

  // Dynamically adjust line clamp based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setLineClamp(3); // Fewer lines for smaller screens
      } else if (window.innerWidth < 900) {
        setLineClamp(4); // Medium screens
      } else {
        setLineClamp(5); // Default for larger screens
      }
    };

    // Set initial line clamp value
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        fontSize: 'calc(11px + 0.5vw)', // Dynamic font size
        color: '#555555',
        flexGrow: 1, // Allow summary to grow and fill available space
        overflow: 'hidden', // Prevent content overflow
        textOverflow: 'ellipsis', // Add ellipsis for long text
        
        // Enable multi-line ellipsis
        display: '-webkit-box',
        WebkitLineClamp: 7, // Limit to 3 lines (adjust this value as needed)
        WebkitBoxOrient: 'vertical', // Vertical orientation for text
        
        margin: 0, // Remove default margin for p
        padding: 0, // Remove default padding for p
        
        // Ensure proper height for the truncation to take effect
        maxHeight: '10.8em', // This depends on your font-size and line-height
      },
      sentimentScore: {
        fontSize: '14px',
        color: '#4CAF50', // Example color for sentiment score
        fontWeight: 'bold',
        marginLeft: 'auto', // Pushes the sentiment score to the far right
      },
      scrollableContainer: {
        maxWidth: '1200px', // Prevents stretching too wide
        width: '90%', // Responsive width
        margin: '0 auto', // Centers the whole container
        maxHeight: '600px', // Set max height for scrolling
        overflowY: 'auto', // Enable vertical scrolling
        paddingTop: '10px',
        paddingBottom: '20px',
        borderRadius: '8px',
        boxSizing: 'border-box', // Prevents unwanted overflow
      }
      
      
      };

    // defind url for fetching data
    const url = `/entities/`;

    // useFetch hook to fetch data
    const { data, loading, error } = useFetch(url);

    const entityData = data ? data.data : [];

    console.log("here is the data" , entityData);
      
    return ( 
      <Container fluid className="news-container" style={styles.scrollableContainer}>
        <Row className="d-flex justify-content-center">
          {entityData.map((entityItem) => (
            <Col key={entityItem.id} md={5} className="mb-4 d-flex justify-content-center">
              <Link to={`/entity/${entityItem.id}/${entityItem.name}`} style={{ textDecoration: 'none' }}>
                <div style={styles.entityBox}>
                  <div style={styles.entityHeader}>
                    <h4 style={styles.entityName}>{entityItem.name}</h4>
                    <span style={styles.sentimentScore}>
                      <SentimentScore />
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
    