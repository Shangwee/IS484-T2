import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function EntityVisuals() {
    return (
      <Container fluid className="entity-container">
        <Row className="justify-content-center align-items-center">
          <Col  xs={12} md={10} lg={7} className="entity-col">
          {/* xs={12} md={10} lg={8} xl={10}  */}
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
display: "flex",
flexDirection: "column", // Ensures content stacks vertically if needed
justifyContent: "center",
alignItems: "center",
maxWidth: '1400px', // Matches EntityNews width for uniformity

backgroundColor: 'lightgrey',
borderRadius: '15px',
boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
margin: '0 auto', // Centers the box horizontally
boxSizing: 'border-box', // Ensures padding and border are included in width/height
height:'250px'

  },

};

export default EntityVisuals;

