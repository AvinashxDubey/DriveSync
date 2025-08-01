import React from 'react';
import '../styles/UpdateStatus.css';
import ProgressBar from './ProgressBar';

function UpdateStatus({ logs }) {
  if (!logs.length) return <div className="noUpdates">No updates found.</div>;
  const latest = logs[0]; // assuming the first is the most recent

  return (
    <div className="statusCard">
      <div className="statusRow">
        <span>Current Status:</span>
        <span className="statusBadge">{latest.status}</span>
      </div>
      <ProgressBar progress={latest.progress} />
    </div>
  );
}

export default UpdateStatus;
