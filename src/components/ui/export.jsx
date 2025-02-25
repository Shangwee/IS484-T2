import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa'; // Import download icon
import { postDataBlob } from '../../services/api';

const ReportButton = ({ EntityName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Send the entity name to backend for PDF generation
      const response = await postDataBlob(`/pdf/generate-pdf`, JSON.stringify({ entity_name: EntityName }));

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${EntityName}_report.pdf`);
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
    <button
      onClick={generateReport}
      disabled={loading}
      style={styles.button} // Add any button styles here
      title="Download Report"
    >
      {/* Displaying only the download icon */}
      <FaDownload size={20} />
    </button>
  );
};

const styles = {
  button: {
    borderRadius: '50%',
    padding: '10px',
    backgroundColor: '#007BFF', // Button color
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s',
  },
};

export default ReportButton;
