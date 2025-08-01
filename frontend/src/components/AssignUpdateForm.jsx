import React, { useState } from 'react';
import '../styles/AssignUpdateForm.css';

function AssignUpdateForm({ vehicles, updates, onAssignUpdate, disabled }) {
  const [selectedUpdate, setSelectedUpdate] = useState({});
  const [assigningFor, setAssigningFor] = useState(null);
  const [successMessages, setSuccessMessages] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  const handleAssignClick = async (vehicleId, e) => {
    e.preventDefault();
    const updateId = selectedUpdate[vehicleId];

    if (!updateId) {
      setErrorMessages(prev => ({ ...prev, [vehicleId]: 'Please select an update.' }));
      return;
    }

    setAssigningFor(vehicleId);
    setErrorMessages(prev => ({ ...prev, [vehicleId]: '' }));
    setSuccessMessages(prev => ({ ...prev, [vehicleId]: '' }));

    try {
      await onAssignUpdate(vehicleId, updateId);
      setSuccessMessages(prev => ({ ...prev, [vehicleId]: 'Update assigned successfully!' }));
    } catch (err) {
      setErrorMessages(prev => ({
        ...prev,
        [vehicleId]: err.response?.data?.message || err.message || 'Failed to assign update.',
      }));
    } finally {
      setAssigningFor(null);
    }
  };

  if (vehicles.length === 0) return <p>No registered vehicles found.</p>;
  if (updates.length === 0) return <p>No update packages available.</p>;

  return (
    <div className="vehicleCardsGrid">
      {vehicles.map(vehicle => (
        <div className="vehicleCard" key={vehicle._id}>
          <h3>{vehicle.model || 'Unknown Model'}</h3>
          <p><strong>VIN:</strong> {vehicle.vin}</p>

          <form onSubmit={(e) => handleAssignClick(vehicle._id, e)}>
            <label>Select Update:</label>
            <select
              value={selectedUpdate[vehicle._id] || ''}
              onChange={(e) =>
                setSelectedUpdate(prev => ({ ...prev, [vehicle._id]: e.target.value }))
              }
              required
            >
              <option value="">-- Select an Update --</option>
              {updates.map(update => (
                <option key={update._id} value={update._id}>
                  {update.version} - {update.description || 'No description'}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={disabled || assigningFor === vehicle._id}
              className="assignButton"
            >
              {assigningFor === vehicle._id ? 'Assigning...' : 'Assign Update'}
            </button>
          </form>

          {successMessages[vehicle._id] && (
            <p className="successMessage">{successMessages[vehicle._id]}</p>
          )}
          {errorMessages[vehicle._id] && (
            <p className="errorMessage">{errorMessages[vehicle._id]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default AssignUpdateForm;
