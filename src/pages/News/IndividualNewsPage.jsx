import React from 'react';
import NewsSources from '../../components/news/NewsSources';
import SentimentFeedbackForm from '../../components/ui/sentimentFeedback';
import { useLocation } from 'react-router-dom';
import PieChart from '../../components/ui/feedbackChart';

function IndividualNewsPage() {
  console.log('Rendering IndividualNewsPage ');
  const location = useLocation();
  const newsTitle = location.state?.title || 'Unknown Title'; // Get title from state
  console.log('Rendering IndividualNewsPage with title:', newsTitle);

  return (
    <div style={{ color:'black', padding: '20px' }}>
      <NewsSources/>
      <div style={styles.topRow}>
        <div style={styles.sentimentFeedbackWrapper}>
          <SentimentFeedbackForm newsTitle={newsTitle} />
        </div>
        <div style={styles.pieChartWrapper}>
          <h3 style={styles.chartTitle}>Feedback Based on Users</h3>
          <PieChart />
        </div>
      </div>

    </div>
  );
}
const styles = {
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexWrap: 'wrap',
  },
  sentimentFeedbackWrapper: {
    flex: 1,
    textAlign: 'left',
    maxWidth: '50%',
  },
  pieChartWrapper: {
    flex: 1,
    textAlign: 'right',
    maxWidth: '50%',
  },
  chartTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '10px',
  },
};
export default IndividualNewsPage