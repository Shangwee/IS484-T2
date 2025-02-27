import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import SearchBar from '../ui/Searchbar';
import { Link } from 'react-router-dom'; 
import Pagination from 'react-bootstrap/Pagination';
import Filter from "./Filter";
import Sort from './Sort'; 
import useFetch from '../../hooks/useFetch';

const News = () => {
  const styles = {
    newsBox: {
      position: 'relative',
      margin: '20px auto',
      maxWidth: '800px',
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      backgroundColor: '#fff',
      marginBottom: '20px',
      boxSizing: 'border-box',
    },
    newsHeader: {
      fontSize: 'calc(0.5rem + 0.2vw)',
      fontWeight: 'bold',
      color: 'black',
      marginBottom: '10px',
    },
    newsLink: {
      fontSize: 'calc(0.8rem + 0.2vw)',
      color: 'blue',
      textDecoration: 'none',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      flexWrap: 'wrap',
    },
    newsSummary: {
      fontSize: 'calc(0.9rem)',
      color: 'black',
      marginBottom: '5px',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 6,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    newsDate: {
      fontSize: 'calc(0.8rem)',
      color: 'black',
      marginBottom: '5px',
    },
    sentimentScore: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      fontSize: '0.2rem',
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'right',
      zIndex: 1
    },
    paginationWrapper: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    noNewsMessageContainer: {
      height: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };  

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState('asc');
  const newsPerPage = 4;

  const { data, loading, error } = useFetch('/news/');
  const newsData = data ? data.data : [];
  const now = new Date();

  const handleSortChange = (event) => {
    console.log('Sort Order:', event);
    const value = event;
    setSortOrder(value);
  };

  const handleSearchChange = (term) => {
    console.log('Search Term:', term);
    setSearchTerm(term);
  };

  const handleFilterChange = (selectedFilter) => {
    console.log('Selected Filter:', selectedFilter);
    setFilter(selectedFilter);
    setCurrentPage(1);
  };
  const filteredNews = newsData
  .filter((news) => {
    const newsDate = new Date(news.published_date);
    console.log(newsDate)
    const timeDifference = now - newsDate;
    console.log(timeDifference)
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    console.log(hoursDifference)
    const daysDifference = hoursDifference / 24;
    console.log(daysDifference)

    switch (filter) {
      case "24":
        return hoursDifference <= 24;
      case "48":
        return hoursDifference <= 48;
      case "7d":
        return daysDifference <= 7;
      default:
        return true; // "All Time" (default)
    }
  })


  .filter((news) => news.title.toLowerCase().includes(searchTerm.toLowerCase()));
// Sort the filtered news based on sentiment score
const sortedNews = [...filteredNews].sort((a, b) => {
  const scoreA = parseFloat(a.score) || 0;
  const scoreB = parseFloat(b.score) || 0;

  if (sortOrder === 'asc') {
    return scoreA - scoreB;
  } else {
    return scoreB - scoreA;
  }
});

// Paginate sorted news
const totalPages = sortedNews.length > 0 ? Math.ceil(sortedNews.length / newsPerPage) : 1;
const indexOfLastNews = currentPage * newsPerPage;
const indexOfFirstNews = indexOfLastNews - newsPerPage;
const currentNews = sortedNews.slice(indexOfFirstNews, indexOfLastNews);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginationItems = [];
  const pageRange = 5;
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
      <Row className="justify-content-center mt-3">
        <Col xs={12} md={4} lg={3} className="mb-3 mb-md-0">
          <SearchBar onSearchChange={handleSearchChange} />
        </Col>
        <Col xs={12} md={4} lg={3} className="mb-3 mb-md-0">
          <Filter onFilterChange={handleFilterChange} />
        </Col>
        <Col xs={12} md={4} lg={3}>
        <Sort onSortChange={(value) => setSortOrder(value)} />
        </Col>
      </Row>

      <Row className="mt-4">
        {currentNews.length > 0 ? (
          currentNews.map((news, index) => (
            <Col key={news.id || index} xs={12} sm={6} className="d-flex justify-content-center mb-4">
              <div style={styles.newsBox}>
                <div style={styles.headerContainer}>
                  <div style={{ marginTop: '25px' }}>
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
                      <SentimentScore text={news.title + news.summary} />
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
