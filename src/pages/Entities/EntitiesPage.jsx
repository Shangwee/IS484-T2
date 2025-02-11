import React from 'react';
import Entities from '../../components/entity/EntitiesSummary';

function EntitiesPage() {
  console.log('Rendering Entities Page');
  return (
    <div style={{ color:'black', padding: '20px' }}>
        <Entities/>
    </div>
  );
}
export default EntitiesPage