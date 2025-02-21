import React from 'react';
import ReportButton from '../services/export'; // Import the ReportButton component


function DashboardPage() {
    console.log('Rendering DashboardPage ');
    return (
        <div style={{ color:'black' }}>
            <ReportButton />
            <h1>Dashboard Page</h1>
        </div>
    );
    }

export default DashboardPage