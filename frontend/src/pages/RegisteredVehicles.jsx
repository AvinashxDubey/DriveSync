import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/RegisteredVehicles.css';
import { getAllVehicles } from '../services/api';

function RegisteredVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      setError('');
      try {
        const response = await getAllVehicles();
        // Depending on your backend, update this if response shape differs
        const vehiclesData = response.data?.vehicles || response.data || [];
        setVehicles(vehiclesData);
      } catch (err) {
        let errorMsg = 'Failed to load registered vehicles.';
        if (err.response?.data?.message) errorMsg = err.response.data.message;
        else if (err.message) errorMsg = err.message;
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  return (
    <div className="vehicles-wrapper">
      <main className="vehicles-content">
        <h2>Registered Vehicles</h2>

        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!loading && vehicles.length === 0 && <p>No vehicles registered yet.</p>}

        <div className="vehicles-grid">
          {vehicles.map(vehicle => (
            <div className="vehicle-card" key={vehicle._id}>
              <h3>{vehicle.model || 'Unknown Model'}</h3>
              <p><strong>VIN:</strong> {vehicle.vin}</p>
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
                  <strong>Assigned Update:</strong> {vehicle.assignedUpdate.name || 'N/A'}
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
