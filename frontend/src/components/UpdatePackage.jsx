import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UpdatePackage.css';

function CreateUpdatePackage() {
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState(''); // Comma-separated URLs
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('You must be logged in as an admin to create an update package.');
        setLoading(false);
        return;
      }

      // Convert comma-separated string to array
      const filesArray = files
        .split(',')
        .map(f => f.trim())
        .filter(f => f);

      const res = await axios.post(
        '/api/updates/addPackage',
        {
          version,
          description,
          files: filesArray
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccessMsg(res.data?.message || 'Update package created successfully!');
      setVersion('');
      setDescription('');
      setFiles('');
    } catch (err) {
      // Differentiate between admin restriction and other errors
      if (err?.response?.status === 403) {
        setErrorMsg('Only admins can create update packages.');
      } else if (err?.response?.status === 401) {
        setErrorMsg('Unauthorized: Please log in again.');
      } else {
        setErrorMsg(err?.response?.data?.message || 'Failed to create update package.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <main className="content">
        <h2>Create Update Package (Admin Only)</h2>

        {errorMsg && <div className="errorMessage">{errorMsg}</div>}
        {successMsg && <div className="successMessage">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="updateForm">
          <div className="formGroup">
            <label>Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="Enter update version (e.g., v1.0.2)"
              required
            />
          </div>

          <div className="formGroup">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description of the update"
            />
          </div>

          <div className="formGroup">
            <label>Files (comma-separated URLs)</label>
            <input
              type="text"
              value={files}
              onChange={(e) => setFiles(e.target.value)}
              placeholder="https://example.com/file1.zip, https://example.com/file2.zip"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Update'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateUpdatePackage;
