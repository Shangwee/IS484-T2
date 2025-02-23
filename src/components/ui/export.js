// React button
import React, { useState } from 'react'
import axios from 'axios'

const ReportButton = ({ entityName }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateReport = async () => {
    setLoading(true);
    try {
        const response = await axios.post(
            "http://localhost:5001/pdf/generate-pdf",
            { entity_name: "Tesla" },
            { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Tesla_report.pdf");
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

  return (
    <div>
      <button onClick={generateReport} disabled={loading}>
        {loading ? "Generating..." : "Download Report"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  )
}

export default ReportButton
