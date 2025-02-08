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
      marginLeft: '140px',
      height: '300px',
      width: '565px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      backgroundColor: '#fff',
      marginBottom: '1px',
    },
    headerContainer: {
      display: 'flex',  // Ensures header & sentiment score are in the same row
      justifyContent: 'space-between',  // Pushes them apart
      alignItems: 'center',  // Aligns them vertically
      width: '100%',  // Ensures full width usage
    },
    newsHeader: {
      fontSize: 'calc(9px + 1vw)',
      fontWeight: 'bold',
      color: 'black',
      margin: 0, // Prevents unnecessary margin causing misalignment
      marginBottom: '10px', 
    },
    newsSummary: {
      fontSize: 'calc(8px + 0.5vw)', // Dynamic font size
      color: 'black',
      marginBottom: '5px',
    },
    newsDate: {
      fontSize: 'calc(7px + 0.5vw)', // Dynamic font size
      color: 'black',
      marginBottom: '10px', 
    },
    newsLink: {
      fontSize: 'calc(12px + 0.5vw)',
      color: 'black',
      textDecoration: 'none',
    },
    sentimentScore: {
      fontSize: '8px',
      color: 'black',
      fontWeight: 'bold',
      top: '20px',
      right: '15px',
      textAlign: 'right', // Aligns it properly
    },
    paginationWrapper: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
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
  <Container>
    <h2 className="text-center my-4">Latest News</h2>
    <div style={{ display: 'flex', width: '100%' }}>
        <Filter onFilterChange={handleFilterChange} style={{ marginRight: '10px' }}/>
        <Sort onSortChange={handleSortChange} />
    </div>
    <SearchBar onSearchChange={handleSearchChange} />

    {/* Wrap the news content inside a div */}
    <div>
      {currentNews.length > 0 ? (
        <Row>
          {currentNews.map((news, index) => (
            <Col key={news.id || index} md={6} className="mb-4">
              <div style={styles.newsBox}>
                <div style={styles.headerContainer}>
                  <h4 style={styles.newsHeader}>
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
                <p style={styles.newsSummary}>{news.summary?.slice(0, 300)}</p>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        // Show the "No news available" message in the same space as the Row
        <div style={styles.noNewsMessageContainer}>
          <p className="text-center" style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>No news available.</p>
        </div>
      )}
    </div>

    {/* Pagination Controls */}
    <div style={styles.paginationWrapper}>
      <Pagination>{paginationItems}</Pagination>
    </div>
  </Container>
);
}

export default News;