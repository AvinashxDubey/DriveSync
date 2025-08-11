import React, { useEffect, useState } from 'react';
import { 
  getAllVehicles, 
  getAllUpdatePackages, 
  assignUpdateToVehicle 
} from '../services/api';
import Navbar from '../components/Navbar';

export default function AssignUpdate() {
  const [vehicles, setVehicles] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedUpdateId, setSelectedUpdateId] = useState('');
  const [manualUpdateId, setManualUpdateId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllVehicles()
      .then(res => setVehicles(res.data || res))
      .catch(err => {
        console.error('Error fetching vehicles:', err);
        setMessage('❌ Failed to load vehicles.');
      });

    getAllUpdatePackages()
      .then(res => setUpdates(res.data || res))
      .catch(err => {
        console.error('Error fetching updates:', err);
        setMessage('❌ Failed to load updates.');
      });
  }, []);

  // Helper to check valid MongoDB ObjectId format
  const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedVehicleId) {
      setMessage('⚠️ Please select a vehicle.');
      return;
    }

    // Prefer manualUpdateId if provided, otherwise use selectedUpdateId from dropdown
    const updateIdToAssign = manualUpdateId.trim() || selectedUpdateId;

    if (!updateIdToAssign) {
      setMessage('⚠️ Please select or enter an update ID.');
      return;
    }

    if (!isValidObjectId(updateIdToAssign)) {
      setMessage('⚠️ Invalid Update ID format. Must be 24 hex characters.');
      return;
    }

    console.log('Assigning update:', updateIdToAssign, 'to vehicle:', selectedVehicleId);

    try {
      const res = await assignUpdateToVehicle(selectedVehicleId, { updateId: updateIdToAssign });
      setMessage(res.data?.message || '✅ Update successfully assigned!');
      setSelectedVehicleId('');
      setSelectedUpdateId('');
      setManualUpdateId('');
    } catch (err) {
      console.error('Error assigning update:', err);
      // Show detailed message from backend or generic error
      setMessage(err?.response?.data?.message || '❌ Failed to assign update.');
    }
  };

  return (
  
    <div style={{ padding: '20px' }}>
        <Navbar/>
      <h2>Assign Update to Vehicle</h2>

      <form onSubmit={handleSubmit}>
        {/* Vehicle Dropdown */}
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Vehicle:</strong></label><br />
          <select 
            value={selectedVehicleId} 
            onChange={e => setSelectedVehicleId(e.target.value)}
            required
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
          <label><strong>Update Package (select from list):</strong></label><br />
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

        {/* Or manual Update ID input */}
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Or enter Update ID manually:</strong></label><br />
          <input 
            type="text" 
            value={manualUpdateId} 
            onChange={e => setManualUpdateId(e.target.value)} 
            placeholder="Enter updateId here" 
          />
        </div>

        {/* Submit Button */}
        <div style={{ marginBottom: '10px' }}>
          <button type="submit">Assign Update</button>
        </div>
      </form>   

      {/* Status Message */}
      {message && <p>{message}</p>}
    </div>
  );
}
