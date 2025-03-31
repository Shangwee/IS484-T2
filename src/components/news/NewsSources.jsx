import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Badge, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const NewsSources = () => {
    const location = useLocation();
    const { id } = location.state || { id: null };
    const { data } = useFetch(`news/${id}`);

    const newsData = data ? data.data : null;

    const scores = {
        finbert: 0.85,
        gemini: -0.45,
        combined: 0.0,
    };
    const getColor = (score) => {
        if (score > 0) return 'success';
        if (score < 0) return 'danger';
        return 'secondary';
      };
    // State to track selected sentiment type
    // const [selectedSentiment, setSelectedSentiment] = useState('average');

    // const sentimentTypes = [
    //     { name: 'Avg Sentiment', value: 'average' },
    //     { name: 'Weighted', value: 'weighted' },
    //     { name: 'Time-Decay', value: 'time_decay' }
    // ];

    const styles = {
        newsHeader: {
            fontSize: 'calc(7px + 1vw)',
            fontWeight: 'bold',
            color: '#007BFF',
            textDecoration: 'none',
        },
        metaInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: 'calc(8px + 0.5vw)',
            color: '#777',
            marginBottom: '5px',
        },
        badge: {
            fontSize: '0.8em',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: '500',
            cursor: 'pointer',
        },
        sentimentToggle: {
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '15px',
        },
        sentimentValue: {
            fontSize: '1em',
            fontWeight: 'bold',
            padding: '5px 15px',
            borderRadius: '20px',
            backgroundColor: '#f8f9fa',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
    };

    if (!id) return <p>No ID provided. Please navigate correctly.</p>;
    if (!newsData) return <p>Loading...</p>;

    return (
        <Container fluid className="news-container">
            
            {/* Sentiment Score Toggle Pills */}
            {/* <div style={styles.sentimentToggle}>
            <ButtonGroup>
              {sentimentTypes.map((type) => (
                  <ToggleButton
                      key={type.value}
                      type="radio"
                      variant={selectedSentiment === type.value ? 'primary' : 'outline-primary'}
                      name="sentiment"
                      value={type.value}
                      onClick={() => {setSelectedSentiment(type.value);
                                      console.log("Selected Sentiment:", type.value);
                      }}  // Simplified onChange handler
                      checked={selectedSentiment === type.value}
                  >
                      {type.name}

                  </ToggleButton>
              ))}
          </ButtonGroup>
            </div> */}

            {/* Display selected sentiment */}
            {/* <div className="text-center">
                <Badge style={styles.sentimentValue}>
                    {selectedSentiment === 'average' && <>📊 1</>}
                    {selectedSentiment === 'weighted' && <>⚖ 2</>}
                    {selectedSentiment === 'time_decay' && <>⏳ 3</>}
                </Badge>
            </div> */}

            {/* News Title */}
            <Link to={newsData.url} target="_blank" rel="noopener noreferrer" style={styles.newsHeader}>
                <h4>{newsData.title}</h4>
            </Link>

            {/* News date and publisher closer together */}
            <div style={styles.metaInfo}>
                <span>📅 {new Date(newsData.published_date).toLocaleDateString()}</span>
                <span>📰 {newsData.publisher}</span>
            </div>

            {/* Entities under news date */}
            <div className="d-flex flex-wrap gap-2">
                {newsData.entities?.map((entity) => (
                    <Badge bg="warning" style={styles.badge} key={entity}>{entity}</Badge>
                ))}
            
            <div>
                
            <div >
            <div style={{ display: 'flex', gap: '6px' }}>
              <OverlayTrigger placement="top" overlay={<Tooltip id="finbert-tooltip">FinBERT Score: {scores.finbert} is calculated with ...</Tooltip>}>
                <Badge bg={getColor(scores.finbert)} style={styles.badge}>FinBERT: {scores.finbert}</Badge>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="gemini-tooltip">Gemini Score: {scores.gemini} is calculated with ...</Tooltip>}>
                <Badge bg={getColor(scores.gemini)} style={styles.badge}>Gemini: {scores.gemini}</Badge>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="combined-tooltip">Combined Score: {scores.combined} is calculated with ...</Tooltip>}>
                <Badge bg={getColor(scores.combined)} style={styles.badge}>Combined: {scores.combined}</Badge>
              </OverlayTrigger>
            </div>
            </div>

          </div>

            </div>

            {/* News Summary */}
            <p>{newsData.summary}</p>

            {/* Region, Sectors, and Affected Companies in separate columns */}
            <Row className="mt-3">
                <Col md={4}>
                    {newsData.tags?.length > 0 && (
                        <>
                            <strong>🌍 Region:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {newsData.tags.map((region) => (
                                    <Badge bg="info" style={styles.badge} key={region}>{region}</Badge>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
                <Col md={4}>
                    {newsData.tags?.length > 0 && (
                        <>
                            <strong>🏢 Sectors:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {newsData.tags.map((sector) => (
                                    <Badge bg="dark" style={styles.badge} key={sector}>{sector}</Badge>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
                <Col md={4}>
                    {newsData.tags?.length > 0 && (
                        <>
                            <strong>🏭 Affected Companies:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {newsData.tags.map((company) => (
                                    <Badge bg="warning" style={styles.badge} key={company}>{company}</Badge>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default NewsSources;
