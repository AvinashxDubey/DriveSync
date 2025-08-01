import React, { useState } from 'react';
import '../styles/RegisterVehicles.css';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { registerVehicle } from '../services/api';  // Ensure this API function exists

function RegisterVehicles() {
  const [vehicleData, setVehicleData] = useState({
    vin: '',
    model: '',
    owner: '', // Assuming you want to pass owner as well (optional)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Basic client validation
    if (!vehicleData.vin.trim() || !vehicleData.model.trim()) {
      setError('Please fill in both VIN and Model.');
      return;
    }

    try {
      setLoading(true);
      // Call backend API to register vehicle
      await registerVehicle(vehicleData);

      setSuccessMsg('Vehicle registered successfully!');
      // Optionally reset form
      setVehicleData({ vin: '', model: '', owner: '' });
    } catch (err) {
      let msg = 'Failed to register vehicle.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <main className="content">
        <div className="card registerVehicleCard">
          <h2>Register New Vehicle</h2>

          {loading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {successMsg && (
            <div className="successMessage">{successMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="registerForm">
            <div className="formGroup">
              <label htmlFor="vin">VIN</label>
              <input
                type="text"
                id="vin"
                name="vin"
                value={vehicleData.vin}
                onChange={handleChange}
                placeholder="Enter vehicle VIN"
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                value={vehicleData.model}
                onChange={handleChange}
                placeholder="Enter vehicle model"
                required
              />
            </div>

            {/* Optional: owner (if needed, can be omitted if backend sets automatically) */}
            {/* <div className="formGroup">
              <label htmlFor="owner">Owner ID</label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={vehicleData.owner}
                onChange={handleChange}
                placeholder="Enter owner ID"
              />
            </div> */}

            <button className="submitButton" type="submit" disabled={loading}>
              Register Vehicle
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RegisterVehicles;
