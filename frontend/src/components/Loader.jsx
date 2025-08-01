import React from 'react';
import '../styles/Loader.css';

function Loader() {
  return (
    <div className="loaderWrapper">
      <div className="loader"></div>
      <span>Loading...</span>
    </div>
  );
}

export default Loader;
