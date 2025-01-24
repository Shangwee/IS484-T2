// News.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

// Dummy news data
const newsData = [
  {
    id: 1,
    title: 'Dummy news 1',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  },
  {
    id: 2,
    title: 'Dummy news 2',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 3,
    title: 'Dummy news 3',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
  },
  {
    id: 4,
    title: 'Dummy news 4',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
  },
  {
    id: 5,
    title: 'Dummy news 5',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 6,
    title: 'Dummy news 6',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 7,
    title: 'Dummy news 1',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 7,
    title: 'Dummy news 7',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 8,
    title: 'Dummy news 8',
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },

];

// Main News Component
const News = () => {
  const styles = {

    newsBox: {
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    newsHeader: {
      fontSize: '58px',
      fontWeight: 'bold',
      color: '#555555',

    },
    newsSummary: {
      fontSize: '54px',
      color: '#555555',
    },
    newsDate: {
      fontSize: '54px',
      color: '#555555',
    },
    
    newsLink: {
      fontSize: '54px',
      color: '#555555',
    },

  };

  return (
    <Container fluid className="news-container">
      <Row>
        {newsData.map((newsItem) => (
          <Col key={newsItem.id} md={5} className="mb-4 ml-4">
            <div style={styles.newsBox} className="news-box">
              <h4 style={styles.newsHeader}>{newsItem.title}</h4> 
              <h4 style={styles.newsDate}>{newsItem.date}</h4> 
              <h4 style={styles.newsLink}>{newsItem.link}</h4> 
              <p style={styles.newsSummary}>{newsItem.summary}</p> 
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default News;

