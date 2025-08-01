import React from 'react';
import '../styles/ErrorMessage.css';

function ErrorMessage({ message }) {
  return (
    <div className="errorMessage">
      {message}
    </div>
  );
}

export default ErrorMessage;
