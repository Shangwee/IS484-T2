import React from 'react';

function Entity() {
  return (
    <div>
      <h1 style={styles.entityname}>
        Taiwan Semiconductor Manufacturing Company Limited (TSMC)
      </h1>
    </div>
  );
}

const styles = {
  entityname: {
    position: "fixed",
    display: "flex",
    top: "100px",
    left: "18vw",
    color: "black", 
    fontWeight: "700",  
    fontSize: "40px",
  }
};

export default Entity;

