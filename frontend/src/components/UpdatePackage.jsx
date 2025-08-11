import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UpdatePackage.css';
import Navbar from './Navbar';

function CreateUpdatePackage() {
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('❌ You must be logged in as an admin.');
      setLoading(false);
      return;
    }

    // Convert comma-separated text into an array
    const filesArray = files
      .split(',')
      .map(f => f.trim())
      .filter(f => f !== '');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/update/addPackage',
        { version, description, files: filesArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg(res.data.message || '✅ Package created!');
      setVersion('');
      setDescription('');
      setFiles('');
    } catch (err) {
      console.error('Error creating package:', err.response?.data || err.message);
      if (err.response?.status === 403) {
        setErrorMsg('🚫 You are not authorized to perform this action.');
      } else if (err.response?.status === 401) {
        setErrorMsg('🔑 Invalid or expired token. Please log in again.');
      } else {
        setErrorMsg(err.response?.data?.message || '❌ Operation failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <Navbar/>
      <main className="content">
        <h2>Create Update Package</h2>

        {errorMsg && <div className="errorMessage">{errorMsg}</div>}
        {successMsg && <div className="successMessage">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="updateForm">
          <div className="formGroup">
            <label>Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., v1.0.2"
              required
            />
          </div>

          <div className="formGroup">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="formGroup">
            <label>Files (comma-separated URLs)</label>
            <input
              type="text"
              value={files}
              onChange={(e) => setFiles(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Create Package'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateUpdatePackage;
