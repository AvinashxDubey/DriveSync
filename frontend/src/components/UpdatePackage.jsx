import React, { useEffect, useState } from 'react';
import {
  getAllVehicles,
  getAllUpdatePackages,
  assignUpdateToVehicle,
} from '../services/api'; // adjust the path if needed
import '../styles/UpdatePackage.css';

function UpdatePackage() {
  const [vehicles, setVehicles] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleRes = await getAllVehicles();
        const updateRes = await getAllUpdatePackages();

        setVehicles(vehicleRes.data || vehicleRes); // adapt if your backend sends {data: []}
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
    setAssigning(true);

    const updateId = e.target.elements[`update-${vehicleId}`].value;

    try {
      const res = await assignUpdateToVehicle(vehicleId, { updateId });
      setSuccessMsg(res.message || 'Update assigned successfully.');
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || 'Failed to assign update to vehicle.'
      );
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="wrapper">
      <main className="content">
        <h2>Assign Updates to Your Vehicles</h2>

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
                <div className="formGroup">
                  <label htmlFor={`update-${vehicle._id}`}>Choose Update</label>
                  <select
                    id={`update-${vehicle._id}`}
                    name={`update-${vehicle._id}`}
                    required
                    disabled={assigning}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Select Update --
                    </option>
                    {updates.map(update => (
                      <option key={update._id} value={update._id}>
                        {update.version}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="assignButton"
                  type="submit"
                  disabled={assigning}
                >
                  {assigning ? 'Assigning...' : 'Assign Update'}
                </button>
              </form>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default UpdatePackage;
