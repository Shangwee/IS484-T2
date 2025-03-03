import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import { Link } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';



// Main News Component
const NewsSources = () => {
    const { data, loading, error } = useFetch('/news/'); // Fetch news data from the API

    const newsData = data ? data.data : []; // Extract news data from the response

    const location = useLocation();
    console.log("Location object:", location);

    const { id } = location.state || {id: null}; // Retrieve the id from state
    console.log(id);  

    const filteredNewsData = id ? newsData.filter((newsItem) => newsItem.id === id) : newsData;
    console.log(filteredNewsData);
    
    const styles = {
      newsBox: {
        minHeight: '350px', // Ensure all boxes are at least 350px tall
        maxHeight: '400px', // Optional: Limit maximum height to prevent large content overflow
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px', // Add some padding for better spacing
        display: 'flex', // Flex container for child alignment
        flexDirection: 'column', // Align content vertically
        justifyContent: 'space-between', // Space out the header, content, and footer evenly
        overflow: 'hidden', // Handle overflow gracefully
    },
    newsHeader: {
      fontSize: 'calc(7px + 1vw)', // Dynamic font size
      fontWeight: 'bold',
      color: '#555555',

    },
    newsSummary: {
        fontSize: 'calc(10px + 0.5vw)',
        color: '#555555',
        overflow: 'hidden', // Hide overflowing content
        textOverflow: 'ellipsis', // Add ellipsis for truncated text
        display: '-webkit-box', // Ensure multiline truncation works
        WebkitLineClamp: 5, // Limit to 5 lines
        WebkitBoxOrient: 'vertical',
    },
    newsDate: {
      fontSize: 'calc(8px + 0.5vw)', // Dynamic font size
      color: '#555555',
    },
    
    newsLink: {
      fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
      color: '#555555',
    }, 
    
    sentimentContainer:{
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '10px',
    }
  };

  if (!id) {
    return <p>No ID provided. Please navigate correctly.</p>;
  } else {
  return (
    <Container fluid className="news-container">
      <Row style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredNewsData.map((newsItem) => (
          <Col key={newsItem.id} md={5} className="mb-4 ml-4" style={{ display: 'flex' }}>
             
            <div style={styles.newsBox} className="news-box">
              
            <div style={styles.sentimentContainer}>
                                <SentimentScore text={newsItem.title + newsItem.summary} />
              </div>
              <Link 
              to={newsItem.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.newsLink}
              >  
                <h4 style={styles.newsHeader}>{newsItem.title}</h4>  
              </Link> 
              <h4 style={styles.newsDate}>{new Date(newsItem.published_date).toLocaleDateString()}</h4> 
              {/* <h4 style={styles.newsLink}>{newsItem.link}</h4>  */}
              <p style={styles.newsSummary}>{newsItem.description}</p> 
            
              

            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
}

export default NewsSources;

