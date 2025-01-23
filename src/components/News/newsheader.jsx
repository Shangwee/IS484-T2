import React from 'react';

const NewsHeader = ({ title }) => {
  return (
    <div className="news-header" >
      <h1 style={styles.newsheader}>{title}</h1>
    </div>
  );
};

const styles = {
    newsheader:
    {
      fontWeight: "500",
      fontSize: "60px",
      color: "darkblue",
    }
    };
    
    
export default NewsHeader;
