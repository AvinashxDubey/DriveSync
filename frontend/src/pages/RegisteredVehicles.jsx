import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/RegisteredVehicles.css';
import axios from 'axios';
import Navbar from '../components/Navbar';

function RegisteredVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token'); // assuming you store token here

        if (!token) {
          throw new Error('User not authenticated. Please log in.');
        }

        const response = await axios.get('http://localhost:5000/api/vehicle/vehicles-user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response || typeof response !== 'object') {
          throw new Error('Invalid response from server.');
        }

        // handle array shape
        let vehiclesData = [];
        if (Array.isArray(response.data)) {
          vehiclesData = response.data;
        } else if (Array.isArray(response.data.vehicles)) {
          vehiclesData = response.data.vehicles;
        }

        setVehicles(vehiclesData);
      } catch (err) {
        let errorMsg = 'Failed to load registered vehicles.';
        if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.message) {
          errorMsg = err.message;
        }
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  return (
    <div className="vehicles-wrapper">
      <Navbar/>
      <main className="vehicles-content">
        <h2>Registered Vehicles</h2>

        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && vehicles.length === 0 && <p>No vehicles registered yet.</p>}

        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div className="vehicle-card" key={vehicle._id || Math.random()}>
              <h3>{vehicle.model || 'Unknown Model'}</h3>
              <p><strong>VIN:</strong> {vehicle.vin || 'N/A'}</p>

              {'updateInProgress' in vehicle && (
                <p>
                  <strong>Status:</strong>{' '}
                  {vehicle.updateInProgress ? (
                    <span className="status in-progress">Update In Progress</span>
                  ) : (
                    <span className="status idle">Idle</span>
                  )}
                </p>
              )}

              {vehicle.assignedUpdate && (
                <p>
                  <strong>Assigned Update:</strong>{' '}
                  {vehicle.assignedUpdate.name || 'N/A'}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RegisteredVehicles;
