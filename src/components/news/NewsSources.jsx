import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/SentimentScore';
import { Link } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';

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
    "sentiment" : 0.67
  },
  {
    "id" : 137,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.65
  },
  {
    "id" : 138,
    "publisher" : "AOL",
    "description" : "TAIPEI (Reuters) -Chipmaker TSMC said on Tuesday that all its sites were operating following an overnight 6.4 magnitude earthquake...",
    "published_date" : "2025-01-23T18:19:20.000Z",
    "title" : "TSMC says all its sites operating following Taiwan quake - AOL",
    "url" : "https:\/\/www.aol.com\/news\/tsmc-says-sites-operating-following-040739515.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.92
  },
  {
    "id" : 139,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.43
  },
  {
    "id" : 140,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.23
  }, 
  {
    "id" : 141,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.3
  },
  {
    "id" : 142,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.8
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
    "sentiment" : 0.92
  }, 
  {
    "id" : 145,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.83
  },
  {
    "id" : 146,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.43
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
    "sentiment" : 0.49
  }, 
  {
    "id" : 148,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.33
  },
  {
    "id" : 149,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.93
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
    "sentiment" : 0.97
  }, 
  {
    "id" : 152,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.32
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
    "sentiment" : 0.44
  }, 
  {
    "id" : 154,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.5
  },
  {
    "id" : 155,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.3
  },
  
  {
    "id" : 150,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.9
  }, 
  {
    "id" : 152,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.1
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
    "sentiment" : 0.3
  }, 
  {
    "id" : 154,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.9
  },
  {
    "id" : 155,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.33
  },
  {
    "id" : 150,
    "publisher" : "TrendForce",
    "description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations...",
    "published_date" : "2025-01-23T18:36:00.000Z",
    "title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
    "url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.46
  }, 
  {
    "id" : 151,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.76
  },
  {
    "id" : 152,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.68
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
    "sentiment" : 0.96
  }, 
  {
    "id" : 154,
    "publisher" : "Yahoo Finance",
    "description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC...",
    "published_date" : "2025-01-23T12:05:00.000Z",
    "title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
    "url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.54
  },
  {
    "id" : 155,
    "publisher" : "Arizona Big Media",
    "description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry...",
    "published_date" : "2025-01-23T04:10:30.000Z",
    "title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
    "url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
    "entities" : "{\"entities\": [\"TSMC\"]}",
    "sentiment" : 0.55
  },
];

// Main News Component
const NewsSources = () => {
    const location = useLocation();
    console.log("Location object:", location);

    const { id } = location.state || {id: null}; // Retrieve the id from state
    console.log(id);  

    const filteredNewsData = id ? newsData.filter((newsItem) => newsItem.id === id) : newsData;
    console.log(filteredNewsData);
    
    const styles = {
      newsBox: {
        minHeight: '350px', // Ensure all boxes are at least 350px tall
        maxHeight: '400px', // Optional: Limit maximum height to prevent large content overflow
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px', // Add some padding for better spacing
        display: 'flex', // Flex container for child alignment
        flexDirection: 'column', // Align content vertically
        justifyContent: 'space-between', // Space out the header, content, and footer evenly
        overflow: 'hidden', // Handle overflow gracefully
    },
    newsHeader: {
      fontSize: 'calc(10px + 1vw)', // Dynamic font size
      fontWeight: 'bold',
      color: '#555555',

    },
    newsSummary: {
        fontSize: 'calc(12px + 0.5vw)',
        color: '#555555',
        overflow: 'hidden', // Hide overflowing content
        textOverflow: 'ellipsis', // Add ellipsis for truncated text
        display: '-webkit-box', // Ensure multiline truncation works
        WebkitLineClamp: 5, // Limit to 5 lines
        WebkitBoxOrient: 'vertical',
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
      fontSize: '14px',
      color: '#4CAF50', // Example color for sentiment score
      fontWeight: 'bold',
      position: 'absolute', // Position sentiment score absolutely inside the news box
      top: '20px',  // Adjust this value for vertical positioning
      right: '10px', // Adjust this value for horizontal positioning
    }

  };

  if (!id) {
    return <p>No ID provided. Please navigate correctly.</p>;
  } else {
  return (
    <Container fluid className="news-container">
      <Row style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredNewsData.map((newsItem) => (
          <Col key={newsItem.id} md={5} className="mb-4 ml-4" style={{ display: 'flex' }}>
             
            <div style={styles.newsBox} className="news-box">
              <Link 
              to={newsItem.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.newsLink}
              >  
                <h4 style={styles.newsHeader}>{newsItem.title}</h4>  
              </Link> 
              <div style={styles.sentiment}>
                <SentimentScore  newsId={newsItem.id} />
              </div>
              <h4 style={styles.newsDate}>{new Date(newsItem.published_date).toLocaleDateString()}</h4> 
              {/* <h4 style={styles.newsLink}>{newsItem.link}</h4>  */}
              <p style={styles.newsSummary}>{newsItem.description}</p> 
              <div style={styles.sentiment}>
              </div>
              

            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
}

export default NewsSources;

