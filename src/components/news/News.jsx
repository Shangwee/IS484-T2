import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from './ui/Sentimentscore';
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'react-bootstrap/Pagination';

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
      marginLeft: '145px',
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
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
  };

  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(newsData.length / newsPerPage);

  // Get the news for the current page
  const indexOfLastNews = currentPage * newsPerPage;
  console.log(indexOfLastNews);
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  
  const cleanedNewsData = newsData.filter(Boolean);
  const currentNews = cleanedNewsData.slice(indexOfFirstNews, indexOfLastNews);

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
                  <Link to={news.url} target="_blank" rel="noopener noreferrer" style={styles.newsLink}>
                    {news.title}
                  </Link>
                </h4>
                <p style={styles.newsSummary}><strong>Publisher:</strong> {news.publisher}</p>
                <p style={styles.newsDate}><strong>Date:</strong> {new Date(news.published_date).toDateString()}</p>
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