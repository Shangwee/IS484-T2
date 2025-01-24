import React from 'react';

function Price() {
  return (
         <div style={styles.greenbox}>
          Price = $0.10
         </div>
  );
}

const styles = {
greenbox:
{
  backgroundColor: "grey",
  borderRadius: "15px",
  justifyContent: "center",
  alignItems: "center",
  color: "black",
  fontSize: "80px",
  fontWeight: "bold",
  padding: "5px 15px",
  marginRight: "50px",
  marginLeft: "50px",
}
};

export default Price;

