import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import SearchBar from '../ui/Searchbar';
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'react-bootstrap/Pagination';
import Filter from "./Filter";
import Sort from './Sort'; 
import useFetch from '../../hooks/useFetch';



// Main News Component
const News = () => {
  const styles = {
    newsBox: {
      position: 'relative',
      margin: '20px auto', // Centers the box horizontally and adds vertical spacing
      maxWidth: '400px', // Fixed maximum width for consistency
      width: '100%', // Makes it responsive on smaller screens
      height: 'auto', // Allows the height to adjust based on content
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '15px', // Increased padding for better spacing
      backgroundColor: '#fff',
      marginBottom: '20px', // Adds space between news boxes
      boxSizing: 'border-box', // Ensures padding and border are included in width
    },
    headerContainer: {
      display: 'flex', // Ensures header & sentiment score are in the same row
      justifyContent: 'space-between', // Pushes them apart
      alignItems: 'center', // Aligns them vertically
      width: '100%', // Ensures full width usage
      flexWrap: 'wrap', // Allows wrapping on smaller screens
    },
  newsHeader: {
    fontSize: 'calc(0.5vw)', // Dynamic font size for better responsiveness
    fontWeight: 'bold',
    color: 'black',
    margin: 0, // Prevents unnecessary margin causing misalignment
    marginBottom: '10px',
  },
  newsSummary: {
    fontSize: 'calc(0.8rem)', // Slightly smaller than the header
    color: 'black',
    marginBottom: '5px',
  },
  newsDate: {
    fontSize: 'calc(0.8rem )', // Smaller font size for the date
    color: 'black',
    marginBottom: '5px',
  },
  newsLink: {
    fontSize: 'calc(0.9rem + 0.5vw)', // Slightly smaller than the header
    color: 'blue', // Changed to blue for better link visibility
    textDecoration: 'none',
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
  paginationWrapper: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap', // Allows pagination buttons to wrap on smaller screens
  },
  noNewsMessageContainer: {
    height: '500px', // Same height as your news box
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all"); // Store selected filter
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting to ascending
  const newsPerPage = 4;

  const { data, loading, error } = useFetch('/news/'); // Fetch news data from the API

  const newsData = data ? data.data : []; // Extract news data from the response
  
  const now = new Date();

  console.log("Current Page:", currentPage);
  console.log("Total News Items:", newsData.length);
  console.log("Sort Order:", sortOrder);

  // Handle sort order change
  const handleSortChange = (event) => {
    console.log('Sort Order:', event);
    const value = event;
    setSortOrder(value); // Change sort order to ascending or descending
  };

  // Handle search term change
  const handleSearchChange = (term) => {
    console.log('Search Term:', term);
    setSearchTerm(term);

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

  // Calculate total pages
  const totalPages = sortedNews.length > 0 ? Math.ceil(sortedNews.length / newsPerPage) : 1;

  console.log("Total Pages:", totalPages);

  // Get the news for the current page
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = sortedNews.slice(indexOfFirstNews, indexOfLastNews);

  console.log("Index of First News:", indexOfFirstNews);
  console.log("Index of Last News:", indexOfLastNews);
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
    {/* <h2 className="text-center my-4">Latest News</h2> */}
    <Row className="justify-content-center mt-3">
        <Col xs={12} md={4} lg={3} className="mb-3 mb-md-0">
          <SearchBar onSearchChange={handleSearchChange} />
        </Col>
        <Col xs={12} md={4} lg={3} className="mb-3 mb-md-0">
          <Filter onFilterChange={handleFilterChange} />
        </Col>
        <Col xs={12} md={4} lg={3}>
          <Sort onSortChange={handleSortChange} />
        </Col>
      </Row>

      {/* News Content */}
      <Row className="mt-4">
        {currentNews.length > 0 ? (
          currentNews.map((news, index) => (
            <Col key={news.id || index} xs={12} sm={6} className="d-flex justify-content-center mb-4">
              <div style={styles.newsBox}>
                <div style={styles.headerContainer}>
                <div style={{ marginTop: '25px' }}> {/* Offset to avoid overlapping */}

                  <h4 style={styles.newsHeader} >
                    <Link
                      to='/Individualnewspage'
                      state={{ id: news.id }}
                      rel="noopener noreferrer"
                      style={styles.newsLink}
                    >
                      {news.title}
                    </Link>
                  </h4>
                  <div style={styles.sentimentScore}>
                    <SentimentScore sentiment={news.sentiment || "N/A"} />
                  </div>
                </div>
                <p style={styles.newsSummary}><strong>Publisher:</strong> {news.publisher}</p>
                <p style={styles.newsDate}><strong>Date:</strong> {new Date(news.published_date).toDateString()}</p>
                <p style={styles.newsSummary}>{news.description?.slice(0, 300)}</p>
              </div>
              </div>

            </Col>
          ))
        ) : (
          <div style={styles.noNewsMessageContainer}>
            <p className="text-center" style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
              No news available.
            </p>
          </div>
        )}
      </Row>

      {/* Pagination Controls */}
      <Row className="justify-content-center ">
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