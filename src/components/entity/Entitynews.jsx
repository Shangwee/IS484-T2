import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import { Link } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';
import SearchBar from '../ui/Searchbar';

// Dummy news data 
const newsData = [
  {
    id: 1,
    title: 'Google-related news 1',
    entity: ['TSMC', 'Google'],
    publisher : "Yahoo Finance",
    description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  },
  {
    id: 2,
    title: 'Google-related news 2',
    entity: ['TSMC', 'Google'],
    publisher : "Google Finance",
    description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 3,
    title: 'Google-related news 3',
    entity: ['TSMC', 'Google'],
    description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    publisher : "Test Finance",
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
  },
  {
    id: 4,
    title: 'Google-related news 4',
    entity: ['TSMC', 'Google'],
    description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    publisher : "Go Finance",
    date: '2023-10-15',
    link: 'https://example.com/news1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
  }
, 
{
  id: 5,
  title: 'Google-related news 122',
  entity: ['TSMC', 'Google'],
  description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
  publisher : "Go Finance",
  date: '2023-10-15',
  link: 'https://example.com/news1',
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem.',
}
,
{
  id: 6,
  title: 'Google-related news 123',
  entity: ['TSMC', 'Google'],
  description : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
  publisher : "Go Finance",
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
      left: '10vw',
      top:'220px',
      height: '300px',
      width: '565px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      backgroundColor: '#fff',
      marginBottom: '20px',
    },
    newsHeader: {
      fontSize: 'calc(10px + 1vw)', // Dynamic font size
      fontWeight: 'bold',
      color: 'black',
    },
    newsSummary: {
      fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
      color: 'black',
    },
    newsDate: {
      fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
      color: 'black',
    },
    newsLink: {
      fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
      color: 'black',
      textDecoration: 'none',
    },
    sentimentScore: {

      fontSize: '14px',
      color: 'black',
      fontWeight: 'bold',
      position: 'absolute',
      top: '20px',
      right: '10px',
    },
    paginationWrapper: {
        position: 'absolute',  // Use absolute positioning
        bottom: '5px',        // 20px from the bottom of the page
        left: '55%',           // Center horizontally
        transform: 'translateX(-50%)', // Adjust to truly center (50% offset)
        // marginTop: '20px',
        // display: 'flex',
        // justifyContent: 'center' // Center the pagination items within the flex container  
  }}

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 2;

  const location = useLocation();
  console.log("Location object:", location);

  // Retrieve the entity from the location state
  const { entity } = location.state || {entity: null};
  console.log(entity);  
  

  // Filter news based on search term
  const filteredNews = newsData.filter((news) =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) 
    || news.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

    // Handle search term change
    const handleSearchChange = (term) => {
    console.log('Search Term:', term);  // Check the updated search term
    setSearchTerm(term); // Update search term in the parent component
  };
  
  // Calculate total pages only if filteredNews has data
  const totalPages = filteredNews.length > 0 ? Math.ceil(filteredNews.length / newsPerPage) : 1;

  // Get the news for the current page
  const indexOfLastNews = currentPage * newsPerPage;
  console.log(indexOfLastNews);
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  
  // const cleanedNewsData = newsData.filter(Boolean);
  const currentNews = filteredNews.length > 0 ? filteredNews.slice(indexOfFirstNews, indexOfLastNews) : [];

  console.log("Current Page:", currentPage);
  console.log("Total Pages:", totalPages);
  console.log("Index of First News:", indexOfFirstNews);
  console.log("Index of Last News:", indexOfLastNews);
  console.log("Current News Length:", currentNews.length);
  console.log("Total News Items:", newsData.length);
  console.log("Current News Data:", currentNews);

  // Handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination items (Show only a range of pages for better UX)
  const paginationItems = [];
  const pageRange = 5; // Maximum number of visible page buttons
  let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  let endPage = Math.min(totalPages, startPage + pageRange - 1);

  if (endPage - startPage < pageRange) {
    startPage = Math.max(1, endPage - pageRange + 1);
  }

  for (let number = startPage; number <= endPage; number++) {
    paginationItems.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage} 
        onClick={() => paginate(number)}
      >
        {number}
      </Pagination.Item>
    );
  }return (
    <Container>
      <h2 className="text-center my-4">Latest News</h2>
      <SearchBar onSearchChange={handleSearchChange} />

      <Row>
        {currentNews.map((news, index) => {
          if (!news) {
            console.warn(`News item at index ${index} is missing or undefined`);
            return null;
          }
  
          return (
            <Col key={news.id || index} md={6} className="mb-4">
              <div style={styles.newsBox}>
                <h4 style={styles.newsHeader}>
                  <Link to={news.link} target="_blank" rel="noopener noreferrer" style={styles.newsLink}>
                    {news.title}
                  </Link>
                </h4>
                <p style={styles.newsSummary}><strong>Publisher:</strong> {news.publisher}</p>
                <p style={styles.newsDate}><strong>Date:</strong> {new Date(news.date).toDateString()}</p>
                <p style={styles.newsSummary}>{news.description?.slice(0, 150)}...</p>
                {/* SentimentScore component */}
                <div style={styles.sentimentScore}>
                  <SentimentScore sentiment={news.sentiment || "N/A"} />
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Pagination Controls */}
      <div style={styles.paginationWrapper}>
        <Pagination>
          {paginationItems}
        </Pagination>
      </div>
    </Container>
  );
};

export default News;

export { newsData };