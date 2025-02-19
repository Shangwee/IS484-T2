import axios from "axios";
import React, { useState, useEffect } from 'react';



const downloadPDF = async (entityName, keyMetrics, newsItems) => {
    try {
        const response = await axios.post("http://localhost:5000/generate-pdf", {
      
            entity_name: entityName,
            key_metrics: keyMetrics,
            news_items: newsItems,

        }, {
            responseType: "blob" // Important to handle file response
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.pdf");
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

const styles = {
    ReportButton: {
      textAlign: 'center',         // Centers the button text within the div (use 'right' if you want it aligned to the right)
      maxWidth: '400px',           // Restricts the button's maximum width to 400px
      width: '100%',               // Ensures the button uses the full available width up to the max width
      fontSize: 'clamp(0.8rem, 1vw, 1.2rem)', // Responsively adjusts the font size based on viewport width
      padding: '12px 24px',        // Adds padding to the button for a better touch target
      backgroundColor: '#4789c0',  // Blue background color (you can change it based on your theme)
      color: '#fff',               // White text color
      border: 'none',              // Removes default button border
      borderRadius: '8px',         // Rounded corners for a softer look
      cursor: 'pointer',           // Changes cursor to pointer when hovering over the button
      transition: 'all 0.3s ease', // Smooth transition effect for hover states
    },

  };

  
export default function ReportButton({companyId}) {
    
    const [entityName, setEntityName] = useState('');
    const [keyMetrics, setKeyMetrics] = useState({
        Revenue: "",
        Employees: "",
        "Market Share": ""
    });
    const [newsItems, setNewsItems] = useState([
        { title: "Company achieves record profits", url: "https://news.example.com/1" },
        { title: "New partnership announced", url: "https://news.example.com/2" }
    ]);

    // This effect could simulate fetching the data dynamically from an API
    useEffect(() => {
        // Simulate fetching data

        const fetchData = async () => {
            try {
                const response = await axios.get("http://your-api-endpoint.com/getReportData");
                const data = response.data; // Assuming the API returns the structure you need
                setEntityName(data.entity_name);
                // TSMC
                setKeyMetrics(data.key_metrics);
                        // {
                //         Revenue: "$15M",
                //         Employees: "800",
                //         "Market Share": "25%"
                //     };
                setNewsItems(data.news_items);
        // [
            //         { title: "Major Expansion in Europe", url: "https://news.example.com/3" },
            //         { title: "New Product Launch", url: "https://news.example.com/4" }
            //     ];
            
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
            
        fetchData();
    }, []);
    
    return <button style={styles.ReportButton} onClick={() => downloadPDF(entityName, keyMetrics, newsItems)}>Download Report</button>;
}


