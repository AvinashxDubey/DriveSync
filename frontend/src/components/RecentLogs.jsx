import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import { getAllVehicles, getLogsByVehicle } from '../services/api';
import '../styles/RecentLogs.css';

function RecentLogs() {
  const [logsByVehicle, setLogsByVehicle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError('');
      try {
        // Fetch all vehicles for the user
        const vehicleRes = await getAllVehicles();
        const vehicles = vehicleRes.data?.vehicles || [];

        // For each vehicle, fetch its logs (in parallel)
        const logPromises = vehicles.map(v =>
          getLogsByVehicle(v.vin).then(logRes => ({
            vehicle: v,
            logs: logRes.data.logs || [],
          }))
        );
        const logsData = await Promise.all(logPromises);

        setLogsByVehicle(logsData);

      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Failed to load logs.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="recent-logs-wrapper">
      <main className="recent-logs-content">
        <h2>Recent Update Logs</h2>
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}

        {!loading && logsByVehicle.length === 0 && (
          <p>No vehicles or logs found.</p>
        )}

        <div className="logs-grid">
          {logsByVehicle.map(({ vehicle, logs }) => (
            <div className="log-card" key={vehicle._id}>
              <h3>{vehicle.model} <span className="vin">({vehicle.vin})</span></h3>
              {logs.length === 0 ? (
                <p className="no-logs">No logs for this vehicle.</p>
              ) : (
                <ul className="log-list">
                  {logs
                    // Optionally sort logs by most recent
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(log => (
                      <li key={log._id}>
                        <div>
                          <span className="log-date">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                          <br />
                          <strong>Status:</strong> {log.status || "N/A"}
                          {log.updatePackage && (
                            <>
                              <br />
                              <strong>Update:</strong> {log.updatePackage.name}
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RecentLogs;
