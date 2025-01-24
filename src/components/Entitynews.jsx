import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from './Sentimentscore';
import { Link } from 'react-router-dom'; 

// Dummy news data
const newsData = [
  {
    id: 1,
    title: 'Google-related news 1',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  },
  {
    id: 2,
    title: 'Google-related news 2',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 3,
    title: 'Google-related news 3',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
  },
  {
    id: 4,
    title: 'Google-related news 4',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
  }

];

// Main News Component
const News = () => {
  const styles = {

    newsBox: {
        position: 'relative',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
    newsHeader: {
      fontSize: 'calc(16px + 1vw)', // Dynamic font size
      fontWeight: 'bold',
      color: '#555555',

    },
    newsSummary: {
      fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
      color: '#555555',
    },
    newsDate: {
      fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
      color: '#555555',
    },
    
    newsLink: {
      fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
      color: '#555555',
    },
    sentimentScore: {
        fontSize: '20px',
        color: '#4CAF50', // Example color for sentiment score
        fontWeight: 'bold',
        position: 'absolute', // Position sentiment score absolutely inside the news box
        top: '20px',  // Adjust this value for vertical positioning
        right: '80px', // Adjust this value for horizontal positioning
      }
  

  };

  return (
    <Container fluid className="news-container">
      <Row>
        {newsData.map((newsItem) => (
          <Col key={newsItem.id} md={5} className="mb-4 ml-4">
            <Link to="/Individualnewspage" key={newsItem.id} style={{ textDecoration: 'none' }}> 
            <div style={styles.newsBox} className="news-box">
              <h4 style={styles.newsHeader}>{newsItem.title}</h4> 
              <div style={styles.sentimentScore}>
              <SentimentScore  newsId={newsItem.id} />
              </div>
              <h4 style={styles.newsDate}>{newsItem.date}</h4> 
              <h4 style={styles.newsLink}>{newsItem.link}</h4> 
              <p style={styles.newsSummary}>{newsItem.summary}</p> 
            </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default News;

