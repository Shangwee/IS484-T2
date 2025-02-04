import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import Entity from '../../components/entity/Entity';
import Price from '../../components/ui/Price';
import SentimentScore from '../../components/ui/SentimentScore';

function IndividualEntityPage() {

    const { id } = useParams();
    const entity = id;

    return (
        <Container fluid>
            <Row>
                <Col xs={12} md={6}>
                    <Entity />
                    <Price id={entity}/>
                    <SentimentScore />
                </Col>
            </Row>
        </Container>
    );
}

export default IndividualEntityPage;