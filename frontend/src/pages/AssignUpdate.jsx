import React, { useEffect, useState } from 'react';
import { getAllVehicles, getAllUpdatePackages, assignUpdateToVehicle } from '../services/api';
import Navbar from '../components/Navbar';

export default function AssignUpdate() {
  const [vehicles, setVehicles] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedUpdateId, setSelectedUpdateId] = useState('');
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

  const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedVehicleId) {
      setMessage('⚠️ Please select a vehicle.');
      return;
    }

    if (!selectedUpdateId) {
      setMessage('⚠️ Please select an update package.');
      return;
    }

    if (!isValidObjectId(selectedUpdateId)) {
      setMessage('⚠️ Invalid Update ID format.');
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
      <Navbar />
      <h2>Assign Update to Vehicle</h2>

      <form onSubmit={handleSubmit}>
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

        <div style={{ marginBottom: '10px' }}>
          <label><strong>Update Package:</strong></label><br />
          <select 
            value={selectedUpdateId} 
            onChange={e => setSelectedUpdateId(e.target.value)} 
            required
          >
            <option value="">-- Select update package --</option>
            {updates.map(update => (
              <option key={update._id} value={update._id}>
                {update.version} - {update.description}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <button type="submit">Assign Update</button>
        </div>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
