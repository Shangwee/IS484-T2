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
    // color: "black", 
    // position: "fixed",
    // display: "flex",
    // fontWeight: "700",  
    // fontSize:"130px",
    
    color: "black", 
    fontWeight: "700",  
    fontSize: "130px",
  }
};

export default Entity;

