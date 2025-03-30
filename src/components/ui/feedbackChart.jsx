import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  // Data for the pie chart
  const data = {
    labels: ["Bearish", "Bullish", "Neutral"],
    datasets: [
      {
        data: [50, 30, 20], // Values for each segment
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
            size: 15  , // Font size for legend labels
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}%`; // Format tooltip to show percentage
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