import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import { Link } from 'react-router-dom'; 
import { useParams } from 'react-router-dom';
// import SearchBar from '../ui/Searchbar';
import useFetch from '../../hooks/useFetch';
import Filter from "../news/Filter";
import Sort from '../news/Sort';

// Main News Component
const News = ( {EntityName} ) => {
  const styles = {

    newsBox: {
      position: 'relative',

      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      backgroundColor: '#fff',
      marginBottom: '20px',
      height: 'auto', // Allow height to adjust dynamically
      width: '100%', // Full width of the column
      maxWidth: '600px', // Limit maximum width for larger screens
      margin: '0 auto', // Center the box horizontally
      boxSizing: 'border-box',
    },
    sentimentScore: {
      position:'absolute',
      top:'10px',
      right:'10px',
      fontSize: '0.2rem', // Adjusted for readability
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'right', // Aligns it properly
      zIndex: 1
    },
    newsHeader: {
      fontSize: 'clamp(1rem, 1.5vw, 1.5rem)', // Dynamic font size
      fontWeight: 'bold',
      color: 'black',
      marginBottom: '10px',
    },
    newsSummary: {
      fontSize: 'clamp(0.8rem, 1vw, 1rem)', // Dynamic font size
      color: 'black',
      marginBottom: '5px',
    },
    newsDate: {
      fontSize: 'clamp(0.7rem, 0.8vw, 0.9rem)', // Dynamic font size
      color: 'black',
      marginBottom: '10px',
    },
    newsLink: {
      fontSize: 'clamp(0.9rem, 1vw, 1.1rem)', // Dynamic font size
      color: 'blue',
      textDecoration: 'none',
    },
    sentimentScore: {
      fontSize: 'clamp(0.8rem, 1vw, 1rem)', // Dynamic font size
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'right', // Align it properly
    },
    paginationWrapper: {
      display: 'flex',
      justifyContent: 'center', // Center the pagination items
      marginTop: '20px',

  }}

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all"); // Store selected filter
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting to ascending
  const newsPerPage = 3;


  // Fetch news data
  console.log(EntityName)
  const url = `/news/${EntityName}`;
  const { data, loading, error } = useFetch(url);

  // Extract news data from the response
  const newsData = data ? data.data : [];
  console.log("News Data:", newsData);
  const now = new Date();

  console.log("Current Page:", currentPage);
  console.log("Total News Items:", newsData.length);
  console.log("Sort Order:", sortOrder);


  // // Filter news based on search term
  // const filteredNews = newsData.filter((news) =>
  //   news.title.toLowerCase().includes(searchTerm.toLowerCase()) 
  //   || news.summary.toLowerCase().includes(searchTerm.toLowerCase())
  // );

    // Handle sort order change
    const handleSortChange = (event) => {
      console.log('Sort Order:', event);
      const value = event;
      setSortOrder(value); // Change sort order to ascending or descending
    };

    // Handle search term change
    const handleSearchChange = (term) => {
    console.log('Search Term:', term);  // Check the updated search term
    setSearchTerm(term); // Update search term in the parent component
  };

    // Handle filter change
    const handleFilterChange = (selectedFilter) => {
      console.log('Selected Filter:', selectedFilter);
      setFilter(selectedFilter);
      setCurrentPage(1); // Reset to first page when filtering
    };

    // Filter news based on date range
    const filteredNews = newsData
    .filter((news) => {
      const newsDate = new Date(news.published_date);
      const hoursAgo = (now - newsDate) / (1000 * 60 * 60); // Convert to hours

      if (filter === "24") return hoursAgo <= 24;
      if (filter === "48") return hoursAgo <= 48;
      if (filter === "7d") return hoursAgo <= 168; // 7 days * 24 hours
      return true; // "All Time" (default)
    })
    .filter((news) => news.title.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // Sort the filtered news based on sentiment score
  const sortedNews = [...filteredNews].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.sentiment - b.sentiment; // Ascending order
    } else {
      return b.sentiment - a.sentiment; // Descending order
    }
  });
  

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
  }
  return (
    <Container fluid>
      {/* Search Bar */}
      
      <Row className="justify-content-center g-0">
        <Col xs={12} md={4} lg={3} className="p-0">
          <Filter onFilterChange={handleFilterChange} />
        </Col>
        <Col xs={12} md={4} lg={3} className="p-0">
          <Sort onSortChange={handleSortChange} />
        </Col>
      </Row>

      {/* News Content */}
      <Row className=" justify-content-center mt-4">
        {currentNews.map((news, index) => {
          if (!news) {
            console.warn(`News item at index ${index} is missing or undefined`);
            return null;
          }

          return (
            <Col key={news.id || index} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
              <div style={styles.newsBox}>
              <div style={styles.sentimentScore}>
                    <SentimentScore text={news.title + news.summary} />
                  </div>
                <h4 style={styles.newsHeader}>
                  <Link to={news.url} target="_blank" rel="noopener noreferrer" style={styles.newsLink}>
                    {news.title}
                  </Link>
                </h4>
                
                <p style={styles.newsSummary}><strong>Publisher:</strong> {news.publisher}</p>
                <p style={styles.newsDate}><strong>Date:</strong> {new Date(news.published_date).toDateString()}</p>
                <p style={styles.newsSummary}>{news.description?.slice(0, 150)}...</p>
                {/* SentimentScore component */}
            
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Pagination Controls */}
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div style={styles.paginationWrapper}>
            <Pagination>{paginationItems}</Pagination>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default News;