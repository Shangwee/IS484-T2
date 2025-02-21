import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportButton = ({ companyId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const generateReport = async () => {
        setLoading(true);
        setError(null);
        
       
        try {
            // First, fetch the company data
            const companyResponse = await axios.get(`http://localhost:5000/api/companies/${companyId}`);
            const companyData = companyResponse.data;

            // Then generate the PDF with the fetched data
            const response = await axios.post(
                "http://localhost:5000/generate-pdf",
                {
                    entity_name: companyData.entity_name,
                    key_metrics: companyData.key_metrics,
                    news_items: companyData.news_items
                },
                {
                    responseType: 'blob'
                }
            );

            // Create and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `company_report.pdf`);
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error generating report:', err);
            setError('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inline-block">
      <button 
    onClick={generateReport}
    disabled={loading}
    style={{ color: 'black' }}
>
    {loading ? 'Generating...' : 'Download Report'}
</button>
            {error && (
                <div className="text-red-500 text-sm mt-2">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ReportButton;