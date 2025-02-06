import React from 'react';

function SentimentScore() {
  return (
         <div style={styles.greenbox}>
          0.95
         </div>
  );
}

const styles = {
greenbox:
{
  display: "flex",
  backgroundColor: "#00CB14",
  borderRadius: "15px",
  justifyContent: "center",
  alignItems: "center",
  color: "black",
  fontSize: "calc(12px + 1vw)",  // Adjust font size dynamically based on viewport width
  fontWeight: "bold",
  padding: "5px 15px",
  // height: '50px',
}
};

export default SentimentScore;

