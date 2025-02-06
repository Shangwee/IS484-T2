import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function EntityVisuals() {
    return (
      <Container fluid className="entity-container">
        <Row className="justify-content-center">
          <Col md={8} className="entity-col">
            <div style={styles.entityBox}>
              <h1 style={styles.entityText}>Visuals here</h1>
            </div>
          </Col>
        </Row>
      </Container>
    );
}

const styles = {
  entityBox: {
    position:'fixed',
    top: '185px',
    left: '259px',
    width:'1180px',
    display: "flex", 
    backgroundColor: 'lightgrey',
    borderRadius: '15px',
    padding: '50px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    height: '38%',
  },
  entityText: {
    fontSize: '98px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',  
  },
};

export default EntityVisuals;
