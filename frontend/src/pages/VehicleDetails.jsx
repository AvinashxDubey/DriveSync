import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';         // import useNavigate
import '../styles/VehicleDetails.css';

import Loader from '../components/Loader';
import UpdateStatus from '../components/UpdateStatus';
import { getLogsByVehicle } from '../services/api';


const dummyLogs = [
  { id: 'dummy1', status: 'Pending', progress: 20, time: 'N/A' },
  { id: 'dummy2', status: 'Initializing', progress: 10, time: 'N/A' }
];

const dummyVehicle = {
  vin: '5YJ3E1EA7KF317420',
  make: 'Tesla',
  model: 'Model 3',
  year: 2024,
  color: '#87CEEB' // sky blue for card background
};

function VehicleDetails({ vin }) {
  const [logs, setLogs] = useState(dummyLogs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();   // initialize navigate

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        setError('');

        const response = await getLogsByVehicle(vin);

        if (response.data?.logs?.length > 0) {
          setLogs(response.data.logs);
        } else {
          setLogs([]);
        }
      } catch (err) {
        let message = 'Failed to fetch logs';
        if (err.response?.data?.message) {
          message = err.response.data.message;
        } else if (err.message) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    if (vin) {
      fetchLogs();
    } else {
      setError('Vehicle VIN is required');
      setLoading(false);
    }
  }, [vin]);

  // Handle click to navigate to AssignUpdate page for this vehicle
  const handleAssignClick = () => {
    // Navigate to /assign-update and pass the vin as query param or in state
    // For example, nav to /assign-update?vin=XYZ
    navigate(`/assign-update?vin=${dummyVehicle.vin}`);
    // or navigate(`/assign-update/${dummyVehicle.vin}`) — if you set such a route
  };

  return (
    <div className="wrapper">
      <main className="content">

        {/* Vehicle info card */}
        <div className="vehicleCard" style={{ backgroundColor: dummyVehicle.color }}>
          <h2>{dummyVehicle.year} {dummyVehicle.make} {dummyVehicle.model}</h2>
          <p><strong>VIN:</strong> {dummyVehicle.vin}</p>
          <button className="assignButton" onClick={handleAssignClick}>Assign Update</button>
        </div>

        {loading && <Loader />}

        {error && <div style={{ color: 'red', padding: '1rem' }}>{error}</div>}

        <div className="card">
          <h2>Vehicle Update Status</h2>
          <UpdateStatus logs={logs} />
          <h3 className="logHeader">Update Log History</h3>
          <ul className="logList">
            {logs.length === 0 ? (
              <li>No logs found for this vehicle.</li>
            ) : (
              logs.map(log => (
                <li key={log.id} className="logItem">
                  <div>
                    <span className="status">{log.status}</span>
                    <span className="progress">{log.progress}%</span>
                  </div>
                  <span className="logTime">{log.time || '-'}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default VehicleDetails;
