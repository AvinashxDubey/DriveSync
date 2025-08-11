import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/UpdateVehicle.css';

const RecentLogsPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [errorVehicles, setErrorVehicles] = useState('');

  // Store logs per vehicleId here
  const [logsByVehicle, setLogsByVehicle] = useState({});
  // Track which vehicle's logs are expanded
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  // Loading state per vehicle logs
  const [loadingLogs, setLoadingLogs] = useState({});

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      setErrorVehicles('');
      try {
        const res = await axios.get('http://localhost:5000/api/update/vehicles-assigned-update', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setVehicles(res.data);
      } catch (err) {
        setErrorVehicles('Failed to load vehicles');
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, []);

  // Fetch logs for a single vehicle on demand
  const fetchLogsForVehicle = async (vehicleId) => {
    setLoadingLogs(prev => ({ ...prev, [vehicleId]: true }));
    try {
      const res = await axios.get(`http://localhost:5000/api/log/vehicle/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLogsByVehicle(prev => ({ ...prev, [vehicleId]: res.data }));
    } catch (err) {
      setLogsByVehicle(prev => ({ ...prev, [vehicleId]: [{ message: 'Failed to load logs' }] }));
    } finally {
      setLoadingLogs(prev => ({ ...prev, [vehicleId]: false }));
    }
  };

  // Toggle expand logs view for a vehicle
  const toggleLogs = (vehicleId) => {
    if (expandedVehicleId === vehicleId) {
      setExpandedVehicleId(null);
    } else {
      setExpandedVehicleId(vehicleId);
      if (!logsByVehicle[vehicleId]) {
        fetchLogsForVehicle(vehicleId);
      }
    }
  };

  return (
    <div className="update-vehicle-page">
      <Navbar />
      <h1 className="update-vehicle-title">Vehicles Assigned Updates & Recent Logs</h1>

      {loadingVehicles && <p>Loading vehicles...</p>}
      {errorVehicles && <p className="error-message">{errorVehicles}</p>}

      {!loadingVehicles && vehicles.length === 0 && (
        <p className="no-vehicles">No vehicles with assigned updates found.</p>
      )}

      <div className="vehicle-list">
        {vehicles.map(vehicle => {
          const logs = logsByVehicle[vehicle._id] || [];
          const isExpanded = expandedVehicleId === vehicle._id;

          // Get latest log info if available
          const latestLog = logs.length > 0 ? logs[0] : null;

          return (
            <div key={vehicle._id} className="vehicle-card">
              <h2>{vehicle.name || vehicle.model || 'Vehicle'}</h2>
              <p>Model: {vehicle.model}</p>
              <p>VIN: {vehicle.vin || 'N/A'}</p>

              <p>
                <strong>Latest Update Status:</strong>{' '}
                {latestLog ? latestLog.status || 'No status' : 'No logs'}
              </p>
              {latestLog && latestLog.message && (
                <p><em>{latestLog.message}</em></p>
              )}

              <button
                className="update-btn"
                onClick={() => toggleLogs(vehicle._id)}
              >
                {isExpanded ? 'Hide Logs' : 'Show Recent Logs'}
              </button>

              {isExpanded && (
                <div className="logs-container">
                  {loadingLogs[vehicle._id] ? (
                    <p>Loading logs...</p>
                  ) : logs.length === 0 ? (
                    <p>No logs found.</p>
                  ) : (
                    <ul>
                      {logs.map(log => (
                        <li key={log._id}>
                          <strong>Status:</strong> {log.status} |{' '}
                          <strong>Progress:</strong> {log.progress}% |{' '}
                          <em>{log.message}</em> |{' '}
                          <small>{new Date(log.createdAt).toLocaleString()}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentLogsPage;
