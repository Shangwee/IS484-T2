// React button
import React, { useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { postDataBlob } from '../../services/api'

const ReportButton = ( EntityName ) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ❌ This should be done in the backend API inside look in pdf.py in routes (eg, the metrics) the frontend should just send which entity to generate the report for
  // Use the useFetch hook to fetch entity data
  // const { data: entityData, loading: fetchLoading, error: fetchError } = useFetch(`/api/companies/${entityName}`);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Send the fetched entity data to the backend for PDF generation
      const response = await postDataBlob(`/pdf/generate-pdf`, JSON.stringify({ entity_name: EntityName.EntityName }));

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${EntityName.EntityName}_report.pdf`);
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

  // ❌ This should be done in the backend API inside look in pdf.py in routes (eg, the metrics)
  // Show loading state while fetching data
  // if (fetchLoading) {
  //   return <div>Loading entity data...</div>;
  // }

  // Show error if fetching data fails
  // if (fetchError) {
  //   return <div style={{ color: "red" }}>Error fetching entity data: {fetchError}</div>;
  // }

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