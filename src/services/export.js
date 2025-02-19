import axios from "axios";

const downloadPDF = async () => {
    try {
        const response = await axios.post("http://localhost:5000/generate-pdf", {
            entity_name: "Example Corp",
            key_metrics: { Revenue: "$10M", Employees: "500", "Market Share": "15%" },
            news_items: [
                { title: "Company achieves record profits", url: "https://news.example.com/1" },
                { title: "New partnership announced", url: "https://news.example.com/2" }
            ]
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

export default function ReportButton() {
    return <button onClick={downloadPDF}>Download Report</button>;
}
