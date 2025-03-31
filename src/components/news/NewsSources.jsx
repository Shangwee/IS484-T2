import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SentimentScore from '../ui/Sentimentscore';

const NewsSources = () => {
    const location = useLocation();
    const { id } = location.state || { id: null };
    const { data } = useFetch(`news/${id}`);

    const newsData = data ? data.data : null;

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
        },
        sentimentContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
    };

    if (!id) return <p>No ID provided. Please navigate correctly.</p>;
    if (!newsData) return <p>Loading...</p>;

    return (
        <Container fluid className="news-container">
            {/* News Title and Sentiment Row */}
            <Row className="align-items-center">
                <Col md={8}>
                    <Link to={newsData.url} target="_blank" rel="noopener noreferrer" style={styles.newsHeader}>
                        <h4>{newsData.title}</h4>
                    </Link>
                </Col>
                <Col md={4} style={styles.sentimentContainer}>
                    {/* Sentiment Score Pill */}
                    <SentimentScore score={newsData.score} sentiment={newsData.sentiment} />
                </Col>
            </Row>

            {/* News Date & Publisher */}
            <div style={styles.metaInfo}>
                <span>📅 {new Date(newsData.published_date).toLocaleDateString()}</span>
                <span>📰 {newsData.publisher}</span>
            </div>

            {/* Entities */}
            <div className="d-flex flex-wrap gap-2">
                {newsData.entities?.map((entity) => (
                    <Badge bg="success" style={styles.badge} key={entity}>{entity}</Badge>
                ))}
            </div>

            {/* News Summary */}
            <p>{newsData.summary}</p>

            {/* Region, Sectors, and Affected Companies in separate columns */}
            <Row className="mt-3">
                <Col md={4}>
                    {newsData.regions?.length > 0 && (
                        <>
                            <strong>🌍 Region:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {newsData.regions.map((region) => (
                                    <Badge bg="info" style={styles.badge} key={region}>{region}</Badge>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
                <Col md={4}>
                    {newsData.sectors?.length > 0 && (
                        <>
                            <strong>🏢 Sectors:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {newsData.sectors.map((sector) => (
                                    <Badge bg="dark" style={styles.badge} key={sector}>{sector}</Badge>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
                <Col md={4}>
                    {newsData.affected_companies?.length > 0 && (
                        <>
                            <strong>🏭 Affected Companies:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {newsData.affected_companies.map((company) => (
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
