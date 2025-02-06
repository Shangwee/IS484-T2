import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/Sentimentscore';
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'react-bootstrap/Pagination';
import SearchBar from '../ui/Searchbar';
import Filter from "./Filter";

// Dummy news data
const newsData = [
  {
    "id" : 136,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 137,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 138,
    "publisher" : "AOL",
    "description" : "TAIPEI (Reuters) -Chipmaker TSMC said on Tuesday that all its sites were operating following an overnight 6.4 magnitude earthquake...",
    "published_date" : "2025-01-23T18:19:20.000Z",
    "title" : "TSMC says all its sites operating following Taiwan quake - AOL",
    "url" : "https:\/\/www.aol.com\/news\/tsmc-says-sites-operating-following-040739515.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 139,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 140,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  }, 
  {
    "id" : 141,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 142,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  ,
  {
    "id" : 143,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  }, 
  {
    "id" : 145,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 146,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  ,
  {
    "id" : 147,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  }, 
  {
    "id" : 148,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 149,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  ,
  {
    "id" : 150,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  }, 
  {
    "id" : 151,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 152,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  ,
  {
    "id" : 153,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  }, 
  {
    "id" : 154,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 155,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  
  {
    "id" : 150,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  }, 
  {
    "id" : 151,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 152,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  ,
  {
    "id" : 153,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  }, 
  {
    "id" : 154,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 155,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 150,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  }, 
  {
    "id" : 151,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 152,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  ,
  {
    "id" : 153,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  }, 
  {
    "id" : 154,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
  {
    "id" : 155,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : null
  },
];

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
  const newsPerPage = 4;
  const now = new Date();

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

  // Calculate total pages
  const totalPages = filteredNews.length > 0 ? Math.ceil(filteredNews.length / newsPerPage) : 1;

  // Get the news for the current page
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

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
    <Filter onFilterChange={handleFilterChange} />
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
                <p style={styles.newsSummary}>{news.description?.slice(0, 1000)}</p>
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

export { newsData };