// React button
import React, { useState } from 'react'
import useFetch from '../../hooks/useFetch'

const ReportButton = ({ entityName }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Use the useFetch hook to fetch entity data
  const { data: entityData, loading: fetchLoading, error: fetchError } = useFetch(`/api/companies/${entityName}`);

  
  const generateReport = async () => {
    setLoading(true);
    try {
      // Send the fetched entity data to the backend for PDF generation
      const response = await fetch("http://localhost:5001/pdf/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entityData),
      });


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${entityName}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("An error occurred while generating the report.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching data
  if (fetchLoading) {
    return <div>Loading entity data...</div>;
  }

  // Show error if fetching data fails
  if (fetchError) {
    return <div style={{ color: "red" }}>Error fetching entity data: {fetchError}</div>;
  }

  return (
    <div>
      <button onClick={generateReport} disabled={loading}>
        {loading ? "Generating..." : "Download Report"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default ReportButton;