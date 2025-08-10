import React, { useEffect, useState } from 'react';
import { 
  getAllVehicles, 
  getAllUpdatePackages, 
  assignUpdateToVehicle 
} from '../services/api';

export default function AssignUpdate() {
  const [vehicles, setVehicles] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedUpdateId, setSelectedUpdateId] = useState('');

  useEffect(() => {
    // Fetch registered vehicles for the logged-in user
    getAllVehicles()
      .then(res => {
        setVehicles(res.data || res); 
      })
      .catch(err => {
        console.error('Error fetching vehicles:', err);
        setMessage('❌ Failed to load vehicles.');
      });

    // Fetch available update packages
    getAllUpdatePackages()
      .then(res => {
        setUpdates(res.data || res);
      })
      .catch(err => {
        console.error('Error fetching updates:', err);
        setMessage('❌ Failed to load updates.');
      });
  }, []);

  const handleAssign = async () => {
    if (!selectedVehicleId || !selectedUpdateId) {
      setMessage('⚠️ Please select both a vehicle and an update.');
      return;
    }

    try {
      const res = await assignUpdateToVehicle(selectedVehicleId, { updateId: selectedUpdateId });
      setMessage(res.data?.message || '✅ Update successfully assigned!');
      setSelectedVehicleId('');
      setSelectedUpdateId('');
    } catch (err) {
      console.error('Error assigning update:', err);
      setMessage(err?.response?.data?.message || '❌ Failed to assign update.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Assign Update to Vehicle</h2>

      {/* Vehicle Dropdown */}
      <div style={{ marginBottom: '10px' }}>
        <label><strong>Vehicle:</strong></label>
        <select 
          value={selectedVehicleId} 
          onChange={e => setSelectedVehicleId(e.target.value)}
        >
          <option value="">-- Select vehicle --</option>
          {vehicles.map(vehicle => (
            <option key={vehicle._id} value={vehicle._id}>
              {vehicle.model} ({vehicle.vin})
            </option>
          ))}
        </select>
      </div>

      {/* Update Package Dropdown */}
      <div style={{ marginBottom: '10px' }}>
        <label><strong>Update Package:</strong></label>
        <select 
          value={selectedUpdateId} 
          onChange={e => setSelectedUpdateId(e.target.value)}
        >
          <option value="">-- Select update --</option>
          {updates.map(update => (
            <option key={update._id} value={update._id}>
              {update.version} - {update.description}
            </option>
          ))}
        </select>
      </div>

      {/* Assign Button */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleAssign}>Assign Update</button>
      </div>

      {/* Status Message */}
      {message && <p>{message}</p>}
    </div>
  );
}
