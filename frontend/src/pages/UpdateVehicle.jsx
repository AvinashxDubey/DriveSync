import React, { useEffect, useState } from "react";
import "../styles/UpdateVehicle.css";
import Navbar from "../components/Navbar";

const UpdateVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [progressMap, setProgressMap] = useState({}); // key: vehicleId, value: progress (0-100)
const [completedMap, setCompletedMap] = useState({}); // key: vehicleId, value: boolean

const [updatedMap, setUpdatedMap] = useState({});
  // Fetch vehicles with assigned updates
  useEffect(() => {
    const fetchVehiclesWithUpdates = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/update/vehicles-assigned-update", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


        if (!res.ok) throw new Error("Failed to fetch vehicles");
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiclesWithUpdates();
  }, []);

  // Handle update click using PATCH /start-update/vehicle/:id

const handleUpdateClick = async (vehicleId) => {
  try {
    setUpdating(vehicleId);
    setProgressMap(prev => ({ ...prev, [vehicleId]: 0 }));
    setCompletedMap(prev => ({ ...prev, [vehicleId]: false }));
    setUpdatedMap(prev => ({ ...prev, [vehicleId]: false }));

    // 1. Start the update
    const startRes = await fetch(`http://localhost:5000/api/update/start-update/vehicle/${vehicleId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    let startData;
    try {
      startData = await startRes.json();
    } catch {
      startData = null;
    }

    if (!startRes.ok) throw new Error(startData?.message || "Failed to start update");

    alert("Vehicle update started successfully!");

    // 2. Function to send a log update
    const sendUpdateLog = async (progress) => {
      const status = progress === 100 ? 'completed' : 'in progress';
      const message = `Update progress: ${progress}%`;
      await fetch(`http://localhost:5000/api/log/status/vehicle/${vehicleId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, message, progress }),
      });
      // Update progress state here
      setProgressMap(prev => ({ ...prev, [vehicleId]: progress }));
    };

    // 3. Simulate progress logs (e.g., every 1 second)
    for (let progress = 10; progress <= 100; progress += 10) {
      await sendUpdateLog(progress);
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second between updates
    }

    setCompletedMap(prev => ({ ...prev, [vehicleId]: true }));
    setUpdatedMap(prev => ({ ...prev, [vehicleId]: true })); // <-- Mark as updated
    alert("Update completed!");

  } catch (err) {
    console.error(err);
    alert(`Failed to start vehicle update: ${err.message}`);
  } finally {
    setUpdating(null);
  }
};


  return (
    <div className="update-vehicle-page">
      <Navbar />
      <h1 className="update-vehicle-title">Vehicles Assigned Updates</h1>

      {loading ? (
        <p className="no-vehicles">Loading...</p>
      ) : vehicles.length === 0 ? (
        <p className="no-vehicles">No vehicles with assigned updates found.</p>
      ) : (
        <div className="vehicle-list">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-card">
              {/* Show progress bar only if updating and progress not yet 100 */}
{updating === vehicle._id && progressMap[vehicle._id] > 0 && progressMap[vehicle._id] < 100 && (
  <div className="progress-bar-wrapper">
    <div
      className="progress-bar"
      style={{ width: `${progressMap[vehicle._id]}%` }}
    />
  </div>
)}

{completedMap[vehicle._id] && <p className="update-completed-text">Update Completed!</p>}

<h2>{vehicle.model || "Unknown Model"}</h2>
<p>VIN: {vehicle.vin}</p>
<p>Assigned Update: {vehicle.assignedUpdate?.version || "N/A"}</p>
<button
  className={`update-btn ${vehicle.updateInProgress ? 'in-progress' : ''}`}
  onClick={() => handleUpdateClick(vehicle._id)}
  disabled={updating === vehicle._id || vehicle.updateInProgress || updatedMap[vehicle._id]}
>
  {vehicle.updateInProgress
    ? 'Update In Progress'
    : updating === vehicle._id
    ? 'Updating...'
    : updatedMap[vehicle._id]
    ? 'Updated'
    : 'Start Update'}
</button>


            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateVehicle;
