import React, { useState } from 'react';
import ThumbsUp from './thumbsUp';
import ThumbsDown from './thumbsDown';

function RatingsContainer() {
    const [positiveRatings, setPositiveRating] = useState(0);
    const [negativeRatings, setNegativeRating] = useState(0);
  
    return (
      <section id="ratingsContainer" style={styles.ratingsContainer}>
        <ThumbsUp
          positiveRatings={positiveRatings}
          setPositiveRating={setPositiveRating}
        />
        <ThumbsDown
          negativeRatings={negativeRatings}
          setNegativeRating={setNegativeRating}
        />
      </section>
    );
  }
  
  const styles = {
    ratingsContainer: {
      display: 'grid',
      gridTemplateColumns: '80px 80px',
      gridTemplateRows: 'auto 5px',
      gridRowGap: '10px',
      alignContent: 'center',
    }
    
  };
  
  export default RatingsContainer;