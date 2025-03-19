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
      gridTemplateColumns: '100px 100px',
      gridTemplateRows: 'auto 5px',
      justifyContent: 'center',
      gridRowGap: '10px',
      alignContent: 'center',
    },
    secondChild: {
      justifySelf: 'right',
    },
  };
  
  export default RatingsContainer;