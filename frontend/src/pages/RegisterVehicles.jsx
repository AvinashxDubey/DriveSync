import React, { useState } from 'react';
import '../styles/RegisterVehicles.css';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Navbar from '../components/Navbar';

// import API function
import { registerVehicle } from '../services/api';

function RegisterVehicles() {
  const [vehicleData, setVehicleData] = useState({
    vin: '',
    model: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!vehicleData.vin.trim() || !vehicleData.model.trim()) {
      setError('Please fill in both VIN and Model.');
      return;
    }

    try {
      setLoading(true);

      // call API function instead of fetch
      await registerVehicle(vehicleData);

      setSuccessMsg('Vehicle registered successfully!');
      setVehicleData({ vin: '', model: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <main className="content">
        <div className="card registerVehicleCard">
          <h2>Register New Vehicle</h2>

          {loading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {successMsg && <div className="successMessage">{successMsg}</div>}

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
