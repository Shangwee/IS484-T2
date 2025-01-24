import React from 'react';
import NewsHeader from './newsheader';
import NewsSummary from './newssummary';
import PropTypes from 'prop-types'; // For type-checking props

const NewsBox = ({ newsItem }) => {
  return (
    <div className="news-box">
      <NewsHeader title={newsItem.title } /> 
      <NewsSummary summary={newsItem.summary } /> 
    </div>
  );
};



export default NewsBox;

