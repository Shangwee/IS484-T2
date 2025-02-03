import React from 'react';

function Price() {
  return (
    <div style={styles.container}>
      <div style={styles.price}>
        Price = $0.10
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed', // Fixes the position relative to the viewport
    top: '230px', // Adjust this value to your preference
    left: '80px', // Adjust this value to your preference
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',    
  },
  price: {
    backgroundColor: 'grey',
    borderRadius: '15px',
    color: 'black',
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '5px 15px',
    margin: '0 50px', // Adjusted margin
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
  }
};

export default Price;
