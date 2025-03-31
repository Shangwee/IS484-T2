import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useLocation } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  // State to hold feedback data, loading, and error states
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const location = useLocation();
  console.log("Location object:", location);

  const { id } = location.state || {id: null}; // Retrieve the id from state
  console.log(id);  

  // Fetch feedback data when the component mounts
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Fetch feedback data from the backend
        const response = await axios.get(`http://localhost:5001/feedback/news/${id}`);
        const data = response.data;

        if (!data || !Array.isArray(data.data)) {
          throw new Error("Invalid feedback data");
        }

        // Set the fetched feedback data
        setFeedbackData(data.data);
      } catch (err) {
        console.error("Error fetching feedback:", err.response ? err.response.data : err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error || !feedbackData) {
    return <div>Error fetching feedback data.</div>;
  }

  // Initialize counts for each sentiment
  let bearishCount = 0,
    neutralCount = 0,
    bullishCount = 0;

  // Process feedbackData to count sentiments
  feedbackData.forEach((item) => {
    switch (item.assessment) {
      case "bearish":
        bearishCount++;
        break;
      case "neutral":
        neutralCount++;
        break;
      case "bullish":
        bullishCount++;
        break;
      default:
        break;
    }
  });

  // Calculate the total number of feedback entries
  const totalCount = bearishCount + neutralCount + bullishCount;

  // Calculate percentages for each sentiment (out of 100)
  const bearishPercentage = totalCount > 0 ? (bearishCount / totalCount) * 100 : 0;
  const neutralPercentage = totalCount > 0 ? (neutralCount / totalCount) * 100 : 0;
  const bullishPercentage = totalCount > 0 ? (bullishCount / totalCount) * 100 : 0;

  // Dynamically set the chart data using the percentages
  const data = {
    labels: ["Bearish", "Bullish", "Neutral"],
    datasets: [
      {
        data: [bearishPercentage, bullishPercentage, neutralPercentage], // Percentages for each segment
        backgroundColor: ["red", "green", "grey"], // Colors for each segment
        borderColor: "black", // Border color for all segments
        borderWidth: 3, // Border width
      },
    ],
  };

  // Options for the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom", // Move the legend to the bottom
        labels: {
          font: {
            size: 15, // Font size for legend labels
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(1)}%`; // Format tooltip to show percentage
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "55%", margin: "0 auto" }}>
      <Pie data={data} options={options} />
    </div>
  );
}

export default PieChart;