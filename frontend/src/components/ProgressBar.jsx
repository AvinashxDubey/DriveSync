import React from 'react';
import '../styles/ProgressBar.css';

function ProgressBar({ progress }) {
  return (
    <div className="progressBar">
      <div
        className="progress"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="label">{progress}%</span>
    </div>
  );
}

export default ProgressBar;
