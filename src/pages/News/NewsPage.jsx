import React from 'react';
import News from '../../components/news/News';
function NewsPage() {
  console.log('Rendering News Page');
  return (
    <div className="container-fluid p-4">
    {/* Bootstrap grid system for responsiveness */}
    <div className="row justify-content-center">
      <div className="col-lg-8 col-md-10 col-sm-12">
        <News />
      </div>
    </div>
  </div>
  );
}
export default NewsPage