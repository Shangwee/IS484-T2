import React from 'react';
import NewsHeader from './newsheader';
import NewsSummary from './newssummary';

const NewsBox = ({ newsItem }) => {
  return (
    <div className="news-box">
      <NewsHeader title={newsItem.title } /> 
      <NewsSummary summary={newsItem.summary } /> 
    </div>
  );
};



export default NewsBox;
