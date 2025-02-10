import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import useFetch from "../../hooks/useFetch"; // Adjust path if needed

// Register chart elements
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function EntityVisuals(id) {

  const number = id.id;

  const url = `/entities/${number}/chart`;

  const { data, loading, error } = useFetch(url);

  if (loading) return <p>Loading stock data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.data || !data.data.stock_chart) return <p>No data available</p>;

  const stockData = {
    labels: data.data.stock_chart.dates, // X-axis (dates)
    datasets: [
      {
        label: `${data.data.name} Stock Price`,
        data: data.data.stock_chart.prices, // Y-axis (prices)
        borderColor: "#8884d8",
        backgroundColor: "rgba(136, 132, 216, 0.2)",
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { ticks: { font: { size: 12 } }, beginAtZero: false },
    },
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
  };

  return (
    <Container fluid className="entity-container">
      <Row className="justify-content-center">
        <Col md={8} className="entity-col">
          <div style={styles.entityBox}>
            <h2 style={styles.entityText}>{data.data.name} Stock Chart</h2>
            <div style={{ width: "100%", height: "300px" }}>
              <Line data={stockData} options={options} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  entityBox: {
    position: "fixed",
    top: "185px",
    left: "259px",
    width: "1180px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    height: "50%",
  },
  entityText: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: "20px",
  },
};

export default EntityVisuals;
