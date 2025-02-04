import React from 'react';
import useFetch from "../../hooks/useFetch"

function Price(id) {

  const number = id.id;
  
  const url = `/entities/${number}/stock`;

  const { data, loading, error } = useFetch(url);

  return (
    <div style={styles.container}>
      <div style={styles.price}>
        Price = {loading ? 'Loading...' : error ? 'Error' : data.data.stock_price}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed', // Fixes the position relative to the viewport
    top: '300px', // Adjust this value to your preference
    left: '200px', // Adjust this value to your preference
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
