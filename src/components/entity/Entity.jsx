import React from 'react';
import useFetch from '../../hooks/useFetch';

function Entity( {EntityTicker} ) {
  const url = `/entities/${EntityTicker}`;

  const { data, loading, error } = useFetch(url);

  const entity = data ? data.data : "N/A";

  return (
    <div style={styles.container}>
      <h1 style={styles.entityname}>
        {loading ? "Loading..." : error ? "Error fetching data" : entity.name || "N/A"}
      </h1>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    flexDirection: "column", // Stack content vertically
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    padding: "10px", // Add padding for spacing
    boxSizing: "border-box", // Include padding in width/height calculations
    maxWidth: "1200px", // Limit maximum width for larger screens
    margin: "0 auto", // Center the container horizontally
  },
  entityname: {
    color: "black",
    fontWeight: "700",
    fontSize: "clamp(1.5rem, 4vw, 3rem)", // Dynamic font size (min: 1.5rem, max: 3rem)
    textAlign: "center", // Center text alignment
    margin: "0 auto", // Center horizontally
    maxWidth: "90vw", // Ensure it doesn't overflow on small screens
    wordWrap: "break-word", // Handle long words
  },
};

export default Entity;

