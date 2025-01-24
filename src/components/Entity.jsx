import React from 'react';

function Entity() {
  return (
    <div>
      <h1 style={styles.entityname}>
        Google (GOOG)
      </h1>
    </div>
  );
}

const styles = {
  entityname: {
    position: "fixed",
    display: "flex",
    top: "100px",
    left: "16vw",
    color: "black", 
    fontWeight: "700",  
    fontSize: "50px",
  }
};

export default Entity;

