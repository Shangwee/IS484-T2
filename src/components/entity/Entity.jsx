import React from 'react';
import useFetch from '../../hooks/useFetch';

function Entity(id) {
  const number = id.id;

  const url = `/entities/${number}`;

  const { data, loading, error } = useFetch(url);

  const entity = data ? data.data : "N/A";

  return (
    <div>
      <h1 style={styles.entityname}>
        {entity.name}
      </h1>
    </div>
  );
}

const styles = {
  entityname: {
    position: "fixed",
    display: "flex",
    top: "100px",
    left: "18vw",
    color: "black", 
    fontWeight: "700",  
    fontSize: "40px",
  }
};

export default Entity;

