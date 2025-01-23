// News.js
import React from 'react';
import NewsBox from './News/newsbox';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';


const News = () => {
  const newsData = [
    {
      id: 1,
      title: 'Dummy news 1',
      summary: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 2,
      title: 'Dummy news 2',
      summary: 'lorem ipsum dolor sit amet, consectetur adipiscing elit',
    },
    {
      id: 3,
      title: 'Dummy news 3',
      summary: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ',
    },
    {
      id: 4,
      title: 'Dummy news 4',
      summary: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ',
    }
    
  ];

  return (

    <Container fluid className="news-container">
    <Row >
      {newsData.map((newsItem) => (
        <Col 
          key={newsItem.id} 
          md={5} 
          className="mb-4 ml-4"
        > 
          <NewsBox newsItem={newsItem} />
        </Col>
      ))}
    </Row>
  </Container>

  );
};

export default News;
