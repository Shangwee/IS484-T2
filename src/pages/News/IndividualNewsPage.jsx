import React from 'react';
import NewsSources from '../../components/news/NewsSources';

function IndividualNewsPage() {
  console.log('Rendering IndividualNewsPage ');
  return (
    <div style={{ color:'black', padding: '20px' }}>
      <NewsSources/>
    </div>
  );
}
export default IndividualNewsPage