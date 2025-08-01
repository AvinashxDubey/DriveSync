import React, { useEffect, useState } from 'react';
import {
  getAllVehicles,
  getAllUpdatePackages,
  assignUpdateToVehicle,
} from '../services/api';
import '../styles/UpdatePackage.css';

function UpdatePackage() {
  const [vehicles, setVehicles] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningFor, setAssigningFor] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleRes = await getAllVehicles();
        const updateRes = await getAllUpdatePackages();

        setVehicles(vehicleRes.data || vehicleRes);
        setUpdates(updateRes.data || updateRes);
      } catch (err) {
        console.error(err);
        setErrorMsg(
          err?.response?.data?.message || 'Failed to load vehicles or updates.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (e, vehicleId) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setAssigningFor(vehicleId);

    const updateToAssign = updates[0];

    if (!updateToAssign) {
      setErrorMsg('No updates available to assign.');
      setAssigningFor(null);
      return;
    }

    try {
      const res = await assignUpdateToVehicle(vehicleId, { updateId: updateToAssign._id });
      setSuccessMsg(res.message || `Update assigned to ${vehicleId} successfully.`);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || `Failed to assign update to ${vehicleId}.`
      );
    } finally {
      setAssigningFor(null);
    }
  };

  return (
    <div className="wrapper">
      <main className="content">
        <h2>Assign Latest Update to Vehicles</h2>

        {loading && <p>Loading...</p>}
        {errorMsg && <div className="errorMessage">{errorMsg}</div>}
        {successMsg && <div className="successMessage">{successMsg}</div>}

        <div className="vehicleCardsGrid">
          {!loading && vehicles.length === 0 && <p>No vehicles found.</p>}

          {vehicles.map(vehicle => (
            <div className="vehicleCard" key={vehicle._id}>
              <h3>
                {vehicle.model} <span className="vin">({vehicle.vin})</span>
              </h3>

              <form onSubmit={(e) => handleAssign(e, vehicle._id)}>
                {updates.length === 0 ? (
                  <p className="errorMessage">No updates available.</p>
                ) : (
                  <button
                    className="assignButton"
                    type="submit"
                    disabled={assigningFor === vehicle._id}
                  >
                    {assigningFor === vehicle._id ? 'Assigning...' : 'Assign Latest Update'}
                  </button>
                )}
              </form>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default UpdatePackage;
