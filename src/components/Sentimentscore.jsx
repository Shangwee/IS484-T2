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
  backgroundColor: "#00CB14",
  borderRadius: "15px",
  justifyContent: "center",
  alignItems: "center",
  color: "black",
  fontSize: "calc(12px + 1vw)",  // Adjust font size dynamically based on viewport width
  fontWeight: "bold",
  padding: "5px 15px",

}
};

export default Sentimentscore;

