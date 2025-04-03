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
        finbert: newsData ? parseFloat(newsData.finbert_score).toFixed(1) : 0,
        gemini: newsData ? parseFloat(newsData.second_model_score).toFixed(1) : 0,
        combine_score: newsData ? parseFloat(newsData.score).toFixed(1) : 0,
    };
    const getColor = (score) => {
        if (score > 0) return 'success';
        if (score < 0) return 'danger';
        return 'secondary';
      };

    const region_list = newsData?.regions? newsData.regions : 'Unknown Region';
    const sectors_list = newsData?.sectors ? newsData.sectors : 'Unknown Sectors';
    const company_name_list = newsData?.company_names ? newsData.company_names : 'Unknown Companies';

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
            fontSize: '1em',
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
              <OverlayTrigger placement="top" overlay={<Tooltip id="finbert-tooltip">Financial BERT model trained specifically on financial text to detect sentiment in financial news.</Tooltip>}>
                <Badge bg={getColor(scores.finbert)} style={styles.badge}>FinBERT: {scores.finbert}</Badge>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="gemini-tooltip">Google's Gemini model provides general language understanding for broader context analysis.</Tooltip>}>
                <Badge bg={getColor(scores.gemini)} style={styles.badge}>Gemini: {scores.gemini}</Badge>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="combine-tooltip">Weighted average of both models with confidence factoring to provide the most accurate sentiment score.</Tooltip>}>
                <Badge bg={getColor(scores.combine_score)} style={styles.badge}>Combine Score: {scores.combine_score}</Badge>
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
                    {region_list?.length > 0 && (
                        <>
                            <strong>🌍 Region:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {region_list.map((region) => (
                                    <Badge bg="info" style={styles.badge} key={region}>{region}</Badge>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
                <Col md={4}>
                    {sectors_list?.length > 0 && (
                        <>
                            <strong>🏢 Sectors:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {sectors_list.map((sector) => (
                                    <Badge bg="dark" style={styles.badge} key={sector}>{sector}</Badge>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
                <Col md={4}>
                    {company_name_list?.length > 0 && (
                        <>
                            <strong>🏭 Affected Companies:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {company_name_list.map((company) => (
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
