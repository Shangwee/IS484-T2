import React from 'react';
import useFetch from '../../hooks/useFetch';

function Entity(id) {
  const number = id.id;

  const url = `/entities/${number}`;

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
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    minHeight: "100vh", // Full viewport height for vertical centering
    padding: "20px", // Add padding for smaller screens
    boxSizing: "border-box", // Include padding in width/height calculations
  },
  entityname: {
    color: "black",
    fontWeight: "700",
    fontSize: "calc(2rem + 2vw)", // Dynamic font size based on viewport width
    textAlign: "center", // Center text alignment
    margin: "0 auto", // Center horizontally
    maxWidth: "90vw", // Ensure it doesn't overflow on small screens
    wordWrap: "break-word", // Handle long words
  },
};

export default Entity;

