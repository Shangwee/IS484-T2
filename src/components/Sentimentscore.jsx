import React from 'react';

function Sentimentscore() {
  return (
         <div style={styles.greenbox}>
          0.95

         </div>
  );
}

const styles = {
greenbox:
{
  position: "fixed",
  display: "flex",
  top: "255px",
  left: "3559px",
  width: "350px",
  height: "120px",

  backgroundColor: "#00CB14",
  borderRadius: "15px",

  justifyContent: "center",
  alignItems: "center",
  color: "black",
  fontSize: "80px",
  fontWeight: "bold",
  zIndex: 1000,
}
};

export default Sentimentscore;

