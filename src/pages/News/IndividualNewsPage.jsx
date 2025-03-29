import React from 'react';
import NewsSources from '../../components/news/NewsSources';
import SentimentFeedbackForm from '../../components/ui/sentimentFeedback';
import { useLocation } from 'react-router-dom';

function IndividualNewsPage() {
  console.log('Rendering IndividualNewsPage ');
  const location = useLocation();
  const newsTitle = location.state?.title || 'Unknown Title'; // Get title from state
  console.log('Rendering IndividualNewsPage with title:', newsTitle);

  return (
    <div style={{ color:'black', padding: '20px' }}>
      <NewsSources/>
      <SentimentFeedbackForm newsTitle={newsTitle} />
    </div>
  );
}
export default IndividualNewsPage